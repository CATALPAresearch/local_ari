//@ts-ignore
import ajax from 'core/ajax';
import { Config } from './config';

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export default class Communication{
    
    /**
     * 
     * Communicate with moodle webservices
     * @param method The requested webservice method
     * @param param Parameter you want to send to the webservice.
     * @returns The received data | error
     * 
     */

    public static webservice(method:string, param?:object):Promise<any>{          
        return new Promise(           
            (resolve, reject) => {           
                ajax.call([{
                    methodname: Config.plugin.name+method,
                    args: param?param:{},
                    timeout: 3000,
                    done: function(data:any){                                                                
                        return resolve(data);
                    },
                    fail: function(error:Error|Object){                                                                
                        return reject(error);
                    }                  
                }]);
            }
        );      
    }    
}

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200829
 * @description Allows communication between different documents (in different windows, tabs, frames or iframes) of the same origin.
 * 
 */

export class BrowserBroadcast{

    private readonly _broadcastChannel:BroadcastChannel;

    constructor(name:string){
        this._broadcastChannel = new BroadcastChannel(name);
    }

    public receive(callback:(ev:MessageEvent) => void):void{
        this._broadcastChannel.onmessage = callback;
    }

    public messageError(callback:(ev:MessageEvent) => void):void{
        this._broadcastChannel.onmessageerror = callback;
    }

    public send(message:IBroadcastMessage){
        this._broadcastChannel.postMessage(message);
    }

    public close():void{
        this._broadcastChannel.close();
    }

}

export interface IBroadcastMessage{
    sender: string;
    message: any;
}