define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor(config, path) {
            this._config = config;
            this._path = path;
            alert("marc");
        }
    }
    exports.Controller = Controller;
});
