var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jquery", "./styles"], function (require, exports, jquery_1, styles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    function init() {
        try {
            jquery_1.default(document).ready(function () {
                var data = { selector: "body", properties: { "background-color": "red" } };
                var css = new styles_1.CSS(data);
                alert(css.validate());
                css.run();
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
