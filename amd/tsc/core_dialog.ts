
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200820
 * @description Different dialog types to interact with the user.
 * 
 */

 /**
  * Displays an alert dialog (asynchronous) with the optional specified content and an OK button.
  * @param message A string you want to display in the alert dialog.
  * 
  */

export function Alert(message?:string):Promise<void>{
    return new Promise(
        (resolve) => {
            window.alert(message);
            return resolve();
        }
    );
}

/**
  * Displays a dialog (asynchronous) with an optional message prompting the user to input some text.
  * @param message A string of text to display to the user.
  * @param defAnswer A string containing the default value displayed in the text input field.
  * 
  */

export function Prompt(message?:string, defAnswer?:string):Promise<string>{
    return new Promise(
        (resolve, reject) => {
            let result = window.prompt(message, defAnswer);
            if(result !== null){
                return resolve(result);
            }
            return reject();
        }
    );
}

/**
 * Displays a modal dialog (asynchronous) with an optional message and two buttons: OK and Cancel.
 * @param message A string you want to display in the alert dialog.
 * 
 */

export function Confirm(message?:string):Promise<boolean>{
    return new Promise(
        (resolve, reject) => {
            let result = window.confirm(message);
            if(typeof result === "boolean") return resolve(result);
            return reject();
        }
    );
}