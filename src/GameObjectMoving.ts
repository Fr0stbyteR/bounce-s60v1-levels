import { Buffer } from "buffer";
import GameObjectWithPos2 from "./GameObjectWithPos2";

const mod = (x: number, y: number): number => (x % y + y) % y;

export default class GameObjectMoving extends GameObjectWithPos2 {
    static BYTES = 4 + 4 + 2 + 6;
    static fromBinary(buffer: Buffer, index: number) {
        return new this(
            buffer.readInt16LE(index + 0),
            buffer.readInt16LE(index + 2),
            buffer.readInt16LE(index + 4),
            buffer.readInt16LE(index + 6),
            buffer.readUInt16LE(index + 8),
            buffer.readInt16LE(index + 10),
            buffer.readInt16LE(index + 12),
            buffer.readInt16LE(index + 14)
        );
    }

    protected _speed: [number, number];
    protected _length: number;
    protected _phase: number;
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
    get phase() {
        return this._phase;
    }
    set phase(value) {
        this._phase = value;
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

    get initialX() {
        return this.x1 + this.xSpeed * mod(this.phase, this.length);
    }
    get initialY() {
        return this.y1 + this.ySpeed * mod(this.phase, this.length);
    }
    get initialPos() {
        return [this.initialX, this.initialY];
    }

    constructor(y1: number, x1: number, ySpeed: number, xSpeed: number, length: number, x2: number, y2: number, phase: number) {
        super(x1, y1, x2, y2);
        this._speed = [~~xSpeed, ~~ySpeed];
        this._length = ~~length;
        this._phase = ~~phase;
    }
    toBinary() {
        const buffer = Buffer.alloc((this.constructor as typeof GameObjectMoving).BYTES);
        buffer.writeInt16LE(this._pos[1], 0);
        buffer.writeInt16LE(this._pos[0], 2);
        buffer.writeInt16LE(this._speed[1], 4);
        buffer.writeInt16LE(this._speed[0], 6);
        buffer.writeUInt16LE(this._length, 8);
        buffer.writeInt16LE(this.pos2[0], 10);
        buffer.writeInt16LE(this.pos2[1], 12);
        buffer.writeInt16LE(this.phase, 14);
        return buffer;
    }
}
