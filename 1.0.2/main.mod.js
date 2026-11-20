import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

console.log("[FastCarMod] File loaded!");

class FastCarMod extends PolyMod {
    preInit = (pmlInstance) => {
        console.log("[FastCarMod] preInit() registering WASM engine boost...");

        // Patch engine force (vanilla = 4000 -> 12000 for 3x engine power & higher top speed)
        pmlInstance.registerPhysicsMixin({
            type: 0,
            offset: 194624,
            value: 100000.0
        });
    };
}

export let polyMod = new FastCarMod();
