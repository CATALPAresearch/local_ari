export class Sensor{

    public static orientation?:object;

    private static deviceOrientationFunction?:(event:DeviceOrientationEvent) => void;  

    public static browser = <IBrowser>{
        cookiesEnabled: navigator && navigator.cookieEnabled ? navigator.cookieEnabled : undefined,
        name: navigator && navigator.appName ? navigator.appName : undefined,
        codeName: navigator && navigator.appCodeName ? navigator.appCodeName : undefined,
        engine: navigator && navigator.product ? navigator.product : undefined,
        version: navigator && navigator.appVersion ? navigator.appVersion : undefined,
        language: navigator && navigator.language ? navigator.language : undefined,
        online: navigator && navigator.onLine ? navigator.onLine : undefined,
        javaEnabled: navigator && navigator.javaEnabled ? navigator.javaEnabled() : undefined,
        platform: navigator && navigator.platform ? navigator.platform : undefined    
    };

    public static location:Location = window.location;

    public static screen:Screen = screen;

    public static os?:string = navigator && navigator.userAgent ? navigator.userAgent : undefined;

    public static window:IWindow = {
        innerHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight : undefined,
        innerWidth : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : undefined,
        outerHeight: window && window.outerHeight ? window.outerHeight : undefined,
        outerWidth : window && window.outerWidth ? window.outerWidth : undefined
    }

    public static updateWindowData():void{
        Sensor.window = <IWindow>{
            innerHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight : undefined,
            innerWidth : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : undefined,
            outerHeight: window && window.outerHeight ? window.outerHeight : undefined,
            outerWidth : window && window.outerWidth ? window.outerWidth : undefined
        }      
    }

    public static startDeviceOrientationTracking():boolean{
        if(typeof window !== "object" || typeof window.DeviceOrientationEvent === "undefined") return false;        
        Sensor.deviceOrientationFunction = function(event:DeviceOrientationEvent){
            Sensor.orientation = {
                azimuth: event.gamma,
                pitch: event.beta,
                roll: event.alpha
            };
        }
        window.addEventListener("deviceorientation", this.deviceOrientationFunction);
        return true;
    }   

    public static stopDeviceOrientationTracking():boolean{
        if(typeof Sensor.deviceOrientationFunction !== "function") return false;
        window.removeEventListener("deviceorientation", Sensor.deviceOrientationFunction);
        delete Sensor.deviceOrientationFunction;
        return true;
    }

    public static getGeolocation(options?:PositionOptions):Promise<Coordinates>{
        if(typeof navigator !== "object" || typeof navigator.geolocation !== "object" || typeof navigator.geolocation.getCurrentPosition !== "function") Promise.reject(new Error("The browser does not support GeoLocation."));
        return new Promise(
            (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        if(typeof position.coords !== "object") return reject(new Error("Could not get the coords."));
                        return resolve(position.coords);
                    }, 
                    (error) => {
                        return reject(error)
                    }, 
                    options
                );               
            }
        );
    } 

}

window.addEventListener("resize", Sensor.updateWindowData);

export interface IDeviceOrientation{
    azimuth: number;    // angle around the z-axis
    pitch: number;      // angle around the x-axis
    roll: number;       // angle around the y-axis
}

export interface IBrowser{
    cookiesEnabled?: boolean;
    name?: string;
    codeName?: string;
    engine?: string;
    version?: string;
    language?: string;
    online?: boolean;
    javaEnabled?: boolean;
    platform?: string;
}

export interface IWindow{
    innerWidth?: number;
    innerHeight?: number;
    outerWidth?: number;
    outerHeight?: number;   
}