define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocalStorage = exports.SessionStorage = void 0;
    class Storage {
        static _checkStorage() {
            if (typeof this === "undefined")
                return false;
            return true;
        }
    }
    class SessionStorage extends Storage {
        static get(key) {
            if (this._checkStorage())
                return null;
            return sessionStorage.getItem(key);
        }
        static set(key, value, overwrite = false) {
            if (this._checkStorage())
                return false;
            if (sessionStorage.getItem(key) !== null && !overwrite)
                return false;
            sessionStorage.setItem(key, value);
            return true;
        }
        static remove(key) {
            if (this._checkStorage())
                return false;
            sessionStorage.removeItem(key);
            return true;
        }
        static clear() {
            if (this._checkStorage())
                return false;
            sessionStorage.clear();
            return true;
        }
    }
    exports.SessionStorage = SessionStorage;
    class LocalStorage extends Storage {
        static get(key) {
            if (this._checkStorage())
                return null;
            return localStorage.getItem(key);
        }
        static set(key, value, overwrite = false) {
            if (this._checkStorage())
                return false;
            if (localStorage.getItem(key) !== null && !overwrite)
                return false;
            localStorage.setItem(key, value);
            return true;
        }
        static remove(key) {
            if (this._checkStorage())
                return false;
            localStorage.removeItem(key);
            return true;
        }
        static clear() {
            if (this._checkStorage())
                return false;
            localStorage.clear();
            return true;
        }
    }
    exports.LocalStorage = LocalStorage;
});
//# sourceMappingURL=../tsc/@maps/core_storage.js.map