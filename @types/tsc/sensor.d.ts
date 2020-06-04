export default class Sensor {
    readonly browser: IBrowser;
    readonly screen: IScreen;
    readonly window: IWindow;
    geolocation?: Coordinates;
    private static deviceOrientation?;
    private static deviceOrientationFunction?;
    deviceOrientation?: IDeviceOrientation;
    readonly os?: string;
    readonly tabID?: string;
    constructor();
    getOrientation(): EOrientation;
    getGeolocation(): Promise<void>;
    startDeviceOrientationTracking(): Promise<void>;
    stopDeviceOrientationTracking(): boolean;
}
interface IDeviceOrientation {
    azimuth?: number;
    pitch?: number;
    roll?: number;
}
interface IBrowser {
    name?: string;
    codeName?: string;
    version?: string;
    cookieEnabled?: boolean;
    javaEnabled?: boolean;
    doNotTrack?: boolean;
    language?: string;
    languages?: string[];
    online?: boolean;
    platform?: string;
    engine?: string;
}
interface IScreen {
    height?: number;
    width?: number;
    availHeight?: number;
    availWidth?: number;
    colorDepth?: number;
    orientation?: EOrientation;
    pixelDepth?: number;
}
interface IWindow {
    innerWidth?: number;
    innerHeight?: number;
    outerWidth?: number;
    outerHeight?: number;
}
export declare enum EOrientation {
    landscape = 0,
    portrait = 1,
    undefined = 2
}
export {};
//# sourceMappingURL=sensor.d.ts.map