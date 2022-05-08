import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithPos2 from "./GameObjectWithPos2";

export default class Brick extends GameObjectWithPos2 implements IBounceGameObject {
    static TEXTURES = ["brick1.000.png"];
    readonly type: BounceGameObjectType = "brick";
}
