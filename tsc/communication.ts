/**
 * 
 * @author Marc Burchart
 * @email marc.burchart@fernuni-hagen.de
 * @version 1.0
 * @description A class for basic communication.
 * 
 */

//@ts-ignore
import ajax from 'core/ajax';

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
                    methodname: "local_ari_"+method,
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