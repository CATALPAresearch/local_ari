/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */
define(["require", "exports", "./toolbox"], function (require, exports, toolbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function () {
        function Controller() {
            alert("test");
            console.log("=== CONTROLLER ===");
            toolbox_1.Toolbox.highlight();
        }
        return Controller;
    }());
    exports.default = Controller;
});
