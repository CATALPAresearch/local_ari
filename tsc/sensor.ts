export class Sensor{

    public orientation?:object;
    private deviceOrientationFunction?:(event:DeviceOrientationEvent) => void;
    
    constructor(){
       this.startDeviceOrientationTracking();
    }

    public startDeviceOrientationTracking():boolean{
        if(typeof window !== "object" || typeof window.DeviceOrientationEvent === "undefined") return false;
        let _this = this;
        this.deviceOrientationFunction = function(event:DeviceOrientationEvent){
            _this.orientation = {
                azimuth: event.gamma,
                pitch: event.beta,
                roll: event.alpha
            };
        }
        window.addEventListener("deviceorientation", this.deviceOrientationFunction);
        return true;
    }   

    public stopDeviceOrientationTracking():boolean{
        if(typeof this.deviceOrientationFunction !== "function") return false;
        window.removeEventListener("deviceorientation", this.deviceOrientationFunction);
        delete this.deviceOrientationFunction;
        return true;
    }

    public getGeolocation(options?:PositionOptions):Promise<Coordinates>{
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

export interface IDeviceOrientation{
    azimuth: number;    // angle around the z-axis
    pitch: number;      // angle around the x-axis
    roll: number;       // angle around the y-axis
}