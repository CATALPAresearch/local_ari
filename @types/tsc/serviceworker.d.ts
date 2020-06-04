export default class SW {
    private _path;
    private _registration?;
    private _worker?;
    private _onError?;
    private _state;
    constructor(path: string, onError?: (event: ErrorEvent) => any);
    static supported(): Promise<void>;
    register(): Promise<void>;
    create(): Promise<void>;
    unregister(): Promise<void>;
    update(): Promise<void>;
    private _setState;
    getState(): EServiceWorkerState;
    private _getServiceWorker;
    sendMessage(message: any, transfer?: Transferable[]): Promise<void>;
    addListener(event: string, callback: any): Promise<void>;
    removeListener(event: string, callback: any): Promise<void>;
}
export declare enum EServiceWorkerState {
    installing = 0,
    waiting = 1,
    active = 2,
    undefined = 3
}
//# sourceMappingURL=serviceworker.d.ts.map