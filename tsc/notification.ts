//@ts-ignore
import notification from 'core/notification';

/**
 * 
 * @author Marc Burchart
 * @version 1.0.0
 * @description This class handles moodle notifications.
 * @param message The message you want to send.
 * @param type The type of the notification (see INotificationType).
 * 
 */

export class Notification {

    private _data:INotificationData;
    
    constructor(message:string, type:INotificationType){
        let nType = "";
        switch(type){
            case INotificationType.error:   nType = "error";
                                            break;
            case INotificationType.warning: nType = "warning";
                                            break;
            case INotificationType.info:    nType = "info";
                                            break;
            case INotificationType.problem: nType = "problem";
                                            break;
            case INotificationType.success: nType = "success";
                                            break;  
            default: nType = "error";      
        }
        this._data = {
            message: message,
            type: nType
        }
    }

    /**
     * 
     * Show the notification.
     * 
     */

    public show():void{
        notification.addNotification(this._data);
    }

}

/**
 * 
 * The list of all notification types.
 * 
 */

export enum INotificationType {
    error,
    warning,
    info,
    problem,
    success
}

/**
 * 
 * The interface for the stored data.
 * 
 */

interface INotificationData{
    message: string;
    type: string;
}