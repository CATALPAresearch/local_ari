//@ts-ignore
import $ from "jquery";

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

export class Modal{

    private _data:IModal;

    constructor(data:IModal){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.selector !== "string" || this._data.selector.length <= 0) return false;
        if(typeof this._data.id !== "string" || this._data.id.length <= 0) return false;
        if(typeof this._data.dom !== "string" || this._data.dom.length <= 0) return false;
        if(typeof this._data.hidden !== "boolean") return false;
        if(typeof this._data.position !== "number" || !(this._data.position in EModalPosition)) return false;
        return true;
    }

    public async run():Promise<void>{        
        let dom = `
            <div class="modal fade" id="${this._data.id}" tabindex="-1" aria-labelledby="${this._data.id}" aria-hidden="${this._data.hidden?"true":"false"}">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        ${this._data.dom}
                    </div>
                </div>
            </div>
        `;
        let _this = this;
        return new Promise(
            (resolve, reject) => {
                $(document).ready(
                    function(){
                        switch(this._data.position){
                            case EModalPosition.append:     $(_this._data.selector).append(dom);
                                                            return resolve();
                            case EModalPosition.prepend:    $(_this._data.selector).prepend(dom);
                                                            return resolve();
                        }                        
                        return reject("Unknown position.");
                    }
                );
            }
        );
    }
}

export interface IModal{
    selector: string;
    id: string;
    dom: string;
    hidden: boolean;
    position: EModalPosition;
}

export enum EModalPosition{
    append,
    prepend
}