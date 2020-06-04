export declare class CreateModal {
    private _data;
    constructor(data: ICreateModal);
    validate(): boolean;
    run(): Promise<void>;
}
export interface ICreateModal {
    selector: string;
    id: string;
    header?: string;
    body?: string;
    footer?: string;
    hidden: boolean;
    position: EDOMPosition;
    removeOld: boolean;
}
export declare enum EDOMPosition {
    append = 0,
    prepend = 1
}
export declare class RemoveDom {
    private _data;
    constructor(data: IRemoveDom);
    validate(): boolean;
    run(): Promise<void>;
}
export interface IRemoveDom {
    selector: string;
}
export declare class AddDom {
    private _data;
    constructor(data: IAddDOM);
    validate(): boolean;
    run(): Promise<void>;
}
export interface IAddDOM {
}
//# sourceMappingURL=dom.d.ts.map