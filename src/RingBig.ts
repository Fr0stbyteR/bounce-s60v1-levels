import { BounceGameObjectType, IBounceGameObject } from "./types";
import Ring from "./Ring";

export default class RingBig extends Ring implements IBounceGameObject {
    static TEXTURES = [
        "obstacle.037.png",
        "obstacle.038.png",
        "obstacle.039.png",
        "obstacle.040.png"
    ];
    
    readonly type: BounceGameObjectType = "ring_big";
}
