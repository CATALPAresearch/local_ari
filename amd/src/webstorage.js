define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Webstorage {
        static tryToParse(data) {
            try {
                let out = JSON.parse(data);
                return out;
            }
            catch (error) {
                return data;
            }
        }
        static setLocalStorage(name, data) {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return false;
            if (typeof data !== "string")
                data = JSON.stringify(data);
            window.localStorage.setItem(name, data);
            return true;
        }
        static getLocalStorage(name) {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return null;
            let result = window.localStorage.getItem(name);
            if (result === null)
                return null;
            return Webstorage.tryToParse(result);
        }
        static deleteLocalStorage(name) {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return false;
            try {
                window.localStorage.removeItem(name);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        static clearLocalStorage() {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return false;
            try {
                window.localStorage.clear();
                return true;
            }
            catch (error) {
                return false;
            }
        }
        static localStorageLength() {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return null;
            return window.localStorage.length;
        }
        static setSessionStorage(name, data) {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return false;
            if (typeof data !== "string")
                data = JSON.stringify(data);
            window.sessionStorage.setItem(name, data);
            return true;
        }
        static getSessionStorage(name) {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return null;
            let result = window.sessionStorage.getItem(name);
            if (result === null)
                return null;
            return Webstorage.tryToParse(result);
        }
        static deleteSessionStorage(name) {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return false;
            try {
                window.sessionStorage.removeItem(name);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        static clearSessionStorage() {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return false;
            try {
                window.sessionStorage.clear();
                return true;
            }
            catch (error) {
                return false;
            }
        }
        static sessionStorageLength() {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return null;
            return window.sessionStorage.length;
        }
    }
    exports.default = Webstorage;
});
