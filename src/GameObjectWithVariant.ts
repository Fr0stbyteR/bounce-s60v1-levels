import { Buffer } from "buffer";
import GameObjectWithPos from "./GameObjectWithPos";

export default class GameObjectWithVariant<EnumVariant extends number = number> extends GameObjectWithPos {
    static VARIANT: any = {};
    static BYTES = 5;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readUInt8(index),
            buffer.readInt16LE(index + 1),
            buffer.readInt16LE(index + 3)
        );
    }
    
    protected _variant: EnumVariant;
    get variant() {
        return this._variant;
    }
    set variant(value) {
        this._variant = value;
    }

    constructor(variant: EnumVariant, x1: number, y1: number) {
        super(x1, y1);
        this._variant = variant;
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof GameObjectWithVariant).BYTES);
        buffer.writeUInt8(this._variant, 0);
        buffer.writeInt16LE(this._pos[0], 1);
        buffer.writeInt16LE(this._pos[1], 3);
        return buffer;
    }
}
