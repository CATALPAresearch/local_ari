
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description An interface of the Web Storage API provides access to a particular domain's session or local storage.
 * 
 */

class Storage{
    
   protected static _checkStorage():boolean{
        if(typeof this === "undefined") return false;
        return true;
   }

}

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description Session storage object for the current origin (e.g. tab).
 * 
 */

export class SessionStorage extends Storage{

   public static get(key:string):any{
      if(this._checkStorage()) return null;
      return sessionStorage.getItem(key);
   } 

   public static set(key:string, value:any, overwrite = false):boolean{
      if(this._checkStorage()) return false;
      if(sessionStorage.getItem(key) !== null && !overwrite) return false;
      sessionStorage.setItem(key, value);
      return true;
   }

   public static remove(key:string):boolean{
      if(this._checkStorage()) return false;
      sessionStorage.removeItem(key);
      return true;
   }

   public static clear():boolean{
      if(this._checkStorage()) return false;
      sessionStorage.clear();
      return true;
   }   
}

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description Global data storage with no expiration time. Data in a localStorage object created in a "private browsing" or "incognito" session is cleared when the last "private" tab is closed.
 * 
 */

export class LocalStorage extends Storage{

   public static get(key:string):any{
      if(this._checkStorage()) return null;
      return localStorage.getItem(key);
   } 

   public static set(key:string, value:any, overwrite = false):boolean{
      if(this._checkStorage()) return false;
      if(localStorage.getItem(key) !== null && !overwrite) return false;
      localStorage.setItem(key, value);
      return true;
   }

   public static remove(key:string):boolean{
      if(this._checkStorage()) return false;
      localStorage.removeItem(key);
      return true;
   }

   public static clear():boolean{
      if(this._checkStorage()) return false;
      localStorage.clear();
      return true;
   }   
}