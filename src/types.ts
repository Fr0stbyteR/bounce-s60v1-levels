import { Buffer } from "buffer";
import Bigger from "./Bigger";
import Blow from "./Blow";
import Bonus from "./Bonus";
import Brick from "./Brick";
import BrickTriangle from "./BrickTriangle";
import End from "./End";
import HAccel from "./HAccel";
import Inverse from "./Inverse";
import MovingPlat from "./MovingPlat";
import MovingSpike from "./MovingSpike";
import Ring from "./Ring";
import RingBig from "./RingBig";
import Roll from "./Roll";
import Rubber from "./Rubber";
import RubberTriangle from "./RubberTriangle";
import Smaller from "./Smaller";
import Spike from "./Spike";
import Suck from "./Suck";
import VAccel from "./VAccel";
import Water from "./Water";

export type BounceGameObjectType = "brick" | "brick_tri" | "bounce" | "bounce_tri" | "water"
    | "smaller" | "bigger" 
    | "ring" | "ring_big" 
    | "spike" | "moving_spike" | "moving_plat"
    | "bonus" | "blow" | "suck" | "roll"
    | "haccel" | "vaccel" | "inverse"
    | "end";

export interface IBounceGameObject {
    type: BounceGameObjectType;
    pos: [number, number];
    toBinary(): Buffer;
}
export type BounceGameObject = Brick | BrickTriangle | Rubber | RubberTriangle | Water
    | Smaller | Bigger
    | Ring | RingBig
    | Spike | MovingSpike | MovingPlat
    | Bonus | Blow | Suck | Roll
    | HAccel | VAccel | Inverse
    | End;

export interface LevelInitData {
    filename?: string;
    initialPos: [number, number];
    initialBallIsBig: boolean;
    objects: BounceGameObject[];
    title?: string;
    asset1?: string;
}
