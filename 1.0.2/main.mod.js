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

        // 2. Keep the HUD race timer synced to 1.0x real time (car.frames)
        pmlInstance.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: `return new Uint8Array(t.HEAPU8.buffer, i, 227).slice().buffer;`,
            func: `
                /* Sync frame counter in state buffer to real 1.0x frames */
            `
        });
    };
}

export let polyMod = new FastCarMod();
