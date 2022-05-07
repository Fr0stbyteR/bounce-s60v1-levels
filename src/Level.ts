import { BounceGameObject, LevelInitData } from "./types";
import { Buffer } from "buffer";
import { gameObjectConstructors, gameObjectIds } from "./Util";

export default class Level {
    static fromBinary(buffer: Buffer, index: number) {
        let i = index;
        if (!Buffer.from([0x12, 0x5A, 0x00, 0x10]).equals(buffer.slice(i, i + 4))) throw new Error("Header 1 error");
        i += 4;
        const header1 = [...buffer.subarray(i, i + 5)];
        i += 5;
        const filenameLength = buffer.readUInt8(i) * 2;
        i += 1;
        let filename: string;
        if (filenameLength) {
            filename = buffer.slice(i, i + filenameLength).toString("utf16le");
            i += filenameLength;
        }
        if (!Buffer.from([0x12, 0x5A, 0x00, 0x10]).equals(buffer.slice(i, i + 4))) throw new Error("Header 2 error");
        i += 4;
        const header2StrCode = buffer.slice(i + 1, i + 5);
        const header2 = [...buffer.slice(i, i + 5)];
        i += 5;
        if (!Buffer.from("NGDX").equals(header2StrCode)) throw new Error("Header 2 not NGDX");

        const initialPos: [number, number] = [buffer.readInt32LE(i), buffer.readInt32LE(i + 4)];
        i += 8;
        const initialBall = buffer.readUInt8(i);
        i += 1;
        const objCount = buffer.readUInt16LE(i);
        i += 2;
        const code1 = [...buffer.subarray(i, i + 2)];
        i += 2;

        const objects: BounceGameObject[] = [];

        while (buffer.readUInt8(i) <= 0x13) {
            const Ctor = gameObjectConstructors[buffer.readUInt8(i)];
            i += 1;
            const slice = buffer.slice(i, i + Ctor.BYTES);
            const obj = Ctor.fromBinary(buffer, i) as BounceGameObject;
            if (!obj.toBinary().equals(slice)) console.warn(obj, "binary mismatch");
            objects.push(obj);
            i += Ctor.BYTES;
        }

                
        const titleLength = buffer.readUInt8(i) / 4;
        i += 1;
        const title = buffer.slice(i, i + titleLength).toString("ascii");
        i += titleLength;

        const assetLength = buffer.readUInt8(i) / 4;
        i += 1;
        const asset1 = buffer.slice(i, i + assetLength).toString("ascii");
        i += assetLength;

        return new this({ filename, initialPos, initialBallIsBig: !!initialBall, objects, title, asset1 })
    }
    /** ignored */
    filename?: string;
    initialPos: [number, number] = [0, 0];
    initialBallIsBig = false;
    objects: BounceGameObject[] = [];
    /** ignored */
    title?: string;
    /** ignored */
    asset1?: string;
    
    constructor(data: LevelInitData) {
        this.filename = data.filename;
        this.initialPos = data.initialPos.slice() as [number, number];
        this.initialBallIsBig = !!data.initialBallIsBig;
        this.objects = data.objects || [];
        this.title = data.title || "Your Starter for Ten";
        this.asset1 = data.asset1 || "brick1.mbm";
    }
    toBinary() {
        const levelArray: number[] = [];
        let buffer: Buffer;
        // header1
        levelArray.push(0x12, 0x5A, 0x00, 0x10);
        levelArray.push(0, 0, 0, 0, 0);
        if (this.filename) {
            levelArray.push(this.filename.length);
            buffer = Buffer.from(this.filename, "utf16le");
            levelArray.push(...buffer);
        } else {
            levelArray.push(0);
        }
        // header2
        levelArray.push(0x12, 0x5A, 0x00, 0x10);
        levelArray.push(0, ...Buffer.from("NGDX", "ascii"));
        // initialPos
        buffer = Buffer.alloc(8);
        buffer.writeInt32LE(this.initialPos[0], 0);
        buffer.writeInt32LE(this.initialPos[1], 4);
        levelArray.push(...buffer);
        
        levelArray.push(+this.initialBallIsBig);
        
        buffer = Buffer.alloc(2);
        buffer.writeUInt16LE(this.objects.length, 0);
        levelArray.push(...buffer);
        
        levelArray.push(0, 0);
        
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            const typeId = gameObjectIds.indexOf(obj.type);
            levelArray.push(typeId);
            levelArray.push(...obj.toBinary());
        }

        levelArray.push(this.title.length * 4);
        buffer = Buffer.from(this.title, "ascii");
        levelArray.push(...buffer);
        levelArray.push(this.asset1.length * 4);
        buffer = Buffer.from(this.asset1, "ascii");
        levelArray.push(...buffer);
        levelArray.push(...[0xFF, 0xFF, 0xFF]);
        
        return Buffer.from(levelArray);
    }
}
