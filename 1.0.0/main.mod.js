import { PolyMod, MixinType } from "https://polymodloader.com";

class FastCarMod extends PolyMod {
    preInit(pml) {
        const SPEED_MULTIPLIER = 1.5;

        pml.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: "self.onmessage=",
            func: `
                const _origSetInterval = self.setInterval;
                self.setInterval = function(fn, delay, ...args) {
                    return _origSetInterval(fn, delay / ${SPEED_MULTIPLIER}, ...args);
                };
            `
        });
    }
}

export let polyMod = new FastCarMod();
