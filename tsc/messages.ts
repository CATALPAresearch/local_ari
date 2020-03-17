//@ts-ignore
import notification from 'core/notification';
import Communication from './communication';

/**
 * 
 * Send a notification toe the user.
 * @param data INotification
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

export class SystemMessage {
    
    private _data:ISystemMessage;

    constructor(data:ISystemMessage){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.message !== "string" || this._data.message.length <= 0) return false;
        return true;
    }

    public async run():Promise<void>{
        let result = Communication.webservice('method', {});
        return;
    }
}

export interface ISystemMessage{
    message: string;
}

