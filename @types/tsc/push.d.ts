export default class PushNotifications {
    private _worker?;
    private readonly _path;
    constructor(workerJSPath: string);
    update(): Promise<void>;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
    requestPermission(): Promise<void>;
    private workerJavaScript;
}
//# sourceMappingURL=push.d.ts.map