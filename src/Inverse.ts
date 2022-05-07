import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumInverseVariant {
    up,
    right,
    bottom,
    left
}

export default class Inverse extends GameObjectWithVariant<EnumInverseVariant> implements IBounceGameObject {
    static VARIANT = EnumInverseVariant;
    static TEXTURES = [
        "obstacle.025.png",
        "obstacle.026.png"
    ];

    readonly type: BounceGameObjectType = "inverse";
}
