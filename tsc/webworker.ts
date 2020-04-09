
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A web worker is a JavaScript running in the background, without affecting the performance of the page.
 * 
 */

export class Webworker{

    private _worker?:Worker;

    constructor(url:string, options?:WorkerOptions){
        if(typeof window.Worker === "function"){
            this._worker = new window.Worker(url, options);
        }
    }

    public addMessageEventListener(callback: (event:MessageEvent) => void):boolean{
        if(typeof this._worker === "undefined") return false;
        this._worker.addEventListener("message", callback);
        return true;
    }

    public removeMessageEventListener(callback: (event:MessageEvent) => void):boolean{
        if(typeof this._worker === "undefined") return false;
        this._worker.removeEventListener("message", callback);
        return true;
    }

    public addErrorEventListener(callback: (event:ErrorEvent) => void):boolean{
        if(typeof this._worker === "undefined") return false;
        this._worker.addEventListener("error", callback);
        return true;
    }

    public removeErrorEventListener(callback: (event:ErrorEvent) => void):boolean{
        if(typeof this._worker === "undefined") return false;
        this._worker.removeEventListener("error", callback);
        return true;
    }

    public terminate():boolean{
        if(typeof this._worker === "undefined") return false;
        try{
            this._worker.terminate();
            return true;
        } catch(error){
            return false;
        }        
    }
}