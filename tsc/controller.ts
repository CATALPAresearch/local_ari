import { IConfig } from "./config";

/**
 * 
 * @author Marc Burchart
 * @email marc.burchart@fernuni-hagen.de
 * @version 1.0
 * @description The controller handling the plugin and all features.
 * 
 */

export default class Controller{
    
    private _config:IConfig;   
    private _query:IToolUsage[] = [];

    constructor(config:IConfig){
      this._config = config;
    }

    private async useTool(type:ETool, data:object):Promise<number>{   
        let obj = <IQuery>{
            type: type,
            data: data,
            pos: 0,
            prom: Promise.resolve()            
        }     
        let pos = this._query.push(obj) - 1;
        obj.pos = pos;     
        return;   
    }    
}

interface IQuery{
    type: ETool;
    pos: number;
    prom: Promise<void>;
    data: object;
}