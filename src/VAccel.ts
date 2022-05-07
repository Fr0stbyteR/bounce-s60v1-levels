import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumVAccelVariant {
    up,
    right,
    bottom,
    left
}

export default class VAccel extends GameObjectWithVariant<EnumVAccelVariant> implements IBounceGameObject {
    static VARIANT = EnumVAccelVariant;
    static TEXTURES = [
        "obstacle.029.png",
        "obstacle.030.png"
    ];

    readonly type: BounceGameObjectType = "vaccel";
}
