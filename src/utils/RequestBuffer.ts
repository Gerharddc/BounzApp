/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

export type BufferCallback<T> = (buffer: T[]) => void;

export default class RequestBuffer<T> {
    private startBufferTime: number | undefined;
    private lastBufferTime: number | undefined;
    private buffer: T[] = [];

    private bufferInterval: number;
    private maxBufferWait: number;
    private callback: BufferCallback<T>;

    public constructor(callback: BufferCallback<T>, bufferInterval = 200, maxBufferWait = 1500) {
        this.bufferInterval = bufferInterval;
        this.maxBufferWait = maxBufferWait;
        this.callback = callback;
    }

    public bufferRequest(data: T) {
        const now = (new Date()).valueOf();
        this.buffer.push(data);

        if (!this.startBufferTime) {
            this.startBufferTime = now;
            setTimeout(this.bufferTimeout.bind(this), this.bufferInterval);
        }

        this.lastBufferTime = now;
    }

    private flushBuffer() {
        this.callback(this.buffer.slice());
        this.buffer = [];
        this.startBufferTime = undefined;
        this.lastBufferTime = undefined;
    }

    private bufferTimeout() {
        const now = (new Date()).valueOf();

        if (now - this.startBufferTime! > this.maxBufferWait) {
            this.flushBuffer();
        } else {
            const elapsed = now - this.lastBufferTime!;

            if (elapsed < this.bufferInterval) {
                setTimeout(this.bufferTimeout.bind(this), this.bufferInterval - elapsed);
            } else {
                this.flushBuffer();
            }
        }
    }
}
