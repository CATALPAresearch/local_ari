/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200901
 * @description Provides an interface to send a personal message to an user in Moodle
 * @param data ISystemMessage
 * @note You can use html at the message string.
 * 
 */

import Communication from "./core_communication";

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
