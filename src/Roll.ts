import { Buffer } from "buffer";
import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithVariant from "./GameObjectWithVariant";

export enum EnumRollVariant {
    right,
    left
}

export default class Roll extends GameObjectWithVariant<EnumRollVariant> implements IBounceGameObject {
    static VARIANT = EnumRollVariant;
    static BYTES = 7;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readUInt8(index),
            buffer.readInt16LE(index + 1),
            buffer.readInt16LE(index + 3),
            buffer.readInt16LE(index + 5)
        );
    }
    static TEXTURES = [
        "obstacle.013.png",
        "obstacle.014.png",
        "obstacle.015.png"
    ];

    readonly type: BounceGameObjectType = "roll";
    protected _length: number;
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = value;
    }

    constructor(variant: EnumRollVariant, x1: number, y1: number, length: number) {
        super(variant, x1, y1);
        this._length = ~~length;
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof GameObjectWithVariant).BYTES);
        buffer.writeUInt8(this._variant, 0);
        buffer.writeInt16LE(this._pos[0], 1);
        buffer.writeInt16LE(this._pos[1], 3);
        buffer.writeInt16LE(this._length, 5);
        return buffer;
    }
}
