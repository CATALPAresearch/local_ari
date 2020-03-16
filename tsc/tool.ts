import { Config } from "./config";
//@ts-ignore
import notification from 'core/notification';

export class Tool {

    private static _counter = 0;
    private static _config = Config;
    public readonly id:number;
    private _prev?: Tool;
    private _next?: Tool;   
    private _data:IToolData; 
    private _promise:Promise<any>;

    constructor(data:IToolData, prev?:Tool){
        this.id = ++Tool._counter;
        this._data = data;
        if(typeof prev === "object") this._prev = prev;
        switch(this._data.tool){
            case EToolType.Notification:    this._promise = this.notification(data);
                                            break;
            case EToolType.SystemMessage:   this._promise = this.systemMessage(data);
                                            break;
            case EToolType.ChatMessage:     this._promise = this.chatMessage(data);
                                            break;
            default: this._promise = Promise.reject(Tool._config.tools.denies.unknownTool);
        }
    }

    // ============================================== COLLECTION OF TOOLS ==============================================

    /**
     * 
     * Send a Notification to the user. (https://docs.moodle.org/dev/Notifications)
     * @param data IToolNotificationData
     * @returns Promise<void>
     * 
     */

    public async notification(data:IToolNotificationData):Promise<void>{
        if(typeof data !== "object" || 
            typeof data.message !== "string" || 
            data.message.length <= 0 || 
            !(data.type in ENotificationType)) throw new Error(Tool._config.tools.denies.wrongData);
            let type = "info";
            switch(data.type){ 
                case ENotificationType.error:   type = "error"; break;
                case ENotificationType.info:    type = "info"; break;
                case ENotificationType.problem: type = "problem"; break;
                case ENotificationType.success: type = "success"; break;
                case ENotificationType.warning: type = "warning"; break;
            }
            let notificationData = {
                message: data.message,
                type: type
            }
        notification.addNotification(notificationData);
        return;
    }

    /**
     * 
     * Send a system message to the user (see the bell @ navbar).
     * @param data
     *  
     */

    public async systemMessage(data:IToolData):Promise<void>{

    }

    /**
     * 
     * Send a chatmessage over the chatbot.
     * @param data 
     * 
     */

    public async chatMessage(data:IToolData):Promise<void>{

    }

    /**
     * 
     * @param data 
     */

    public async css(data:IToolData):Promise<void>{

    }

    // ============================================== MANAGMENT OF USED TOOLS ==============================================

    /**
     * Create a new tool usage.
     * @param data IToolData
     * @returns Tool
     * 
     */

    public create(data:IToolData):Tool{
        if(typeof this._next === "object") return this._next.create(data);
        let elem = new Tool(data, this);
        this._next = elem;
        return elem;
    }

    /**
     * 
     * Get the ID of the current tool
     * @returns number
     * 
     */

    public getID():number{
        return this.id;  
    }

    /**
     * 
     * Get the config data of the tool.
     * @return IToolData
     * 
     */

    public getData():IToolData{
        return this._data;
    }

    /**
     * 
     * Get the result of the tool usage.
     *  @returns Promise<void>
     * 
     */

    public getPromise():Promise<void>{
        return this._promise;
    }

    /**
     * 
     * Get a tool by its ID.
     * @param id number
     * @returns Tool|null
     * 
     */

    public getElementByID(id:number):Tool|null{
        let first = this.getFirst();
        if(first.getID() === id) return this;
        let next = this.getNext();
        while(next !== null){
            if(next.getID() === id) return this;
            next.getNext();
        }
        return null;
    }

    /**
     * 
     * Delete the current tool usage.
     * @returns void
     * 
     */

    public deleteEntry():void{
        if(typeof this._next === "object" && typeof this._prev === "object"){
            this._next.setPrev(this._prev);
            this._prev.setNext(this._next);
        } else if(typeof this._next === "object"){
            this._next.unsetPrev();
        } else if(typeof this._prev === "object"){
            this._prev.unsetNext();
        }
        return;
    }

    /**
     * 
     * Unset the next tool object pointer.
     * @returns void
     * 
     */

    public unsetNext():void{
        delete this._next;
        return;
    }

    /**
     * 
     * Unset the previous tool object pointer.
     * @returns void
     * 
     */

    public unsetPrev():void{
        delete this._prev;
        return;
    }

    /**
     * 
     * Set the next tool object. 
     * @param obj Tool
     * @returns void
     * 
     */

    public setNext(obj:Tool):void{
        this._next = obj;
        return;
    }

    /**
     * 
     * Set the previous tool object.
     * @param obj Tool
     * @returns void 
     * 
     */

    public setPrev(obj:Tool):void{
        this._prev = obj;
        return;
    }

    public getNext():Tool|null{
        return typeof this._next === "object"? this._next : null;
    }

    public getPrev():Tool|null{
        return typeof this._prev === "object"? this._prev : null;
    }

    public getLast():Tool{
        if(typeof this._next === "object") return this._next.getLast();
        return this;
    }

    public getFirst():Tool{
        if(typeof this._prev === "object") return this._prev.getFirst();
        return this;
    }
}

export interface IToolData{
    tool: EToolType;
}

export interface IToolNotificationData extends IToolData{
    message: string;
    type: ENotificationType;   
}

export enum EToolType {
    Notification,
    SystemMessage,
    ChatMessage
}

export enum ENotificationType {
    error,
    warning,
    info,
    problem,
    success
}