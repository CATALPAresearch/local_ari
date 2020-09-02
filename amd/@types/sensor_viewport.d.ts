import "jqueryui";
export declare class DOMVPTracker {
    private readonly _element;
    private _timer?;
    private _timeout?;
    private _callback?;
    private _last?;
    private _onEvent;
    private _deepEquality;
    constructor(jQuerySelector: string, index?: number);
    private _isHidden;
    startTracking(timeout: number, callback: (data: IEData) => void): void;
    stopTracking(): void;
    get(): Promise<IEData>;
}
export interface IEData {
    date?: number;
    element: object;
    dimensions: {
        height: number;
        width: number;
    };
    viewport: {
        width: number;
        height: number;
    };
    position: {
        top: number;
        left: number;
        right: number;
        bottom: number;
        centerX: number;
        centerY: number;
    };
    isHidden: boolean;
    fullyInsideVP: boolean;
    visibility: number;
}
//# sourceMappingURL=../tsc/@maps/sensor_viewport.d.ts.map