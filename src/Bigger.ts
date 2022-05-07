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
        "obstacle.031.png",
        "obstacle.032.png"
    ];

    readonly type: BounceGameObjectType = "bigger";
}
