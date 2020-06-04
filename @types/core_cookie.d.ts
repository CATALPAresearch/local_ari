export default class Cookie {
    static set(name: string, value: any, expires?: Date, path?: string): void;
    static getAll(): object;
    static get(name: string): any;
    static remove(name: string, path?: string): void;
}
//# sourceMappingURL=core_cookie.d.ts.map