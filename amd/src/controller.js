define(["require", "exports", "./dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function () {
        function Controller(config) {
            this._config = config;
            var mod = {
                id: "mymodal",
                header: "<div class=\"modal-title\">Mein Titel</div>",
                hidden: false,
                position: dom_1.EDOMPosition.prepend,
                selector: "body"
            };
            var modal = new dom_1.CreateModal(mod);
            modal.run();
            console.log("done");
        }
        return Controller;
    }());
    exports.Controller = Controller;
});
