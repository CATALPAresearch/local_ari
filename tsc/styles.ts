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
        if(typeof this._data.header !== "undefined" && (typeof this._data.header !== "string" || this._data.header.length <= 0)) return false;
        if(typeof this._data.body !== "undefined" && (typeof this._data.body !== "string" || this._data.body.length <= 0)) return false;
        if(typeof this._data.footer !== "undefined" && (typeof this._data.footer !== "string" || this._data.footer.length <= 0)) return false;
        if(typeof this._data.hidden !== "boolean") return false;
        if(typeof this._data.removeOld !== "boolean") return false;
        if(typeof this._data.position !== "number" || !(this._data.position in EModalPosition)) return false;
        return true;
    }

    public async run():Promise<void>{       
        let content = `
            <div class="modal-header">${this._data.header?this._data.header:""} 
                <button type="button" class="close" data-dismiss="modal" aria-label="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;       
        if(this._data.body) content += `<div class="modal-body">${this._data.body}</div>`;
        if(this._data.footer) content += `<div class="modal-footer">${this._data.footer}</div>`;
        let dom = `
            <div class="modal ${this._data.hidden?"":"show"} fade" id="${this._data.id}" tabindex="-1" aria-labelledby="${this._data.id}" aria-hidden="${this._data.hidden?"true":"false"}">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                       ${content}
                    </div>
                </div>
            </div>
        `;
        console.log(dom);
        let _this = this;
        return new Promise(
            (resolve, reject) => {
                $(document).ready(
                    function(){
                        let selector = $(_this._data.selector);
                        if(_this._data.removeOld && selector.length > 0){
                            selector.remove();
                        }
                        switch(_this._data.position){
                            case EModalPosition.append:     selector.append(dom);
                                                            return resolve();
                            case EModalPosition.prepend:    selector.prepend(dom);
                                                            return resolve();
                            default: break;
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
    header?: string;
    body?: string;
    footer?: string;
    hidden: boolean;
    position: EModalPosition;
    removeOld: boolean;
}

export enum EModalPosition{
    append,
    prepend
}