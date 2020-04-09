/**
 *
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description With web storage, web applications can store data locally within the user's browser.
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Webstorage = /** @class */ (function () {
        function Webstorage() {
        }
        Webstorage.tryToParse = function (data) {
            try {
                var out = JSON.parse(data);
                return out;
            }
            catch (error) {
                return data;
            }
        };
        Webstorage.setLocalStorage = function (name, data) {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return false;
            if (typeof data !== "string")
                data = JSON.stringify(data);
            window.localStorage.setItem(name, data);
            return true;
        };
        Webstorage.getLocalStorage = function (name) {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return null;
            var result = window.localStorage.getItem(name);
            if (result === null)
                return null;
            return Webstorage.tryToParse(result);
        };
        Webstorage.deleteLocalStorage = function (name) {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return false;
            try {
                window.localStorage.removeItem(name);
                return true;
            }
            catch (error) {
                return false;
            }
        };
        Webstorage.clearLocalStorage = function () {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return false;
            try {
                window.localStorage.clear();
                return true;
            }
            catch (error) {
                return false;
            }
        };
        Webstorage.localStorageLength = function () {
            if (typeof window !== "object" || typeof window.localStorage !== "object")
                return null;
            return window.localStorage.length;
        };
        Webstorage.setSessionStorage = function (name, data) {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return false;
            if (typeof data !== "string")
                data = JSON.stringify(data);
            window.sessionStorage.setItem(name, data);
            return true;
        };
        Webstorage.getSessionStorage = function (name) {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return null;
            var result = window.sessionStorage.getItem(name);
            if (result === null)
                return null;
            return Webstorage.tryToParse(result);
        };
        Webstorage.deleteSessionStorage = function (name) {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return false;
            try {
                window.sessionStorage.removeItem(name);
                return true;
            }
            catch (error) {
                return false;
            }
        };
        Webstorage.clearSessionStorage = function () {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return false;
            try {
                window.sessionStorage.clear();
                return true;
            }
            catch (error) {
                return false;
            }
        };
        Webstorage.sessionStorageLength = function () {
            if (typeof window !== "object" || typeof window.sessionStorage !== "object")
                return null;
            return window.sessionStorage.length;
        };
        return Webstorage;
    }());
    exports.default = Webstorage;
});
