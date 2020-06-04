export default class Webworker {
    private _worker?;
    constructor(url: string, options?: WorkerOptions);
    sendMessage(message: any): boolean;
    addMessageEventListener(callback: (event: MessageEvent) => void): boolean;
    removeMessageEventListener(callback: (event: MessageEvent) => void): boolean;
    addErrorEventListener(callback: (event: ErrorEvent) => void): boolean;
    removeErrorEventListener(callback: (event: ErrorEvent) => void): boolean;
    terminate(): boolean;
}
export declare function func_to_url(func: any): string;
//# sourceMappingURL=webworker.d.ts.map