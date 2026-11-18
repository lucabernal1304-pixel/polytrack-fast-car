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

        // 2. Sync the 24-bit frame/timer bytes in each buffer of r to real 1.0x car.frames
        pmlInstance.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: `for (const { car: t, controls: e } of i) r.push(n(t, e));`,
            func: `
                r.forEach((_buf, _idx) => {
                    const _dv = new DataView(_buf);
                    const _realFrames = i.slice(_idx, _idx + 1).pop().car.frames | 0;
                    _dv.setUint8(0, _realFrames & 255);
                    _dv.setUint8(1, (_realFrames >> 8) & 255);
                    _dv.setUint8(2, (_realFrames >> 16) & 255);
                    if (_dv.getUint8(7) & 2) {
                        _dv.setUint8(8, _realFrames & 255);
                        _dv.setUint8(9, (_realFrames >> 8) & 255);
                        _dv.setUint8(10, (_realFrames >> 16) & 255);
                    }
                });
            `
        });
    };
}

export let polyMod = new FastCarMod();
