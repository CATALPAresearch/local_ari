/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./tool_chatbot", "./ari_config", "./tool_activityindicator"], function (require, exports, tool_chatbot_1, ari_config_1, tool_activityindicator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    tool_chatbot_1 = __importDefault(tool_chatbot_1);
    tool_activityindicator_1 = __importDefault(tool_activityindicator_1);
    var Controller = /** @class */ (function () {
        function Controller() {
            this._config = ari_config_1.Config;
            console.log("=== CONTROLLER ===");
            new tool_activityindicator_1.default({});
            this._chatbot = new tool_chatbot_1.default(this._config.chatbot);
        }
        Controller.prototype.chatbot = function () { };
        return Controller;
    }());
    exports.default = Controller;
});
