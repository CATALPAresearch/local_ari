export declare class IndexedDB {
    private _dbName;
    private _version;
    private _db?;
    constructor(dbName: string, version?: number);
    open(modifyTables?: IModifyTables): Promise<number>;
    close(): void;
    getVersion(): number;
    write(table: string, data: IAddToTable[]): Promise<void>;
    read(table: string, key: string | number): Promise<any>;
    delete(table: string, key: string | number): Promise<void>;
}
export interface IModifyTables {
    create?: ITables[];
    delete?: ITables[];
}
export interface ITables {
    name: string;
    options?: {
        keyPath?: string;
        autoIncrement?: boolean;
    };
    index?: IIndex[];
}
export interface IIndex {
    name: string;
    keyPath: string;
    params?: IDBIndexParameters;
}
export interface IAddToTable {
    data: any;
    key?: string;
}
//# sourceMappingURL=../tsc/@maps/core_indexeddb.d.ts.map