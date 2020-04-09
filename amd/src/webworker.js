/**
 *
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A web worker is a JavaScript running in the background, without affecting the performance of the page.
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Webworker = /** @class */ (function () {
        function Webworker(url, options) {
            if (typeof window.Worker === "function") {
                this._worker = new window.Worker(url, options);
            }
        }
        Webworker.prototype.sendMessage = function (message) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.postMessage(message);
            return true;
        };
        Webworker.prototype.addMessageEventListener = function (callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.addEventListener("message", callback);
            return true;
        };
        Webworker.prototype.removeMessageEventListener = function (callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.removeEventListener("message", callback);
            return true;
        };
        Webworker.prototype.addErrorEventListener = function (callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.addEventListener("error", callback);
            return true;
        };
        Webworker.prototype.removeErrorEventListener = function (callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.removeEventListener("error", callback);
            return true;
        };
        Webworker.prototype.terminate = function () {
            if (typeof this._worker === "undefined")
                return false;
            try {
                this._worker.terminate();
                return true;
            }
            catch (error) {
                return false;
            }
        };
        return Webworker;
    }());
    exports.default = Webworker;
    function func_to_url(func) {
        var imp = func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
        var blob = new Blob([imp], { type: "text/javascript" });
        return URL.createObjectURL(blob);
    }
    exports.func_to_url = func_to_url;
});
