//@ts-ignore
import notification from 'core/notification';
import Communication from './communication';

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class Notification{

    private _data:INotification;

    constructor(data:INotification){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.message !== "string" || this._data.message.length <= 0) return false;
        if(typeof this._data.type !== "number" || !(this._data.type in ENotificationType)) return false;
        return true;
    }

    public async run():Promise<void>{
        let type = "error";
        switch(this._data.type){
            case ENotificationType.error:   type = "error";
                                            break;
            case ENotificationType.info:    type = "info";
                                            break;
            case ENotificationType.problem: type = "problem";
                                            break;
            case ENotificationType.success: type = "success";
                                            break;
            case ENotificationType.warning: type = "warning";
                                            break;
        }
        notification.addNotification({
            message: this._data.message,
            type: type
        });
        return;
    }

}

export interface INotification {
    message: string;
    type: ENotificationType;
}

export enum ENotificationType {
    error,
    warning,
    info,
    problem,
    success
}

/**
 * 
 * Send a system message to the user.
 * @param data ISystemMessage
 * @note You can use html at the message string.
 * 
 */

export class SystemMessage {
    
    private _data:ISystemMessage;

    constructor(data:ISystemMessage){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.subject !== "string" || this._data.subject.length <= 0) return false;
        if(typeof this._data.message !== "string" || this._data.message.length <= 0) return false;
        return true;
    }

    public async run():Promise<void>{
        let result = await Communication.webservice('sendSystemMessage', {subject: this._data.subject, message: this._data.message});
        console.log(result);
        return;
    }
}

export interface ISystemMessage{
    subject: string;
    message: string;
}

/**
 * 
 * Send a chat message to the user.
 * @param data IChatMessage
 * 
 */

export class ChatMessage{
    private _data:IChatMessage;

    constructor(data:IChatMessage){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.message !== "string" || this._data.message.length <= 0) return false;
        return true;
    }

    public async run():Promise<void>{
        let result = await Communication.webservice('sendChatMessage', {message: this._data.message});
        console.log(result);
        return;
    }
}

export interface IChatMessage{   
    message: string;
}
