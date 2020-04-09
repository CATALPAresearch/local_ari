//@ts-ignore
import $ from "jquery";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class CSS{

    private _data:ICSS;

    constructor(data:ICSS){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.selector !== "string" || this._data.selector.length <= 0) return false;
        if(typeof this._data.properties !== "object") return false;
        return true;
    }

    public async run():Promise<void>{
        let _this = this;
        return new Promise(
            (resolve,reject) => {
                $(document).ready(
                    function(){
                        let selector = $(_this._data.selector);
                        if(selector.length <= 0) return reject(new Error("Unknown selector"));
                        selector.css(_this._data.properties);
                        return resolve();
                    }
                );
            }
        );        
    }
}

export interface ICSS{
    selector: string;
    properties: object;
}