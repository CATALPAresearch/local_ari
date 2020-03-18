import { IConfig } from "./config";
import { SystemMessage } from "./messages";

export class Controller{

    private readonly _config:IConfig;

    constructor(config:IConfig){
        this._config = config;
        let sm = new SystemMessage({subject: "Mein Subject", message: "Lets go!"});
        sm.run().then(
            (resolve) => {
                console.log(resolve);
            },
            (reject) => {
                console.log(reject);
            }
        );
    }

}