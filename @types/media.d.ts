export default class MS {
    private _mediaStream;
    private _constraints;
    private _objectURL;
    constructor(constraints: MediaStreamConstraints);
    start(): Promise<void>;
    getStream(): MediaStream | null;
    getURL(): string | null;
    stop(): Promise<void>;
    takeScreenshot(): void;
}
