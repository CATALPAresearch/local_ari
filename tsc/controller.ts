import { IConfig } from "./config";

export default class Controller{
    
    private _config:IConfig;
    private readonly _location = window.location.href;

    constructor(config:IConfig){
        this._config = config;
    }

    private async pull(){

    }

    private async push(){

    }
}