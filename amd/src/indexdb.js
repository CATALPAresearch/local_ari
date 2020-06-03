define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndexDB = /** @class */ (function () {
        function IndexDB(database, version) {
            this._database = database;
            this._version = version;
            var request = window.indexedDB.open(database, 2);
            request.onerror = function () {
                console.log("error");
            };
            request.onsuccess = function () {
                console.log("success");
                var db = request.result;
                var transaction = db.transaction("mytest", "readwrite");
                var objectStore = transaction.objectStore("mytest");
                var req = objectStore.add({ name: "second", work: "undone" });
                req.onerror = function (event) {
                    console.log(req.error);
                };
                req.onsuccess = function (event) {
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
            };
            request.onupgradeneeded = function (event) {
                console.log("upgrade");
                var db = request.result;
                db.createObjectStore("mytest", { keyPath: "name" });
                /*let db = request.result;
                let os = db.createObjectStore("mytest", {keyPath: "name"});
                os.add({name: "marc", work: "done"});*/
            };
        }
        return IndexDB;
    }());
    exports.IndexDB = IndexDB;
});
