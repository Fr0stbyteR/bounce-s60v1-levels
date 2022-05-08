import { IBounceGameObject } from "./types";
import GameObjectWithPos2 from "./GameObjectWithPos2";

export default class Rubber extends GameObjectWithPos2 implements IBounceGameObject {
    static TEXTURES = ["obstacle.009.png"];
    readonly type = "bounce";
}
