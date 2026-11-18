import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

console.log("[FastCarMod] File loaded!");

class FastCarMod extends PolyMod {
    init = (pmlInstance) => {
        console.log("[FastCarMod] init() called!");
        const SPEED_MULTIPLIER = 2;

        // 1. Run extra physics sub-steps for faster acceleration & top speed
        pmlInstance.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: `const r = [];`,
            func: `
                if (i.length > 0) {
                    if (!self._fastCarLogged) {
                        console.log("[FastCarMod] Physics boost active:", ${SPEED_MULTIPLIER} + "x");
                        self._fastCarLogged = true;
                    }
                    self._extraStepAcc = (self._extraStepAcc || 0) + (${SPEED_MULTIPLIER} - 1);
                    while (self._extraStepAcc >= 1) {
                        for (const { car: _fcCar, controls: _fcCtrl } of i) {
                            n(_fcCar, _fcCtrl);
                        }
                        self._extraStepAcc -= 1;
                    }
                }
            `
        });

        // 2. Sync the 24-bit frame/timer bytes (0..2 and finish frames 8..10) to real 1.0x e.frames
        pmlInstance.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: `[e.id, r.up, r.right, r.down, r.left, r.reset, i],`,
            func: `
                );
                {
                    const _view = new Uint8Array(t.HEAPU8.buffer, i, 227);
                    const _realFrames = e.frames | 0;
                    _view[0] = _realFrames & 255;
                    _view[1] = (_realFrames >> 8) & 255;
                    _view[2] = (_realFrames >> 16) & 255;
                    if (_view[7] & 2) {
                        _view[8] = _realFrames & 255;
                        _view[9] = (_realFrames >> 8) & 255;
                        _view[10] = (_realFrames >> 16) & 255;
                    }
                }
                void (0
            `
        });
    };
}

export let polyMod = new FastCarMod();
