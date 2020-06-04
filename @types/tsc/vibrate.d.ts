export default class Vibrate {
    private _data;
    constructor(data: IVibration);
    validate(): boolean;
    run(): Promise<void>;
}
export interface IVibration {
    duration: number | number[];
}
//# sourceMappingURL=vibrate.d.ts.map