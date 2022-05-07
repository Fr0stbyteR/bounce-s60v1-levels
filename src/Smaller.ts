import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumSmallerVariant {
    up,
    right,
    bottom,
    left
}

export default class Smaller extends GameObjectWithVariant<EnumSmallerVariant> implements IBounceGameObject {
    static VARIANT = EnumSmallerVariant;
    static TEXTURES = [
        "obstacle.033.png",
        "obstacle.034.png"
    ];

    readonly type: BounceGameObjectType = "smaller";
}
