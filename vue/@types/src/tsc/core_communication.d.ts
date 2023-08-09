export default class Communication {
    static webservice(method: string, param?: object): Promise<any>;
}
export declare class BrowserBroadcast {
    private readonly _broadcastChannel;
    constructor(name: string);
    receive(callback: (ev: MessageEvent) => void): void;
    messageError(callback: (ev: MessageEvent) => void): void;
    send(message: object): void;
    close(): void;
}
//# sourceMappingURL=../../../@maps/src/tsc/core_communication.d.ts.map