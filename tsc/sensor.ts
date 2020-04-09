

export default class Sensor{   

    public readonly browser:IBrowser = {};
    public readonly screen:IScreen = {};
    public readonly window:IWindow = {};
    public geolocation?:Coordinates;
    private static deviceOrientation?:IDeviceOrientation = {};
    private static deviceOrientationFunction?:(event:any) => void;
    public deviceOrientation?:IDeviceOrientation = Sensor.deviceOrientation;
    public readonly os?:string = navigator && navigator.userAgent ? navigator.userAgent : undefined;
    public readonly tabID?:string;

    constructor(){
        if(typeof navigator === "object"){
            if(navigator.appName) this.browser.name = navigator.appName;
            if(navigator.appCodeName) this.browser.codeName = navigator.appCodeName;
            if(navigator.appVersion) this.browser.version = navigator.appVersion;
            if(typeof navigator.cookieEnabled === "boolean"){
                if(navigator.cookieEnabled === true){
                    this.browser.cookieEnabled = true;
                } else {
                    this.browser.cookieEnabled = false;
                }
            }
            if(typeof navigator.javaEnabled === "function"){
                this.browser.javaEnabled = navigator.javaEnabled();
            }
            if(navigator.doNotTrack){
                if(navigator.doNotTrack === "1"){
                    this.browser.doNotTrack = true;
                } else {
                    this.browser.doNotTrack = false;
                }
            }
            if(navigator.language) this.browser.language = navigator.language;
            if(navigator.languages) this.browser.languages = JSON.parse(JSON.stringify(navigator.languages));
            if(typeof navigator.onLine === "boolean") this.browser.online = navigator.onLine;
            if(navigator.platform) this.browser.platform = navigator.platform;
            if(navigator.product) this.browser.engine = navigator.product;
        }
        if(typeof screen === "object"){
            if(screen.width) this.screen.width = screen.width;
            if(screen.height) this.screen.height = screen.height;
            if(screen.availHeight) this.screen.availHeight = screen.availHeight;
            if(screen.availWidth) this.screen.availWidth = screen.availWidth;
            if(screen.pixelDepth) this.screen.pixelDepth = screen.pixelDepth;
            if(screen.colorDepth) this.screen.colorDepth = screen.colorDepth;
            this.screen.orientation = this.getOrientation();            
        }
        if(typeof window === "object"){
            if(window.innerHeight) this.window.innerHeight = window.innerHeight;
            if(window.innerWidth) this.window.innerWidth = window.innerWidth;
            if(window.outerHeight) this.window.outerHeight = window.outerHeight;
            if(window.outerWidth) this.window.outerWidth = window.outerWidth;
        }  
        if(typeof sessionStorage === "object"){
            if(typeof sessionStorage.tabID === "undefined"){
                let c = Date.now()/1000;
                let d = c.toString(16).split(".").join("");
                while(d.length < 14){
                    d += "0";
                }
                let e = ".";               
                let f = Math.round(Math.random()*100000000);
                e += f;
                sessionStorage.tabID = d + e;                
            }
            this.tabID = sessionStorage.tabID;
        }
    }

    public getOrientation():EOrientation {
        if(window.matchMedia("(orientation: portrait)").matches) return EOrientation.portrait;
        if(window.matchMedia("(orientation: landscape)").matches) return EOrientation.landscape;        
        if(screen.orientation){
            let orientation = screen.orientation.type;
            if(orientation.indexOf("portrait") !== -1) return EOrientation.portrait;
            if(orientation.indexOf("landscape") !== -1) return EOrientation.landscape;   
        }        
        if(typeof window !== "object" || typeof window.innerHeight !== "number" || typeof window.innerWidth) return EOrientation.undefined;
        if(window.innerHeight > window.innerWidth || (typeof window.orientation === "number" && (window.orientation === 0 || window.orientation === -180))) return EOrientation.portrait;
        if(window.innerWidth > window.innerHeight || (typeof window.orientation === "number" && (window.orientation === 90 || window.orientation === -90))) return EOrientation.landscape;
        return EOrientation.undefined;
    }

    public getGeolocation():Promise<void> {
        if(navigator && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === "function"){
            return Promise.reject(new Error("Browser does not support Geolocation."));
        }
        let _this = this;
        return new Promise(
            (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (coords:Position) => {
                        if(typeof coords.coords === "object"){
                            _this.geolocation = coords.coords;
                            return resolve();
                        }
                        return reject(new Error("Could not get Coordinates."));
                    }
                );
            }
        );        
    }

    public startDeviceOrientationTracking():Promise<void>{
        if(typeof window !== "object" || typeof window.DeviceOrientationEvent === "undefined") return Promise.reject("Browser does not support device orientation.");
        Sensor.deviceOrientationFunction = (event:DeviceOrientationEvent) => {
            Sensor.deviceOrientation.azimuth = event.alpha;
            Sensor.deviceOrientation.pitch = event.beta;
            Sensor.deviceOrientation.roll = event.gamma;
        };
        window.addEventListener("deviceorientation", Sensor.deviceOrientationFunction);
        return;
    }

    public stopDeviceOrientationTracking():boolean{
        if(typeof Sensor.deviceOrientationFunction === "function" && typeof window === "object") window.removeEventListener("deviceorientation", Sensor.deviceOrientationFunction);
        return true;
    }
}

interface IDeviceOrientation {
    azimuth?: number;    // angle around the z-axis
    pitch?: number;      // angle around the x-axis
    roll?: number;       // angle around the y-axis
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

export enum EOrientation {
    landscape,
    portrait,
    undefined
}