import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

class FastCarMod extends PolyMod {
    preInit(pml) {
        // Set multiplier: 1.5 = 50% faster acceleration & speed, 2.0 = 2x speed
        const SPEED_MULTIPLIER = 1.5;

        // Hook into the simulation worker's step/interval loop
        pml.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: "self.onmessage=",
            code: `
                const _origSetInterval = self.setInterval;
                self.setInterval = function(fn, delay, ...args) {
                    return _origSetInterval(fn, delay / ${SPEED_MULTIPLIER}, ...args);
                };
            `
        });
    }
}

export let polyMod = new FastCarMod();
