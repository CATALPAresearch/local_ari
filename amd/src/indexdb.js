define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IndexDB {
        constructor(database, version) {
            this._database = database;
            this._version = version;
            let request = window.indexedDB.open(database, 2);
            request.onerror = function () {
                console.log("error");
            };
            request.onsuccess = function () {
                console.log("success");
                let db = request.result;
                var transaction = db.transaction("mytest", "readwrite");
                var objectStore = transaction.objectStore("mytest");
                let req = objectStore.add({ name: "second", work: "undone" });
                req.onerror = function (event) {
                    console.log(req.error);
                };
                req.onsuccess = function (event) {
                    console.log("success save");
                };
            };
            request.onupgradeneeded = function (event) {
                console.log("upgrade");
                let db = request.result;
                db.createObjectStore("mytest", { keyPath: "name" });
            };
        }
    }
    exports.IndexDB = IndexDB;
});
