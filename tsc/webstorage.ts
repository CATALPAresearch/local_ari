/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description With web storage, web applications can store data locally within the user's browser.
 * 
 */

export default class Webstorage{

    private static tryToParse(data:string){
        try{
            let out = JSON.parse(data);
            return out;
        } catch(error){
            return data;
        }
    }
    
    public static setLocalStorage(name:string, data:any):boolean{
        if(typeof window !== "object" || typeof window.localStorage !== "object") return false;
        if(typeof data !== "string") data = JSON.stringify(data);
        window.localStorage.setItem(name, data);         
        return true;
    }

    public static getLocalStorage(name:string):any{
        if(typeof window !== "object" || typeof window.localStorage !== "object") return null;
        let result = window.localStorage.getItem(name);
        if(result === null) return null;
        return Webstorage.tryToParse(result);
    }

    public static deleteLocalStorage(name:string):boolean{
        if(typeof window !== "object" || typeof window.localStorage !== "object") return false;
        try{
            window.localStorage.removeItem(name);
            return true;
        } catch(error){
            return false;
        }  
    }

    public static clearLocalStorage():boolean{
        if(typeof window !== "object" || typeof window.localStorage !== "object") return false;
        try{
            window.localStorage.clear();
            return true;
        } catch(error){
            return false;
        }    
    }

    public static localStorageLength():number|null{
        if(typeof window !== "object" || typeof window.localStorage !== "object") return null;
        return window.localStorage.length;
    }

    public static setSessionStorage(name:string, data:any):boolean{
        if(typeof window !== "object" || typeof window.sessionStorage !== "object") return false;
        if(typeof data !== "string") data = JSON.stringify(data);        
        window.sessionStorage.setItem(name, data);
        return true;
    }
   
    public static getSessionStorage(name:string):any{
        if(typeof window !== "object" || typeof window.sessionStorage !== "object") return null;
        let result = window.sessionStorage.getItem(name);
        if(result === null) return null;
        return Webstorage.tryToParse(result);
    }

    public static deleteSessionStorage(name:string):boolean{
        if(typeof window !== "object" || typeof window.sessionStorage !== "object") return false;
        try{
            window.sessionStorage.removeItem(name);
            return true;
        } catch(error){
            return false;
        }    
    }

    public static clearSessionStorage():boolean{
        if(typeof window !== "object" || typeof window.sessionStorage !== "object") return false;
        try{
            window.sessionStorage.clear();
            return true;
        } catch(error){
            return false;
        }    
    }

    public static sessionStorageLength():number|null{
        if(typeof window !== "object" || typeof window.sessionStorage !== "object") return null;
        return window.sessionStorage.length;
    }
}