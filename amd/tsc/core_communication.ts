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