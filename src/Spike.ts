import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumSpikeVariant {
    up,
    right,
    bottom,
    left
}

export default class Spike extends GameObjectWithVariant<EnumSpikeVariant> implements IBounceGameObject {
    static VARIANT = EnumSpikeVariant;
    static TEXTURES = [
        "obstacle.035.png",
        "obstacle.036.png"
    ];

    readonly type: BounceGameObjectType = "spike";
}
