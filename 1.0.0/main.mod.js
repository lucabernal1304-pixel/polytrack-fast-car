import { PolyMod, MixinType } from "https://polymodloader.com";

class FastCarMod extends PolyMod {
    preInit(pml) {
        const SPEED_MULTIPLIER = 1.6;

        pml.registerSimWorkerMixin({
            type: MixinType.INSERT,
            token: "self.onmessage=",
            func: `
                const _origNow = performance.now.bind(performance);
                const _startNow = _origNow();
                performance.now = function() {
                    return _startNow + (_origNow() - _startNow) * ${SPEED_MULTIPLIER};
                };
            `
        });
    }
}

export let polyMod = new FastCarMod();
