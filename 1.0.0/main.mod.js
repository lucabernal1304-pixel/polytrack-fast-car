import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

class FastCarMod extends PolyMod {
    preInit(pml) {
        console.log("[FastCarMod] preInit registered!");
        const SPEED_MULTIPLIER = 2;

        pml.registerSimWorkerMixin({
            type: MixinType.REPLACE,
            token: `r.push(n(t,e))`,
            func: `(() => {
                if (!self._fastCarLogged) {
                    console.log("[FastCarMod] Physics boost active:", ${SPEED_MULTIPLIER} + "x");
                    self._fastCarLogged = true;
                }
                self._extraStepAcc = (self._extraStepAcc || 0) + (${SPEED_MULTIPLIER} - 1);
                while (self._extraStepAcc >= 1) {
                    n(t, e);
                    self._extraStepAcc -= 1;
                }
                return r.push(n(t, e));
            })()`
        });
    }
}

export let polyMod = new FastCarMod();
