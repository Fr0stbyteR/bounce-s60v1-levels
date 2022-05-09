import BrickTriangle from "./BrickTriangle";
import { BounceGameObjectType, IBounceGameObject } from "./types";

export default class RubberTriangle extends BrickTriangle implements IBounceGameObject {
    static TEXTURES = ["obstacle.009.png"];
    readonly type: BounceGameObjectType = "rubber_tri";
}
