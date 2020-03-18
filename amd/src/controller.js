define(["require", "exports", "./styles"], function (require, exports, styles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function () {
        function Controller(config) {
            this._config = config;
            var mod = {
                id: "mymodal",
                header: "<div class=\"modal-title\">Mein Titel</div>",
                hidden: false,
                position: styles_1.EModalPosition.prepend,
                selector: "body"
            };
            var modal = new styles_1.Modal(mod);
            modal.run();
            console.log("done");
        }
        return Controller;
    }());
    exports.Controller = Controller;
});
