import { Buffer } from "buffer";
import { BounceGameObjectType, IBounceGameObject } from "./types";
import GameObjectWithPos from "./GameObjectWithPos";

export default class Brick extends GameObjectWithPos implements IBounceGameObject {
    static BYTES = 8;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readInt16LE(index),
            buffer.readInt16LE(index + 2),
            buffer.readInt16LE(index + 4),
            buffer.readInt16LE(index + 6)
        );
    }
    static TEXTURES = ["brick1.000.png"];
    
    readonly type: BounceGameObjectType = "brick";
    protected _pos2: [number, number];
    get pos2() {
        return this._pos2.slice() as [number, number];
    }
    set pos2(value) {
        this._pos2 = value.slice() as [number, number];
    }

    get x2() {
        return this._pos2[0];
    }
    set x2(x2) {
        this._pos2 = [x2, this._pos2[1]];
    }
    get y2() {
        return this._pos2[1];
    }
    set y2(y2) {
        this._pos2 = [this._pos2[0], y2];
    }

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(x1, y1);
        this._pos2 = [~~x2, ~~y2];
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof Brick).BYTES);
        buffer.writeInt16LE(this._pos[0], 0);
        buffer.writeInt16LE(this._pos[1], 2);
        buffer.writeInt16LE(this._pos2[0], 4);
        buffer.writeInt16LE(this._pos2[1], 6);
        return buffer;
    }
}
