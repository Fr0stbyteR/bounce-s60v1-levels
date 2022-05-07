import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumBlowVariant {
    bottom,
    left,
    top,
    right
}

export default class Blow extends GameObjectWithVariant<EnumBlowVariant> implements IBounceGameObject {
    static VARIANT = EnumBlowVariant;
    static TEXTURES = [
        "obstacle.021.png",
        "obstacle.022.png",
        "obstacle.023.png",
        "obstacle.024.png"
    ];

    readonly type: BounceGameObjectType = "blow";
}
