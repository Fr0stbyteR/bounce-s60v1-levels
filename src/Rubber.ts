import { IBounceGameObject } from "./types";
import Brick from "./Brick";

export default class Rubber extends Brick implements IBounceGameObject {
    static TEXTURES = ["obstacle.009.png"];
    readonly type = "bounce";
}
