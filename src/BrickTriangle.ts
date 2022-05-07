import { Buffer } from "buffer";
import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithPos from "./GameObjectWithPos";

export enum EnumBrickTriangleFacing {
    leftTop,
    rightTop,
    rightBottom,
    leftBottom
}

export default class BrickTriangle extends GameObjectWithPos implements IBounceGameObject {
    static FACING = EnumBrickTriangleFacing;
    static BYTES = 7;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readInt16LE(index),
            buffer.readInt16LE(index + 2),
            buffer.readInt16LE(index + 4),
            buffer.readUInt8(index + 6)
        );
    }
    static TEXTURES = ["brick1.000.png"];
    
    readonly type: BounceGameObjectType = "brick_tri";
    protected _facing: EnumBrickTriangleFacing;
    protected _size: number;
    get facing() {
        return this._facing;
    }
    set facing(value) {
        this._facing = value;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
    }

    constructor(x1: number, y1: number, size: number, facing: EnumBrickTriangleFacing) {
        super(x1, y1);
        this._facing = facing;
        this._size = size;
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof BrickTriangle).BYTES);
        buffer.writeInt16LE(this._pos[0], 0);
        buffer.writeInt16LE(this._pos[1], 2);
        buffer.writeInt16LE(this._size, 4);
        buffer.writeUInt8(this._facing, 6);
        return buffer;
    }
}
