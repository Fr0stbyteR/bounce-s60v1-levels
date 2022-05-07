import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumBiggerVariant {
    up,
    right,
    bottom,
    left
}

export default class Bigger extends GameObjectWithVariant<EnumBiggerVariant> implements IBounceGameObject {
    static VARIANT = EnumBiggerVariant;
    static TEXTURES = [
        "obstacle.033.png",
        "obstacle.034.png"
    ];

    readonly type: BounceGameObjectType = "bigger";
}
