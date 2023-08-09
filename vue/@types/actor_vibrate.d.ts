export default class Vibrate {
    private _data;
    constructor(data: IVibration);
    validate(): boolean;
    run(): Promise<void>;
}
export interface IVibration {
    duration: number | number[];
}
//# sourceMappingURL=../tsc/@maps/actor_vibrate.d.ts.map