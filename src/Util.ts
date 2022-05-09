import { BounceGameObjectType } from "./types";
import Brick from "./Brick";
import BrickTriangle from "./BrickTriangle";
import Ring from "./Ring";
import MovingSpike from "./MovingSpike";
import Spike from "./Spike";
import Roll from "./Roll";
import Bigger from "./Bigger";
import Smaller from "./Smaller";
import Water from "./Water";
import End from "./End";
import MovingPlat from "./MovingPlat";
import Rubber from "./Rubber";
import Suck from "./Suck";
import Blow from "./Blow";
import Bonus from "./Bonus";
import Inverse from "./Inverse";
import RubberTriangle from "./RubberTriangle";
import HAccel from "./HAccel";
import VAccel from "./VAccel";
import RingBig from "./RingBig";

export const gameObjectIds: BounceGameObjectType[] = [
    "brick",
    "brick_tri",
    "ring",
    "moving_spike",
    "spike",
    "roll",
    "bigger",
    "smaller",
    "water",
    "end",
    "moving_plat",
    "rubber",
    "suck",
    "blow",
    "bonus",
    "inverse",
    "rubber_tri",
    "haccel",
    "vaccel",
    "ring_big"
];

export const gameObjectConstructors = [
    Brick,
    BrickTriangle,
    Ring,
    MovingSpike,
    Spike,
    Roll,
    Bigger,
    Smaller,
    Water,
    End,
    MovingPlat,
    Rubber,
    Suck,
    Blow,
    Bonus,
    Inverse,
    RubberTriangle,
    HAccel,
    VAccel,
    RingBig
];
