import { IBounceGameObject } from "./types";
import Brick from "./Brick";

export default class Water extends Brick implements IBounceGameObject {
    static TEXTURES = ["obstacle.011.png"];
    readonly type = "water";
}
