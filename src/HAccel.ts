import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumHAccelVariant {
    up,
    right,
    bottom,
    left
}

export default class HAccel extends GameObjectWithVariant<EnumHAccelVariant> implements IBounceGameObject {
    static VARIANT = EnumHAccelVariant;
    static TEXTURES = [
        "obstacle.027.png",
        "obstacle.028.png"
    ];

    readonly type: BounceGameObjectType = "haccel";
}
