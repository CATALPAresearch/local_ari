//@ts-ignore
import * as $ from 'jquery';
//@ts-ignore
import "jqueryui";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200604
 * @description Use Bootstrap’s JavaScript modal plugin to add dialogs for lightboxes, user notifications, or completely custom content.
 * 
 */

export class Modal {
    
    private _id:string;

    constructor(config:IModalConfig){
        if(!this._guard(config)) throw new Error(`[Modal-${config.id}] Incomplete or incorrect configuration.`);
        if($(`#${this._id}`).length > 0) throw new Error(`[Modal-${config.id}] ID is already used.`);
        this._id = config.id;        
        let content = "";
        if(typeof config.content === "object"){            
            if(typeof config.content.header === "string" && config.content.header.length > 0) {
                let header = config.content.header;
                if(typeof config.options === "object" && config.options.showCloseButton === true){
                    header += `<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
                }
                content += `<div class="modal-header">${header}</div>`;
            } else {
                if(typeof config.options === "object" && config.options.showCloseButton === true){
                    content += `<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
                }
            }
            if(typeof config.content.body === "string" && config.content.body.length > 0) content += `<div class="modal-body">${config.content.body}</div>`;
            if(typeof config.content.footer === "string" && config.content.footer.length > 0) content += `<div class="modal-footer">${config.content.footer}</div>`;
        }
        let size = "";
        let align = "";
        let fade = "";
        let addClass = "";
        if(typeof config.options === "object"){
            if(config.options.centerVertically === true) align = "modal-dialog-centered";
            switch(config.options.size){
                case EModalSize.large:  size = "modal-lg";
                                        break;
                case EModalSize.small:  size = "modal-sm";
                                        break;
            }
            if(align.length > 0 && size.length > 0) size = size + " ";
            if(config.options.animate === true) fade = "fade";            
        }   
        if(typeof config.addClass === "string" && config.addClass.length > 0) addClass = config.addClass;     
        if(fade.length > 0 && addClass.length > 0) fade = fade + " ";
        let dialog = `<div class="modal-dialog ${align}${size}" role="document"><div class="modal-content">${content}</div></div>`; 
        let modal = `<div class="modal ${fade}${addClass}" id="${config.id}" tabindex="-1" role="dialog" aria-labelledby="${config.id}" aria-hidden="true">${dialog}</div>`;       
        console.log(modal);
        $("body").append(modal);
        if(typeof config.options === "object"){
            let obj = {
                backdrop: typeof config.options.backdrop === "boolean" ? config.options.backdrop : undefined,
                keyboard: typeof config.options.keyboard === "boolean" ? config.options.keyboard : undefined,
                focus: typeof config.options.focus === "boolean" ? config.options.focus : undefined,
                show: typeof config.options.show === "boolean" ? config.options.show : undefined
            }
            $(`#${this._id}`).modal(obj);
        }
    }
    
    /** Manually opens a modal. */
    public show():void{
        $(`#${this._id}`).modal("show");
    }

    /** Manually hides a modal. */
    public hide():void{
        $(`#${this._id}`).modal("hide");
    }

    /** Manually toggles a modal. */
    public toggle():void{
        $(`#${this._id}`).modal("toggle");
    }

    /** Manually readjust the modal’s position if the height of a modal changes while it is open (i.e. in case a scrollbar appears). */
    public update():void{
        $(`#${this._id}`).modal("handleUpdate");
    }

    /** Destroys an element’s modal. */
    public destroy():void{
        $(`#${this._id}`).modal("dispose");
    }

    /** Bootstrap’s modal class exposes a few events for hooking into modal functionality. All modal events are fired at the modal itself (i.e. at the <div class="modal">). */
    public addEvent(event:EModalEvent, callback:any):void{
        if(typeof callback !== "function") throw new Error(`[Modal-${this._id}] Callback is not a function.`);
        $(`#${this._id}`).on(this._getEvent(event), callback);
    }

    /** Bootstrap’s modal class exposes a few events for hooking into modal functionality. All modal events are fired at the modal itself (i.e. at the <div class="modal">). */
    public removeEvent(event:EModalEvent, callback:any):void{
        if(typeof callback !== "function") throw new Error(`[Modal-${this._id}] Callback is not a function.`);
        $(`#${this._id}`).off(this._getEvent(event), callback);        
    }

    /** Get the ID of the Modal. */
    public getID():string{
        return this._id;
    }

    private _getEvent(event:EModalEvent):string{
        switch(event){
            case EModalEvent.show:      return "show.bs.modal";                                        
            case EModalEvent.shown:     return "shown.bs.modal";                                        
            case EModalEvent.hide:      return "hide.bs.modal";
            case EModalEvent.hidden:    return "hidden.bs.modal";
            default: throw new Error("Unknown Event.");
        }        
    }

    private _guard(config:IModalConfig):boolean{
        if(typeof config !== "object")  return false;
        if(typeof config.id !== "string" || config.id.length <= 0) return false;
        if(typeof config.addClass !== "undefined" && (typeof config.addClass !== "string" || config.addClass.length <= 0)) return false;
        return true;
    }
}

export enum EModalEvent{
    /** This event fires immediately when the show instance method is called. If caused by a click, the clicked element is available as the relatedTarget property of the event. */
    show,
    /** This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the relatedTarget property of the event. */
    shown,
    /** This event is fired immediately when the hide instance method has been called. */
    hide,
    /** This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete) */
    hidden
}

export enum EModalSize{
    large,
    small
}

export interface IModalConfig {
    id:string; 
    addClass?:string;       
    content?: {
        header?:string;
        body?:string;
        footer?:string;        
    }    
    options?: {
        /** Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click. */
        backdrop?: boolean; 
        /** Closes the modal when escape key is pressed */    
        keyboard?: boolean;  
        /** Puts the focus on the modal when initialized. */   
        focus?: boolean;
        /** Shows the modal when initialized. */
        show?: boolean;
        /** The modal will slide down and fade in from the top of the page. */
        animate?: boolean;
        /** Vertically center the modal. */
        centerVertically?: boolean;
        /** Modals have two optional sizes: large and small */
        size?:EModalSize;
        /** Add a close button to the header. */
        showCloseButton: boolean;
    }
}