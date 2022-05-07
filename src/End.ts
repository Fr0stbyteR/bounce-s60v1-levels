import { Buffer } from "buffer";
import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithPos from "./GameObjectWithPos";

export default class End extends GameObjectWithPos implements IBounceGameObject {
    static TEXTURES = ["obstacle.000.png"];
    
    readonly type: BounceGameObjectType = "end";
}
