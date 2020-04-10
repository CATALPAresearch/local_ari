import { func_to_url } from "./webworker";

export default class PushNotifications{  

    private _worker?:ServiceWorkerRegistration;
    private readonly _path:string;

    constructor(workerJSPath:string){
        this._path = workerJSPath;
    }

    public async update():Promise<void>{
        if(typeof navigator !== "object" || typeof navigator.serviceWorker !== "object") throw Error("Browser does not support service worker.");
        if(typeof this._worker !== "object"){
            let worker = await navigator.serviceWorker.getRegistration(this._path);
            if(typeof worker === "object"){
                this._worker = worker;
                await this._worker.update(); 
            }
        }
    }

    /**
     * Subscribe the user to get push notifications.
     * @important Must always be called from inside a short running user-generated event handler, such as click or keydown
     */

    public async subscribe():Promise<void>{
        if(typeof navigator !== "object" || typeof navigator.serviceWorker !== "object") throw Error("Browser does not support service worker.");
        if(typeof window !== "object" || typeof window.PushManager !== "function") throw Error("Browser does not support push.");
        await this.requestPermission();        
        await this.update();
        console.log(this._worker);
        if(typeof this._worker === "object") return;
        this._worker = await navigator.serviceWorker.register(this._path);
        if(typeof this._worker === "object") return;
        throw Error("Could not register worker");        
    } 

    public async unsubscribe():Promise<void>{
        await this.update();
        if(typeof this._worker === "object"){
            let del = await this._worker.unregister();
            if(del) return;        
        }       
        throw Error("Could not unregister worker.");
    }

    /**
     * Request permission to send notifications.
     * @important Must always be called from inside a short running user-generated event handler, such as click or keydown
     */

    public async requestPermission():Promise<void>{
        if(typeof Notification === "object" || typeof Notification.requestPermission !== "function") throw Error("Browser does not support notifications.");
        if(Notification.permission === "granted") return;
        let permission = await Notification.requestPermission();
        if(permission === "granted") return;
        throw Error("No permission");
    }

    private workerJavaScript(){
        console.log("working hard");
    }

}