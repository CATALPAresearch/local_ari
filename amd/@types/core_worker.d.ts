declare class Worker {
    constructor(scriptURL: string);
}
export declare class ServiceWorker extends Worker {
    private _path;
    private _registration?;
    private _worker?;
    constructor(scriptURL: string);
    create(scope: string, error?: (error: ErrorEvent) => any, stateChange?: (event: any) => any): Promise<void>;
    register(error?: (error: ErrorEvent) => any, stateChange?: (event: Event) => any): Promise<void>;
    update(): Promise<void>;
    getWorker(): globalThis.ServiceWorker | undefined;
    getRegistration(): globalThis.ServiceWorkerRegistration | undefined;
    private _getWorker;
}
export declare class WebWorker extends Worker {
    constructor(scriptURL: string);
}
export {};
//# sourceMappingURL=../tsc/@maps/core_worker.d.ts.map