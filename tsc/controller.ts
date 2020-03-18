import { IConfig } from "./config";

export class Controller{

    private readonly _config:IConfig;

    constructor(config:IConfig){
        this._config = config;
    }

}