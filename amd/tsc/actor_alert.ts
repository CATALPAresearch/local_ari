
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