import { PolyMod, MixinType } from "https://polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

class FastCarMod extends PolyMod {
    preInit(pml) {
        // 1 = normal speed, 2 = 2x acceleration & top speed, 1.5 = 1.5x speed
        const SPEED_MULTIPLIER = 1.5;

        pml.registerSimWorkerMixin({
            type: MixinType.REPLACE,
            token: `for(const{car:t,controls:e}of i)r.push(n(t,e));`,
            func: `
                let _extraStepAcc = 0;
                for (const { car: t, controls: e } of i) {
                    _extraStepAcc += (${SPEED_MULTIPLIER} - 1);
                    while (_extraStepAcc >= 1) {
                        n(t, e);
                        _extraStepAcc -= 1;
                    }
                    r.push(n(t, e));
                }
            `
        });
    }
}

export let polyMod = new FastCarMod();
