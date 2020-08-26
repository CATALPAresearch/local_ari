//@ts-ignore
import * as $ from 'jquery';
//@ts-ignore
import "jqueryui";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class DOMVPTracker {

    private readonly _element:HTMLElement;  
    private _timer?:number; 
    private _timeout?:number;
    private _callback?: (data:IEData) => void;
    private _last?:IEData;
    private _onEvent = () => {
        window.clearTimeout(this._timer);
        if(typeof this._timeout === "number"){
            this._timer = window.setTimeout(
                () => {
                    this.get().then(
                        (resolve) => {
                            if(this._last){
                                if(!this._deepEquality(this._last,resolve) && this._callback){
                                    this._last = resolve;                                    
                                    this._callback(Object.assign({}, resolve, {date: new Date().getTime()}));
                                }
                            } else {
                                this._last = resolve;                               
                                if(this._callback) this._callback(Object.assign({}, resolve, {date: new Date().getTime()}));                                
                            }
                        }
                    );                    
                }, this._timeout
            );
        }        
    }

    private _deepEquality(o1:any, o2:any):boolean{
        const keys1 = Object.keys(o1);
        const keys2 = Object.keys(o2);
        if(keys1.length !== keys2.length) return false;
        for(const key of keys1){
            const val1 = o1[key];
            const val2 = o2[key];
            const areObj = val1 !== null && typeof val1 === "object" && val2 !== null && typeof val2 === "object";
            if((areObj && !this._deepEquality(val1, val2)) || (!areObj && val1 !== val2)) return false;            
        }
        return true;
    }

    constructor(jQuerySelector:string, index:number = 0){
        const e = $(jQuerySelector).get(index);
        e.style.backgroundColor = "red"; 
        this._element = e;                 
    }

    private _isHidden():boolean{
        return window.getComputedStyle(this._element).display === "none" || window.getComputedStyle(this._element).visibility === "hidden";
    }

    public startTracking(timeout:number, callback: (data:IEData) => void){
        this._timeout = timeout;
        this._callback = callback;
        window.removeEventListener("scroll", this._onEvent);
        window.addEventListener("scroll", this._onEvent);
        window.removeEventListener("resize", this._onEvent);
        window.addEventListener("resize", this._onEvent);        
        document.documentElement.removeEventListener("DOMSubtreeModified", this._onEvent);
        document.documentElement.addEventListener("DOMSubtreeModified", this._onEvent);
    }

    public stopTracking(){
        window.removeEventListener("scroll", this._onEvent);       
        window.removeEventListener("resize", this._onEvent);         
        document.documentElement.removeEventListener("DOMSubtreeModified", this._onEvent);              
    }

    public async get():Promise<IEData>{   
        if(typeof this._element !== "object" || !(this._element instanceof HTMLElement)) throw new Error("No valid HTMLElement.");
        const b = this._element.getBoundingClientRect();       
        const vpw = (window.innerWidth || document.documentElement.clientWidth);
        const vph = (window.innerHeight || document.documentElement.clientHeight);   
        let e = <IEData>{            
            element: this._element,
            dimensions: {
                height: b.height,
                width: b.width
            },
            viewport: {
                width: vpw,
                height: vph
            },
            position: {
                top: b.top,
                left: b.left,
                right: b.right,
                bottom: b.bottom,
                centerX: (b.right + b.width / 2),
                centerY: (b.top + b.height / 2)            
            },           
            fullyInsideVP: (b.top >= 0 && b.bottom <= vph && b.left >= 0 && b.right <= vpw) ? true : false,
            isHidden: this._isHidden(),
            visibility: 0
        }   
        if(!e.isHidden){
            let px = 0;
            for(let y = 0; y < Math.floor(b.height); y++){               
                const posY = b.top + y;
                for(let x = 0; x < Math.floor(b.width); x++){
                    const posX = b.left + x;
                    if(posX >= 0 && posX <= vpw && posY >= 0 && posY <= vph){                        
                        let elem = document.elementFromPoint(posX, posY);
                        if(elem !== null && elem === this._element) px++;
                    }
                }
            }              
            e.visibility = px / (Math.floor(b.width) * Math.floor(b.height));
            e.visibility = Number(e.visibility.toFixed(2));    
        } 
        return e;
    }
}

export interface IEData{
    date?:number;    
    element: object,
    dimensions: {
        height: number;
        width: number;
    },
    viewport: {
        width: number;
        height: number;
    },
    position: {
        top: number;
        left: number;
        right: number;
        bottom: number;
        centerX: number;
        centerY: number;    
    },   
    isHidden: boolean,
    overlayingElements?: any[];      
    fullyInsideVP: boolean;
    visibility: number;
}