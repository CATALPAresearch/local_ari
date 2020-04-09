
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class Popup{
    public alert(text:string):Promise<void>{
        return new Promise(
            (resolve, reject) => {
                window.alert(text);
                return resolve();
            }
        );        
    }

    public confirm(text:string):Promise<void>{
        return new Promise(
            (resolve, reject) => {
                window.confirm(text);
                return resolve();
            }
        );        
    }

    public prompt(text:string, defaultAnswer?:string):Promise<string>{
        return new Promise(
            (resolve, reject) => {
                let response = window.prompt(text, defaultAnswer);
                return resolve(response);
            }
        );
    }
}

