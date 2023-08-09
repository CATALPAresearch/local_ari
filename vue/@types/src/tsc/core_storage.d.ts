declare class Storage {
    protected static _checkStorage(): boolean;
}
export declare class SessionStorage extends Storage {
    static get(key: string): any;
    static set(key: string, value: any, overwrite?: boolean): boolean;
    static remove(key: string): boolean;
    static clear(): boolean;
}
export declare class LocalStorage extends Storage {
    static get(key: string): any;
    static set(key: string, value: any, overwrite?: boolean): boolean;
    static remove(key: string): boolean;
    static clear(): boolean;
}
export {};
//# sourceMappingURL=../../../@maps/src/tsc/core_storage.d.ts.map