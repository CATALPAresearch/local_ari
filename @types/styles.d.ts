export declare class CSS {
    private _data;
    constructor(data: ICSS);
    validate(): boolean;
    run(): Promise<void>;
}
export interface ICSS {
    selector: string;
    properties: object;
}
