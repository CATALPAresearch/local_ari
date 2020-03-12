/**
 * 
 * @author Marc Burchart
 * @email marc.burchart@fernuni-hagen.de
 * @version 1.0
 * @description A class to analyze the current window location.
 * 
 */

export default class URLAnalyzer{

    public readonly url:string = window.location.href;
    public readonly hostname:string = window.location.hostname;
    public readonly path:string = window.location.pathname;
    public readonly protocol:string = window.location.protocol;
    public readonly params:any = {};

    constructor(){
        let params = window.location.search.substr(1);
        if(params.length > 0){
            let split = params.split("&");
            for(let i in split){
                let item:any = split[i].split("=");
                if(item.length !== 2) continue;
                if(!isNaN(+item[1])) item[1] = +item[1];
                this.params[item[0]] = item[1];                
            }           
        }      
    }
}