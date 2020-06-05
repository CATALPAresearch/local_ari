
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A Skript to handle Service- and Webworker.
 * 
 */

/**
 * 
 * A class to manage multiple methods for both worker.
 * 
 */

class Worker {
    constructor(scriptURL:string){
        if(typeof scriptURL !== "string" || scriptURL.length <= 0) throw new Error("Invalid script path.");
        let http = new XMLHttpRequest();
        http.open('HEAD', scriptURL, false);
        http.send();
        if(http.status === 404) throw new Error("Script not found.");
    }
}

 /**
 * 
 * A service worker is a JavaScript running in the background, without affecting the performance of the page.
 * Service Workers can intercept requests and replace them with items from their own cache, thus they behave like a proxy server. 
 * They offer offline capabilities to web applications. They can be used across multiple tabs and even continue to be alive when all tabs are closed.
 * 
 */

export class ServiceWorker extends Worker{

    private _path:string;    
    private _registration?:ServiceWorkerRegistration;
    private _worker?:globalThis.ServiceWorker;

    constructor(scriptURL:string){        
        super(scriptURL);     
        if(!navigator || !navigator.serviceWorker || !navigator.serviceWorker.register) throw new Error("Browser does not support ServiceWorker."); 
        if(location.protocol !== 'https:') throw new Error("ServiceWorker can only run with https.");
        this._path = scriptURL;           
    }

    /** 
     * 
     * Creates of updates a ServiceWorker. 
     * @param scope - The scope of the service worker determines which files the service worker controls, in other words, from which path the service worker will intercept requests. The default scope is the location of the service worker file, and extends to all directories below. So if service-worker.js is located in the root directory, the service worker will control requests from all files at this domain.
     * @note event.target.state gives the current state
     * 
     */
    public async create(scope:string, error?: (error:ErrorEvent) => any, stateChange?: (event:any) => any):Promise<void>{        
        let registration = await navigator.serviceWorker.register(this._path, {scope: scope});
        if(typeof registration !== "object") throw new Error("Could not create ServiceWorker.");
        this._registration = registration;
        this._worker = this._getWorker(registration);     
        if(error) this._worker.onerror = error;
        if(stateChange) this._worker.onstatechange = stateChange;   
        return;
    }

    /** 
     * 
     * Gets a ServiceWorker registration if it exists. 
     * 
     * */
    public async register(error?: (error:ErrorEvent) => any, stateChange?: (event:Event) => any):Promise<void>{
        let registration = await navigator.serviceWorker.getRegistration(this._path);
        if(typeof registration !== "object") throw new Error("Could not register ServiceWorker.");
        this._registration = registration;
        this._worker = this._getWorker(registration); 
        if(error) this._worker.onerror = error;
        if(stateChange) this._worker.onstatechange = stateChange;
        return;
    }

    /** 
     * 
     * Updates a ServiceWorker if it exists. 
     * 
     * */
    public async update():Promise<void>{
        if(typeof this._registration !== "object") throw new Error("No registered ServiceWorker found.");
        await this._registration.update();
        return;
    }

     /**
     * 
     * Allows a ServiceWorker to send a message to a client (a Window, Worker, or SharedWorker). The message is received in the "message" event on navigator.serviceWorker.
     * @param message - The message to send to the client. This can be any structured-clonable type.
     * @param transfer - A sequence of objects that are transferred with the message. The ownership of these objects is given to the destination side and they are no longer usable on the sending side.
     * 
     */
    
    public async sendNotification(message:string, options?:NotificationOptions){
        if(typeof this._worker !== "object") throw new Error("No ServiceWorker found.");
        await Notification.requestPermission();
        console.log(Notification.permission);
        if(Notification.permission !== "granted") throw new Error("No notification permission.");
        this._registration.showNotification(message, options);
        return;
         
    }

    private _getWorker(registration:ServiceWorkerRegistration):globalThis.ServiceWorker|undefined{
        if(this._registration.installing){
            return this._registration.installing;           
        } else if(this._registration.waiting){
            return this._registration.waiting;           
        } else if(this._registration.active){
            return this._registration.active;            
        }
        throw new Error("No ServiceWorker found.");
    }  

   
}



/**
 * 
 * A web worker is a JavaScript running in the background, without affecting the performance of the page. 
 * Web workers, on the other hand, have a different purpose. They offer multi-threading to the single-threaded JavaScript language and are used for 
 * performing computation heavy tasks that should not interfere with the responsiveness of the UI. They are limited to only one tab.
 * 
 */

export class WebWorker extends Worker{
    constructor(scriptURL:string){
        super(scriptURL);
    }
}