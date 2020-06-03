define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Webworker {
        constructor(url, options) {
            if (typeof window.Worker === "function") {
                this._worker = new window.Worker(url, options);
            }
        }
        sendMessage(message) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.postMessage(message);
            return true;
        }
        addMessageEventListener(callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.addEventListener("message", callback);
            return true;
        }
        removeMessageEventListener(callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.removeEventListener("message", callback);
            return true;
        }
        addErrorEventListener(callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.addEventListener("error", callback);
            return true;
        }
        removeErrorEventListener(callback) {
            if (typeof this._worker === "undefined")
                return false;
            this._worker.removeEventListener("error", callback);
            return true;
        }
        terminate() {
            if (typeof this._worker === "undefined")
                return false;
            try {
                this._worker.terminate();
                return true;
            }
            catch (error) {
                return false;
            }
        }
    }
    exports.default = Webworker;
    function func_to_url(func) {
        let imp = func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
        let blob = new Blob([imp], { type: "text/javascript" });
        return URL.createObjectURL(blob);
    }
    exports.func_to_url = func_to_url;
});
