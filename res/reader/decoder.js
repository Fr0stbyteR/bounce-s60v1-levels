const { Buffer } = require("buffer");
const path = require("path");
const fs = require("fs");

const fn = "./level.021";

const level = fs.readFileSync(fn);

/**
 * @typedef {"brick" | "brick_tri" | "water" |
 * "smaller" | "bigger" | 
 * "ring" | "ring_big" | 
 * "spike" | "moving_spike" | "moving_plat" |
 * "bonus" | "bounce" | "bounce_tri" |
 * "blow" | "suck" | "roll" |
 * "haccel" | "vaccel" | "inverse" |
 * "end"} ObjectType 
 */
/**
 * @type {Record<number, ObjectType>}
 */
const OBJID = {
    0x00: "brick",
    0x01: "brick_tri",
    0x02: "ring",
    0x03: "moving_spike",
    0x04: "spike",
    0x05: "roll",
    0x06: "bigger",
    0x07: "smaller",
    0x08: "water",
    0x09: "end",
    0x0A: "moving_plat",
    0x0B: "bounce",
    0x0C: "suck",
    0x0D: "blow",
    0x0E: "bonus",
    0x0F: "inverse",
    0x10: "bounce_tri",
    0x11: "haccel",
    0x12: "vaccel",
    0x13: "ring_big"
};


const l = level.length;

let i = 0;

/**
 * @typedef {{
 *  type: ObjectType;
 *  variant?: number;
 *  pos: [number, number];
 *  pos2?: [number, number];
 *  data?: number[];
 * }} LevelObject
 */

/**
 * @type {{
 *  header1: Uint8Array;
 *  filename?: string;
 *  header2: Uint8Array;
 *  objCount: number;
 *  initialPos: [number, number];
 *  initialBall: number;
 *  code1: Uint8Array;
 *  objects: LevelObject[];
 *  code2: Uint8Array;
 *  title: string;
 *  asset1: string;
 * }}
 */
const levelData = {};

if (!Buffer.from([0x12, 0x5A, 0x00, 0x10]).equals(level.subarray(i, i + 4))) throw new Error("Header 1 error");
i += 4;
levelData.header1 = [...level.subarray(i, i + 5)];
i += 5;
const filenameLength = level.readUInt8(i) * 2;
i += 1;
if (filenameLength) {
    levelData.filename = level.subarray(i, i + filenameLength).toString("utf16le");
    i += filenameLength;
}

if (!Buffer.from([0x12, 0x5A, 0x00, 0x10]).equals(level.subarray(i, i + 4))) throw new Error("Header 2 error");
i += 4;
const header2StrCode = level.subarray(i + 1, i + 5);
levelData.header2 = [...level.subarray(i, i + 5)];
i += 5;
if (!Buffer.from("NGDX").equals(header2StrCode)) throw new Error("Header 2 not NGDX");

levelData.initialPos = [level.readInt32LE(i), level.readInt32LE(i + 4)];
i += 8;

levelData.initialBall = level.readUint8(i);
i += 1;

levelData.objCount = level.readUint16LE(i);
i += 2;

levelData.code1 = [...level.subarray(i, i + 2)];
i += 2;

levelData.objects = [];
/** @type {ObjectType} */
let type;

while (level.readUint8(i) in OBJID) {
    /** @type {LevelObject} */
    const obj = {};
    type = OBJID[level.readUint8(i)];
    obj.type = type;
    i += 1;
    if (type === "bonus" || type === "ring" || type === "ring_big"
        || type === "spike" || type === "smaller" || type === "bigger"
        || type === "blow" || type === "suck" || type === "roll"
        || type === "haccel" || type === "vaccel" || type === "inverse") {
        obj.variant = level.readUint8(i);
        i += 1;
    }
    obj.pos = [level.readInt16LE(i), level.readInt16LE(i + 2)];
    i += 4;
    if (type === "brick" || type === "bounce" || type === "water") {
        obj.pos2 = [level.readInt16LE(i), level.readInt16LE(i + 2)];
        i += 4;
    } else if (type === "roll") {
        obj.data = [...level.subarray(i, i + 2)];
        i += 2;
    } else if (type === "brick_tri" || type === "bounce_tri") {
        obj.data = [...level.subarray(i, i + 3)];
        i += 3;
    } else if (type === "moving_spike" || type === "moving_plat") {
        obj.pos = [obj.pos[1], obj.pos[0]];
        obj.data = [...level.subarray(i, i + 12)];
        i += 12;
    }
    levelData.objects.push(obj);
}

console.log("objects end at " + i.toString(16));

const titleLength = level.readUint8(i) / 4;
i += 1;

levelData.title = level.subarray(i, i + titleLength).toString("ascii");
i += titleLength;

const assetLength = level.readUint8(i) / 4;
i += 1;

levelData.asset1 = level.subarray(i, i + assetLength).toString("ascii");
i += assetLength;

console.log(levelData);

fs.writeFileSync(fn + ".json", JSON.stringify(levelData, undefined, 4), { encoding: "utf-8" });
