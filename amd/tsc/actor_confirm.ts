/**
 *
 * @author Marc Burchart
 * @version 1.0-20200820
 * @description Different dialog types to interact with the user.
 *
 */

/**
 * Displays a modal dialog (asynchronous) with an optional message and two buttons: OK and Cancel.
 * @param message A string you want to display in the alert dialog.
 * 
 */

export function Confirm(message?: string): Promise<boolean> {
    return new Promise(
        (resolve, reject) => {
            let result = window.confirm(message);
            if (typeof result === "boolean") return resolve(result);
            return reject();
        }
    );
}