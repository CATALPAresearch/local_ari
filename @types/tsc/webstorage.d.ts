export default class Webstorage {
    private static tryToParse;
    static setLocalStorage(name: string, data: any): boolean;
    static getLocalStorage(name: string): any;
    static deleteLocalStorage(name: string): boolean;
    static clearLocalStorage(): boolean;
    static localStorageLength(): number | null;
    static setSessionStorage(name: string, data: any): boolean;
    static getSessionStorage(name: string): any;
    static deleteSessionStorage(name: string): boolean;
    static clearSessionStorage(): boolean;
    static sessionStorageLength(): number | null;
}
//# sourceMappingURL=webstorage.d.ts.map