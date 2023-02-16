//@ts-ignore
import * as $ from 'jquery';
//@ts-ignore
import "jqueryui";

/**
 * 
 * @author Niels Seidel
 * @version 1.0-20200604
 * @description Use JavaScript to add dialogs for user notifications, or completely custom content.
 * 
 */

export class HtmlPrompt {
    
    private _id:string;
    private config:IHtmlPromptConfig;

    constructor(config:IHtmlPromptConfig){
        console.log('ARI::initHtmlPrompt');
        this._id = config.id; 
        this.config = config
        if(!this._guard(config)) throw new Error(`[Modal-${config.id}] Incomplete or incorrect configuration.`);
        /*if($(`#${config.id}`).length > 0) throw new Error(`[Modal-${config.id}] ID is already used.`);
        this._id = config.id;        
        let content = "";
        if(typeof config.content === "object"){            
            if(typeof config.content.html === "string" && config.content.html.length > 0){
                content += `<div class="modal-body">${config.content.html}</div>`;
            }
            if(typeof config.content.style === "string" && config.content.style.length > 0){
                // content += `<div class="modal-footer">${config.content.footer}</div>`;
            } 
        }
        */
        
    }

    public run():boolean{
        let _this = this;
        let prompt = '<div class="htmlPrompt'+this._id+'" id="'+this.config.id+'" >'+this.config.content.message+'</div>';
        const btn_later = $('<button class="btn btn-link text-right">später</button>');
        btn_later.click(function(){
            console.log('click later');
            $('.htmlPrompt'+_this._id).parent().hide();
            //TODO: store event for the reinforcement learning model
        });
        const btn_ignore = $('<button class="btn btn-link text-right">ignorieren</button>');
        btn_ignore.click(function(){
            console.log('click ignore');
            $('.htmlPrompt'+_this._id).parent().hide();
            if(_this.config.indicatorhook !== undefined && typeof _this.config.indicatorhook == 'string'){
                $(_this.config.indicatorhook).css('border','0');
            }
            //TODO: store event for the reinforcement learning model
        });
        if(this.config.indicatorhook !== undefined && typeof this.config.indicatorhook == 'string'){
            $(this.config.indicatorhook).css('border','solid 2px red');
        }
        $(this.config.hook)
            .css('background-color', 'lightblue')
            .addClass('p-1');
        $(this.config.hook).html(prompt);
        $(this.config.hook).append(btn_later);
        $(this.config.hook).append(btn_ignore);
        console.log('ARI::runHtmlPrompt ', this.config.hook, prompt);
        return true;
    }
    
    /** Manually opens a modal. */
    public show():void{
        $(`#${this._id}`).show()
    }

    /** Manually hides a modal. */
    public hide():void{
        $(`#${this._id}`).hide();
    }

    /** Manually toggles a modal. */
    public toggle():void{
        //$(`#${this._id}`).modal("toggle");
    }

    /** Manually readjust the modal’s position if the height of a modal changes while it is open (i.e. in case a scrollbar appears). */
    public update():void{
        //$(`#${this._id}`).modal("handleUpdate");
    }

    /** Destroys an element’s modal. */
    public destroy():void{
        $(`#${this._id}`).remove();
    }


    /** Get the ID of the Modal. */
    public getID():string{
        return this._id;
    }

    

    private _guard(config:IHtmlPromptConfig):boolean{
        if(typeof config !== "object")  return false;
        if(typeof config.id !== "string" || config.id.length <= 0) return false;
        if(typeof config.hook !== "undefined" && (typeof config.hook !== "string" || config.hook.length <= 0)) return false;
        if(typeof config.content !== "undefined" && (typeof config.content !== "object")) return false;
        if(typeof config.content.message !== "undefined" && (typeof config.content.message !== "string" || config.content.message.length <= 0)) return false;
        return true;
    }
}

export enum EHtmlPromptEvent{
    /** This event fires immediately when the show instance method is called. If caused by a click, the clicked element is available as the relatedTarget property of the event. */
    show,
    /** This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the relatedTarget property of the event. */
    shown,
    /** This event is fired immediately when the hide instance method has been called. */
    hide,
    /** This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete) */
    hidden
}

export enum EHtmlPromptUrgency{
    low,
    normal,
    medium,
    hight
}

export interface IHtmlPromptConfig {
    id:string; 
    hook:string;
    indicatorhook?:string;
    content: {
        message:string;
        urgency?:EHtmlPromptUrgency;
        html?:string;
        style?:string;  
    }    
    options?: {
        
    }
}