var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    var Toolbox = /** @class */ (function () {
        function Toolbox() {
        }
        Toolbox.highlight = function () {
            jquery_1.default(document).ready(function () {
                jquery_1.default("h1").css("background-color", "yellow");
            });
        };
        return Toolbox;
    }());
    exports.Toolbox = Toolbox;
});
