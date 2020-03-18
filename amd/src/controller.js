define(["require", "exports", "./messages"], function (require, exports, messages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function () {
        function Controller(config) {
            this._config = config;
            var sm = new messages_1.SystemMessage({ subject: "Mein Subject", message: "Lets go!" });
            sm.run().then(function (resolve) {
                console.log(resolve);
            }, function (reject) {
                console.log(reject);
            });
        }
        return Controller;
    }());
    exports.Controller = Controller;
});
