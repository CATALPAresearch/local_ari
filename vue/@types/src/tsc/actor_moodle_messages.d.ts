export declare class SystemMessage {
    private _data;
    constructor(data: ISystemMessage);
    validate(): boolean;
    run(): Promise<void>;
}
export interface ISystemMessage {
    subject: string;
    message: string;
}
export declare class ChatMessage {
    private _data;
    constructor(data: IChatMessage);
    validate(): boolean;
    run(): Promise<void>;
}
export interface IChatMessage {
    message: string;
}
//# sourceMappingURL=../../../@maps/src/tsc/actor_moodle_messages.d.ts.map