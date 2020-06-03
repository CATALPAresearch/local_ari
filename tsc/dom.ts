//@ts-ignore
import $ from "jquery";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class CreateModal{

    private _data:ICreateModal;

    constructor(data:ICreateModal){
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
        if(typeof this._data.position !== "number" || !(this._data.position in EDOMPosition)) return false;
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
            <div class="modal fade" id="${this._data.id}" tabindex="-1" aria-labelledby="${this._data.id}" aria-hidden="${this._data.hidden?"true":"false"}">
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
                            case EDOMPosition.append:       selector.append(dom);
                                                            if(_this._data.hidden === false) $("#"+_this._data.id).modal("show");
                                                            console.log("#"+_this._data.id);
                                                            return resolve();
                            case EDOMPosition.prepend:      selector.prepend(dom);
                                                            if(_this._data.hidden === false) $("#"+_this._data.id).modal("show");
                                                            console.log("#"+_this._data.id);
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

export interface ICreateModal{
    selector: string;
    id: string;
    header?: string;
    body?: string;
    footer?: string;
    hidden: boolean;
    position: EDOMPosition;
    removeOld: boolean;
}

export enum EDOMPosition{
    append,
    prepend
}

export class RemoveDom{

    private _data:IRemoveDom;

    constructor(data:IRemoveDom){
        this._data = data;
    }

    public validate():boolean{
        if(typeof this._data !== "object") return false;
        if(typeof this._data.selector !== "string" || this._data.selector.length <= 0) return false;
        return true;
    }

    public async run():Promise<void>{
        let _this = this;
        return new Promise(
            (resolve, reject) => {
                $(document).ready(
                    function(){
                        $(_this._data.selector).remove();
                        return resolve();
                    }
                );
            }
        );
    }
}

export interface IRemoveDom{
    selector: string;
}

export class AddDom{

    private _data:IAddDOM;

    constructor(data:IAddDOM){
        this._data = data;
    }

    public validate():boolean{
        return true;
    }

    public async run():Promise<void>{
      
    }
}

export interface IAddDOM{}