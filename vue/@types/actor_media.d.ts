declare class CMediaStream {
    protected _mediaStream: MediaStream | null;
    protected _options?: MediaStreamConstraints;
    constructor(options?: MediaStreamConstraints);
    getStream(): MediaStream | null;
    stop(): Promise<void>;
}
export declare class Webcam extends CMediaStream {
    constructor(options?: MediaStreamConstraints);
    start(): Promise<void>;
}
export declare class ScreenSharing extends CMediaStream {
    constructor(options?: MediaStreamConstraints);
    start(): Promise<void>;
}
export declare class Audio extends CMediaStream {
    constructor(options?: MediaStreamConstraints);
    start(): Promise<void>;
}
export {};
//# sourceMappingURL=../tsc/@maps/actor_media.d.ts.map