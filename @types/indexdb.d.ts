export declare class IndexDB {
    private _database;
    private _version?;
    constructor(database: string, version?: number);
}
export interface IDatabaseStructure {
    [key: string]: Table;
}
interface Table {
    key: string;
    index: Index | Index[];
}
interface Index {
    name: string;
    options: IDBIndexParameters;
}
export {};
