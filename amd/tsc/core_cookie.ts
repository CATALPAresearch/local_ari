
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description Cookies let you store user information in web pages.
 * 
 */

export default class Cookie{
    
    public static set(name:string, value:any, expires?:Date, path?:string):void{
        name = name.replace(" ", "");
        name = name.replace(";", "");        
        if(typeof name !== "string" || name.length <= 0) throw Error("Invalide cookie name");   
        if(typeof path === "string") path = path.replace(";", "");  
        if(typeof value !== "string") value = JSON.stringify(value);           
        document.cookie = `${name}=${value}${typeof expires === "object" && typeof expires.toUTCString === "function" ? ";expires="+expires.toUTCString() : ""}${typeof path === "string" && path.length > 0 ? ";path="+path : "path=/"}`
        return;
    }

    public static getAll():object{
        let cookies = document.cookie.split(";");
        if(typeof cookies !== "object") throw new Error("Could not read cookies");
        let object:any = {};
        let tryToObjectify = function(input:string):any{
            try{
                let obj = JSON.parse(input);
                return obj;
            } catch(error){
                return input;
            }
        }
        for(let i in cookies){
            let cookie = cookies[i].split("=");
            if(cookie.length < 2) continue;   
            let shift = cookie.shift();
            if(typeof shift !== "string") continue;         
            let name = shift.replace(" ", "");
            if(typeof name !== "string" || name.length <= 0) continue;
            let value = tryToObjectify(cookie.join("=").replace(" ", ""));                   
            object[name] = value;
        }        
        return object;
    } 

    public static get(name:string):any{
        name = name.replace(" ", "");
        let all:any = Cookie.getAll();
        if(typeof all[name] !== "undefined") return all[name];
        return undefined;
    }

    public static remove(name:string, path?:string):void{
        let date = new Date(new Date().setDate(new Date().getDate() - 100));
        Cookie.set(name, "", date, path);
        return;
    }
}