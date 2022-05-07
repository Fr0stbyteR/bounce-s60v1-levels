const { Buffer } = require("buffer");
const path = require("path");
const fs = require("fs");

const fn = "./level.021";

const levelJson = fs.readFileSync(fn + ".json", { encoding: "utf-8" });

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
const levelData = JSON.parse(levelJson);

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
 * @type {Record<ObjectType, number>}
 */
const OBJID = {
    "brick": 0x00,
    "brick_tri": 0x01,
    "ring": 0x02,
    "moving_spike": 0x03,
    "spike": 0x04,
    "roll": 0x05,
    "bigger": 0x06,
    "smaller": 0x07,
    "water": 0x08,
    "end": 0x09,
    "moving_plat": 0x0A,
    "bounce": 0x0B,
    "suck": 0x0C,
    "blow": 0x0D,
    "bonus": 0x0E,
    "inverse": 0x0F,
    "bounce_tri": 0x10,
    "haccel": 0x11,
    "vaccel": 0x12,
    "ring_big": 0x13
};

let i = 0;

const levelArray = [];
/** @type {Buffer} */
let buffer;
// header1
levelArray.push(...[0x12, 0x5A, 0x00, 0x10]);
levelArray.push(...levelData.header1);
if (levelData.filename) {
    levelArray.push(levelData.filename.length);
    buffer = Buffer.from(levelData.filename, "utf16le");
    levelArray.push(...buffer);
} else {
    levelArray.push(0);
}
// header2
levelArray.push(...[0x12, 0x5A, 0x00, 0x10]);
levelArray.push(...levelData.header2);
// initialPos
buffer = Buffer.alloc(8);
buffer.writeInt32LE(levelData.initialPos[0]);
buffer.writeInt32LE(levelData.initialPos[1], 4);
levelArray.push(...buffer);

levelArray.push(levelData.initialBall);

buffer = Buffer.alloc(2);
buffer.writeUint16LE(levelData.objects.length);
levelArray.push(...buffer);

levelArray.push(...levelData.code1);

for (let i = 0; i < levelData.objects.length; i++) {
    const obj = levelData.objects[i];
    const { type } = obj;
    levelArray.push(OBJID[type]);
    
    if (type === "bonus" || type === "ring" || type === "ring_big"
    || type === "spike" || type === "smaller" || type === "bigger"
    || type === "blow" || type === "suck" || type === "roll"
    || type === "haccel" || type === "vaccel" || type === "inverse") {
        buffer = Buffer.alloc(1);
        buffer.writeUint8(obj.variant);
        levelArray.push(...buffer);
    }
    buffer = Buffer.alloc(4);
    if (type === "moving_spike" || type === "moving_plat") {
        buffer.writeInt16LE(obj.pos[0], 2);
        buffer.writeInt16LE(obj.pos[1]);
    } else {
        buffer.writeInt16LE(obj.pos[0]);
        buffer.writeInt16LE(obj.pos[1], 2);
    }
    levelArray.push(...buffer);
    if (type === "brick" || type === "bounce" || type === "water") {
        buffer = Buffer.alloc(4);
        buffer.writeInt16LE(obj.pos2[0]);
        buffer.writeInt16LE(obj.pos2[1], 2);
        levelArray.push(...buffer);
    } else if (type === "roll") {
        levelArray.push(...obj.data);
    } else if (type === "brick_tri" || type === "bounce_tri") {
        levelArray.push(...obj.data);
    } else if (type === "moving_spike" || type === "moving_plat") {
        levelArray.push(...obj.data);
    }
}
levelArray.push(levelData.title.length * 4);
buffer = Buffer.from(levelData.title, "ascii");
levelArray.push(...buffer);
levelArray.push(levelData.asset1.length * 4);
buffer = Buffer.from(levelData.asset1, "ascii");
levelArray.push(...buffer);
levelArray.push(...[0xFF, 0xFF, 0xFF]);

console.log(levelArray.length);

fs.writeFileSync("./level.022", Buffer.from(levelArray));
