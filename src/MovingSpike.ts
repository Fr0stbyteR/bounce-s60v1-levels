import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectMoving from "./GameObjectMoving";

export default class MovingSpike extends GameObjectMoving implements IBounceGameObject {
    static TEXTURES = ["obstacle.010.png"];

    readonly type: BounceGameObjectType = "moving_spike";
}
