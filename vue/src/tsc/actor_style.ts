
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description xxx
 * 
 */

//@ts-ignore
import * as $ from 'jquery';

export class StyleHandler{  
    
    public static async processList(list:Array<IStyle&IAnimation>):Promise<void>{   
        let push = [];     
        for(let i in list){            
            let obj = list[i];
            if(obj.value){
                // @ts-ignore
                push.push(this.style(obj).catch(()=>{return Promise.resolve();}));
            } else if(obj.params){
                // @ts-ignore
                push.push(this.animate(obj).catch(()=>{return Promise.resolve();}));
            }            
        }
        Promise.all(push);
    }

    public static async style(data:IStyle):Promise<void>{
        let func = function(){
            if(data.duration){
                let old = $(data.selector).css(data.property);
                $(data.selector).css(data.property, data.value).delay(data.duration).css(data.property, old);
            } else {
                $(data.selector).css(data.property, data.value);
            } 
        }
        if(data.documentReady){
            $(document).ready(func);
        } else {
            func();
        }             
    }

    public static async animate(data:IAnimation):Promise<void>{
        let func = function(){
            $(data.selector).animate(data.params, data.duration);
        }
        if(data.documentReady){
            $(document).ready(func);
        } else {
            func();
        }        
    }

}

interface IStyle{
    documentReady:boolean;
    selector: string;
    property: string;
    value: string|number;
    duration?: number;   
}

interface IAnimation{
    documentReady:boolean;
    selector: string;
    params: object;
    duration: number;    
}