export declare class Notification {
    private _data;
    constructor(data: INotification);
    validate(): boolean;
    run(): Promise<void>;
}
export interface INotification {
    message: string;
    type: ENotificationType;
}
export declare enum ENotificationType {
    error = 0,
    warning = 1,
    info = 2,
    problem = 3,
    success = 4
}
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
