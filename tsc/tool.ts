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
        switch(this._data.type){
            case EToolType.Notification:    this._promise = this.notification(data);
                                            break;
            case EToolType.SystemMessage:   this._promise = this.systemMessage(data);
                                            break;
            case EToolType.ChatMessage:     this._promise = this.chatMessage(data);
                                            break;
            default: this._promise = Promise.reject("Unknown Tool");
        }
    }

    // NOTIFICATION //
    public async notification(data:IToolData):Promise<void>{
        if(data)
        return;
    }

    public async systemMessage(data:IToolData):Promise<void>{

    }

    public async chatMessage(data:IToolData):Promise<void>{

    }

    public createEntry(data:IToolData):void{
        if(typeof this._next === "object") return this._next.createEntry(data);
        let elem = new Tool(data, this);
        this._next = elem;
        return;
    }

    public getID():number{
        return this.id;  
    }

    public getData():IToolData{
        return this._data;
    }

    public getPromise():Promise<void>{
        return this._promise;
    }

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

    public unsetNext():void{
        delete this._next;
        return;
    }

    public unsetPrev():void{
        delete this._prev;
        return;
    }

    public setNext(obj:Tool):void{
        this._next = obj;
        return;
    }

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
    type: EToolType;
}

export interface INotificationTool extends IToolData{
    message: string;
    type: INotificationType;
    time?: Date;
}

export enum EToolType {
    Notification,
    SystemMessage,
    ChatMessage
}

export enum INotificationType {
    error,
    warning,
    info,
    problem,
    success
}