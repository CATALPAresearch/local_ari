/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200901
 * @description A class that pulses the vibration hardware on the device, if such hardware exists.
 * 
 */

export default class Vibrate{

    private _data:IVibration;

    constructor(data:IVibration){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.duration !== "number" && typeof this._data.duration !== "object") return false;
        if(typeof this._data.duration === "object"){
            for(let i in this._data.duration){
                if(this._data.duration[i] < 0) return false;
            }
        } else {
            if(this._data.duration < 0) return false;
        }
        return true;
    }

    public async run():Promise<void>{
        if(typeof navigator !== "object" || typeof navigator.vibrate !== "function") throw new Error("No vibrate function found.");
        if(navigator.vibrate(this._data.duration) !== true) throw new Error("Could not vibrate."); 
        return;   
    }

}

export interface IVibration{
    duration: number|number[];   
}
