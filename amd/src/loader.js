var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    function init() {
        try {
            alert("marc");
            jquery_1.default(document).ready(function () {
                alert("yes");
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
