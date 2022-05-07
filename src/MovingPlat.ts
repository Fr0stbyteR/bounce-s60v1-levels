import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectMoving from "./GameObjectMoving";

export default class MovingPlat extends GameObjectMoving implements IBounceGameObject {
    static TEXTURES = ["obstacle.016.png"];

    readonly type: BounceGameObjectType = "moving_plat";
}
