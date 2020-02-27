/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./controller"], function (require, exports, controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    controller_1 = __importDefault(controller_1);
    function init() {
        try {
            new controller_1.default();
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
