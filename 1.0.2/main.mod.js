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
            type: MixinType.REPLACEBETWEEN,
            tokenStart: `"updateCarModel"`,
            tokenEnd: `.slice().buffer;`,
            func: `
                "updateCarModel",
                "void",
                ["number", "boolean", "boolean", "boolean", "boolean", "boolean", "number"],
                [e.id, r.up, r.right, r.down, r.left, r.reset, i]
              );
              const _outBuf = new Uint8Array(t.HEAPU8.buffer, i, 227).slice();
              const _realFrames = e.frames | 0;
              _outBuf.set([
                  _realFrames & 255,
                  (_realFrames >> 8) & 255,
                  (_realFrames >> 16) & 255
              ], 0);
              if (_outBuf.at(7) & 2) {
                  _outBuf.set([
                      _realFrames & 255,
                      (_realFrames >> 8) & 255,
                      (_realFrames >> 16) & 255
                  ], 8);
              }
              return _outBuf.buffer;
            `
        });
    };
}

export let polyMod = new FastCarMod();
