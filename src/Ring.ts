import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumRingVariant {
    horizontal,
    vertical
}

export default class Ring extends GameObjectWithVariant<EnumRingVariant> implements IBounceGameObject {
    static VARIANT = EnumRingVariant;
    static BYTES = 5;
    static TEXTURES = [
        "obstacle.041.png",
        "obstacle.042.png",
        "obstacle.043.png",
        "obstacle.044.png"
    ];
    readonly type: BounceGameObjectType = "ring";
}
