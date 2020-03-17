import { IConfig } from "./config";
import { SystemMessage } from "./messages";

/**
 * 
 * @author Marc Burchart
 * @email marc.burchart@fernuni-hagen.de
 * @version 1.0
 * @description The controller handling the plugin and all features.
 * 
 */

export default class Controller{

    constructor(config:IConfig){
        let test = new SystemMessage({message: "Dies ist mein Test"});
        test.run().then(
            (resolve) => {
                console.log(resolve);
            },
            (reject) => {
                console.log(reject);
            }
        )
    }

}