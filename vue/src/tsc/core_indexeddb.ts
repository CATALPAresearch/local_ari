
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description IndexedDB ist eine low-level API für die clientseitige Speicherung großer Mengen strukturierter Daten einschließlich Dateien. Sie erlaubt auch Hochleistungssuchen dieser Daten durch die Verwendung von Indizes.
 * Im privaten Modus deaktiviert.
 */

export class IndexedDB{

    private _dbName:string;
    private _version:number = 1;
    private _db?:IDBDatabase;

    constructor(dbName:string, version?:number){
        if(version && version > 0) version = this._version;
        this._dbName = dbName;
    }   

    /**
     * 
     * Open the database.
     * @param modifyTables Create or delete tables at the database.
     * @returns Current db version (can increase).
     * 
     */

    public open(modifyTables?:IModifyTables):Promise<number>{
        if(!window.indexedDB) return Promise.reject(new Error("IndexedDB not supported."));
        if(modifyTables) this._version++;
        const _this = this;
        return new Promise(
            (resolve, reject) => {
                const request = window.indexedDB.open(this._dbName, this._version);
                request.onerror = function(event){
                    return reject(event);
                }
                request.onsuccess = function(){  
                    _this._version = request.result.version;   
                    _this._db = request.result;                                   
                    return resolve(request.result.version);
                }  
                request.onupgradeneeded = function(){
                    const db = request.result;
                    if(modifyTables){
                        if(modifyTables.delete){
                            for(let i in modifyTables.delete){
                                const obj = modifyTables.delete[i];
                                db.deleteObjectStore(obj.name);
                            }
                        }
                        if(modifyTables.create){
                            for(let i in modifyTables.create){
                                const obj = modifyTables.create[i];
                                const os = db.createObjectStore(obj.name, obj.options);
                                if(obj.index){
                                    for(let u in obj.index){
                                        const index = obj.index[u];
                                        os.createIndex(index.name, index.keyPath, index.params);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        );
    }   
    
    /**
     * Close the database connection.
     */

    public close():void{
        if(this._db) this._db.close();
    }  

    public getVersion():number{
        return this._version;
    }

    public write(table:string, data:IAddToTable[]):Promise<void>{        
        return new Promise(
            (resolve,reject) => {
                if(!this._db) return reject(new Error("No connection to IndexedDB."));
                const transaction = this._db.transaction(table, "readwrite");                
                transaction.onerror = function(error:any){
                    return reject(error);
                }            
                transaction.oncomplete  = function(){
                    return resolve();
                }    
                for(let i in data){
                    const d = data[i];
                    transaction.objectStore(table).add(d.data, d.key);
                }                
            }
        );
    }

    public read(table:string, key:string|number):Promise<any>{        
        return new Promise(
            (resolve,reject) => {
                if(!this._db) return reject(new Error("No connection to IndexedDB."));
                const transaction = this._db.transaction(table, "readonly");   
                const objectStore = transaction.objectStore(table);
                const request = objectStore.get(key);             
                request.onerror = function(error:any){
                    return reject(error);
                }            
                request.onsuccess = function(){
                    return resolve(request.result);
                }                   
            }
        );
    }

    public delete(table:string, key:string|number):Promise<void>{        
        return new Promise(
            (resolve,reject) => {
                if(!this._db) return reject(new Error("No connection to IndexedDB."));
                const transaction = this._db.transaction(table, "readwrite");   
                const objectStore = transaction.objectStore(table);
                const request = objectStore.delete(key);             
                request.onerror = function(error:any){
                    return reject(error);
                }            
                request.onsuccess = function(){
                    return resolve(request.result);
                }  
            }
        );
    }

}

export interface IModifyTables{
    create?: ITables[];
    delete?: ITables[];
}

export interface ITables{
    name: string;
    options?: {
        keyPath?: string;
        autoIncrement?: boolean;
    }
    index?:IIndex[];
}

export interface IIndex{
    name: string;
    keyPath: string;
    params?:IDBIndexParameters;
}

export interface IAddToTable{
    data: any;
    key?:string;
}