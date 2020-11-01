/**
 *
 * @author Marc Burchart
 * @version 1.0-20200820
 * @description Different dialog types to interact with the user.
 *
 */

/**
  * Displays a dialog (asynchronous) with an optional message prompting the user to input some text.
  * @param message A string of text to display to the user.
  * @param defAnswer A string containing the default value displayed in the text input field.
  * 
  */

export function Prompt(message?: string, defAnswer?: string): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            let result = window.prompt(message, defAnswer);
            if (result !== null) {
                return resolve(result);
            }
            return reject();
        }
    );
}