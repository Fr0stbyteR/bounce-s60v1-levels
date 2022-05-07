import { Buffer } from "buffer";

export default class GameObjectWithPos {
    static BYTES = 4;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readInt16LE(index),
            buffer.readInt16LE(index + 2)
        );
    }

    protected _pos: [number, number];
    get pos() {
        return this._pos.slice() as [number, number];
    }
    set pos(value) {
        this._pos = value.slice() as [number, number];
    }

    get x1() {
        return this._pos[0];
    }
    set x1(x1) {
        this._pos = [x1, this._pos[1]];
    }
    get y1() {
        return this._pos[1];
    }
    set y1(y1) {
        this._pos = [this._pos[0], y1];
    }
    constructor(x1: number, y1: number) {
        this._pos = [~~x1, ~~y1];
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof GameObjectWithPos).BYTES);
        buffer.writeInt16LE(this._pos[0], 0);
        buffer.writeInt16LE(this._pos[1], 2);
        return buffer;
    }
}
