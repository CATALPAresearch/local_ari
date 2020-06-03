export class IndexDB {

    private _database:string;
    private _version?:number;

    constructor(database:string, version?:number){
        this._database = database;
        this._version = version;

        let request = window.indexedDB.open(database, 2);

        request.onerror = function(){
            console.log("error");
        }

        request.onsuccess = function(){
            console.log("success");
           
            let db = request.result;
            var transaction = db.transaction("mytest", "readwrite");
            var objectStore = transaction.objectStore("mytest");
            let req = objectStore.add({name: "second", work: "undone"});
            req.onerror = function(event) {
                console.log(req.error);
            };
            req.onsuccess = function(event) {
                console.log("success save");
            };

            //os.add({name: "marc", work: "done"});

            /*var transaction = db.transaction("mydb", "readwrite");
            var objectStore = transaction.objectStore("mytest");
            let req = objectStore.add({name: "second", work: "undone"});
            req.onerror = function(event) {
               console.log(req.error);
            };
            req.onsuccess = function(event) {
               console.log("success");
            };*/

        }

        request.onupgradeneeded = function(event){
            console.log("upgrade");
            let db = request.result;
            db.createObjectStore("mytest", {keyPath: "name"});
            /*let db = request.result;
            let os = db.createObjectStore("mytest", {keyPath: "name"});
            os.add({name: "marc", work: "done"});*/
        }
      
    }

}

export interface IDatabaseStructure {
    [key:string]: Table;
}

interface Table{
    key: string;
    index: Index | Index[];
}

interface Index{
    name: string;
    options: IDBIndexParameters;
}