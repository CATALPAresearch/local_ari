
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A service worker is a JavaScript running in the background, without affecting the performance of the page.
 * 
 * Service Workers can intercept requests and replace them with items from their own cache, thus they behave like a proxy server. 
 * They offer offline capabilities to web applications. They can be used across multiple tabs and even continue to be alive when all tabs are closed.
 * 
 */

export default class SW {

    private _path:string;
    private _registration?:ServiceWorkerRegistration;
    private _worker?:ServiceWorker;   
    private _onError?:(event:ErrorEvent) => any;
    private _state:EServiceWorkerState = EServiceWorkerState.undefined;    

    constructor(path:string, onError?:(event:ErrorEvent) => any) {
        this._path = path;
        this._onError = onError;
    }

    public static async supported():Promise<void> {        
        if(!navigator || !navigator.serviceWorker || !navigator.serviceWorker.register) throw Error("Browser does not support service worker.");  
        if(location.protocol !== 'https:') throw Error("Service Worker can only run with https.");      
        return;
    }

    public async register():Promise<void> {
        if(typeof this._path !== "string" || this._path.length <= 0) throw Error("No valid path to javascript file.");        
        var http = new XMLHttpRequest();
        http.open('HEAD', this._path, false);
        http.send();
        if(http.status !== 404) throw Error("Javascript file for worker not found.");
        await SW.supported();
        if(typeof this._registration === "object") return;
        let worker = await navigator.serviceWorker.getRegistration(this._path);
        if(typeof worker !== "object") throw Error("Could not find the registration of the service worker.");
        this._registration = worker; 
        await this._getServiceWorker();                 
        return;
    }

    public async create():Promise<void> {
        await SW.supported();
        if(typeof this._registration === "object") return;
        let worker = await navigator.serviceWorker.getRegistration(this._path);
        if(typeof worker === "object"){
            this._registration = worker;
            return;
        }
        this._registration = await navigator.serviceWorker.register(this._path);        
        if(typeof this._registration !== "object") throw new Error("Could not connect to the service worker.");
        await this._getServiceWorker();
        return;
    }

    public async unregister():Promise<void> {
        await this.register();
        if(typeof this._worker === "object") delete this._worker;
        await this._registration.unregister();
        delete this._registration;        
        return;
    }

    public async update() {
        await this.register();
        await this._registration.update();         
        return;
    }    

    private _setState():void {
        if(this._registration.installing){
            this._state = EServiceWorkerState.installing;
            return;
        } else if(this._registration.waiting){
            this._state = EServiceWorkerState.waiting;
            return;
        } else if(this._registration.active){
            this._state = EServiceWorkerState.active;
            return;
        }
        this._state = EServiceWorkerState.undefined;
        return; 
    }

    public getState():EServiceWorkerState {
        return this._state;       
    }

    private async _getServiceWorker():Promise<void> {
        let _this = this;
        let onStateChange = function(){
            if(_this._registration.installing){
                _this._state = EServiceWorkerState.installing;
                return;
            } else if(_this._registration.waiting){
                _this._state = EServiceWorkerState.waiting;
                return;
            } else if(_this._registration.active){
                _this._state = EServiceWorkerState.active;
                return;
            }
            _this._state = EServiceWorkerState.undefined;
            return;
        }
        if(this._registration.installing){
            this._worker = this._registration.installing;
            if(this._onError) this._worker.addEventListener("error", this._onError);  
            this._worker.addEventListener("statechange", onStateChange);
            this._setState();          
            return;
        } else if(this._registration.waiting){
            this._worker = this._registration.waiting;
            if(this._onError) this._worker.addEventListener("error", this._onError);
            this._worker.addEventListener("statechange", onStateChange);
            this._setState();
            return;
        } else if(this._registration.active){
            this._worker = this._registration.active;
            if(this._onError) this._worker.addEventListener("error", this._onError);
            this._worker.addEventListener("statechange", onStateChange);
            this._setState();
            return;
        }
        throw Error("Could not find the service worker of the registration.");        
    }

    public async sendMessage(message:any, transfer?:Transferable[]):Promise<void> {
        if(typeof message !== "string" || message.length <= 0) throw Error("Please enter a valid message.");
        await this.register();
        this._worker.postMessage(message, transfer);
        return;
    }

    /**
     * Register a listener for the worker. Use "message" to receive a message send from the worker.
     * @param event The event name.
     * @param callback The callback for the event.
     * 
     */

    public async addListener(event:string, callback:any) {
        if(typeof callback !== "function") throw Error("Callback is not a function.")
        if(typeof event !== "string" || event.length <= 0) throw Error("Please enter a valid event name.");
        await this.register();
        this._worker.addEventListener(event, callback);
        return;
    }

    public async removeListener(event:string, callback:any) {
        if(typeof callback !== "function") throw Error("Callback is not a function.")
        if(typeof event !== "string" || event.length <= 0) throw Error("Please enter a valid event name.");
        await this.register();
        this._worker.removeEventListener(event, callback);
        return;
    } 
}

export enum EServiceWorkerState {
    installing,
    waiting,
    active,
    undefined
}