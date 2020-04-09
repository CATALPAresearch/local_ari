import { func_to_url } from "./webworker";

export default class PushNotifications{  

    private _worker?:ServiceWorkerRegistration;
    private _path:string;

    constructor(path:string){
        this._path = path;
    }

    /**
     * Subscribe the user to get push notifications.
     * @important Must always be called from inside a short running user-generated event handler, such as click or keydown
     */

    public async subscribe():Promise<void>{
        if(typeof navigator !== "object" || typeof navigator.serviceWorker !== "object") throw Error("Browser does not support service worker.");
        if(typeof window !== "object" || typeof window.PushManager !== "function") throw Error("Browser does not support push.");
        await this.requestPermission();         
        console.log(this._path+"/local/ari/lib/worker.js");
        //this._worker = await navigator.serviceWorker.register(this._path+"/local/ari/lib/worker.js");
        return;
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