import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumSuckVariant {
    bottom,
    left,
    top,
    right
}

export default class Suck extends GameObjectWithVariant<EnumSuckVariant> implements IBounceGameObject {
    static VARIANT = EnumSuckVariant;
    static TEXTURES = [
        "obstacle.017.png",
        "obstacle.018.png",
        "obstacle.019.png",
        "obstacle.020.png"
    ];

    readonly type: BounceGameObjectType = "suck";
}
