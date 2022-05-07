import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumBonusVariant {
    save,
    life
}

export default class Bonus extends GameObjectWithVariant<EnumBonusVariant> implements IBounceGameObject {
    static VARIANT = EnumBonusVariant;
    static TEXTURES = [
        "obstacle.001.png",
        "obstacle.002.png",
        "obstacle.003.png",
        "obstacle.004.png",
        "obstacle.005.png",
        "obstacle.006.png",
        "obstacle.007.png",
        "obstacle.008.png",
    ];

    readonly type: BounceGameObjectType = "bonus";
}
