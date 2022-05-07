import { Buffer } from "buffer";
import GameObjectWithPos from "./GameObjectWithPos";

export default class GameObjectMoving extends GameObjectWithPos {
    static BYTES = 4 + 4 + 2 + 6;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readInt16LE(index + 0),
            buffer.readInt16LE(index + 2),
            buffer.readInt16LE(index + 4),
            buffer.readInt16LE(index + 6),
            buffer.readUInt16LE(index + 8),
            buffer.slice(index + 10, index + 16)
        );
    }

    protected _speed: [number, number];
    protected _length: number;
    protected _data: Uint8Array;
    get speed() {
        return this._speed.slice() as [number, number];
    }
    set speed(value) {
        this._speed = value.slice() as [number, number];
    }
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = value;
    }

    get xSpeed() {
        return this._speed[0];
    }
    set xSpeed(xSpeed) {
        this._speed = [xSpeed, this._speed[1]];
    }
    get ySpeed() {
        return this._speed[1];
    }
    set ySpeed(ySpeed) {
        this._speed = [this._speed[0], ySpeed];
    }

    constructor(y1: number, x1: number, ySpeed: number, xSpeed: number, length: number, data = new Uint8Array(6)) {
        super(x1, y1);
        this._speed = [~~xSpeed, ~~ySpeed];
        this._length = length;
        this._data = data;
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof GameObjectMoving).BYTES);
        buffer.writeInt16LE(this._pos[1], 0);
        buffer.writeInt16LE(this._pos[0], 2);
        buffer.writeInt16LE(this._speed[1], 4);
        buffer.writeInt16LE(this._speed[0], 6);
        buffer.writeUInt16LE(this._length, 8);
        Buffer.from(this._data).copy(buffer, 10, 0, 6);
        return buffer;
    }
}
