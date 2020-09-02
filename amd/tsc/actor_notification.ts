
//@ts-ignore
import * as notification from "core/notification" ;

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description Provide contextual feedback messages.
 * 
 */

export function Notification(message:string, type:INotificationType):void{
    notification.addNotification({
        message: message,
        type: INotificationType[type],
    });
}

export enum INotificationType{
    error,
    warning,
    info,
    problem,
    success
}