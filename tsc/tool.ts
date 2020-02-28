//@ts-ignore
import $ from "jquery";

export default class Tool{

    protected static readonly windowWidth = window.innerWidth;
    protected static readonly windowHeight = window.innerHeight;
    
    constructor(){}

    protected static async _css(selector:string, options:Object){
        $(document).ready(
            function(){
                $(selector).css(options);
                return;
            }
        );
    }    
}