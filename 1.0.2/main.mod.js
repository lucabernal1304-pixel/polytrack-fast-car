import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

console.log("[FastCarMod] File loaded!");

class FastCarMod extends PolyMod {
    init = (pmlInstance) => {
        console.log("[FastCarMod] Applying WASM engine & top-speed boost...");

        // PhysicsMixinType.PATCH_F32 = 0 in TypeScript enum
        const PATCH_F32 = 0;

        // 1. Increase top speed cap (vanilla = 155 -> 350 for ~2.25x top speed)
        pmlInstance.registerPhysicsMixin({
            type: PATCH_F32,
            offset: 195259,
            value: 350.0
        });

        // 2. Increase engine acceleration force (vanilla = 46 -> 115 for 2.5x acceleration)
        pmlInstance.registerPhysicsMixin({
            type: PATCH_F32,
            offset: 195269,
            value: 115.0
        });

        pmlInstance.registerPhysicsMixin({
            type: PATCH_F32,
            offset: 195276,
            value: 115.0
        });
    };
}

export let polyMod = new FastCarMod();
