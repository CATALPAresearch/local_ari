/**
 *
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Popup = /** @class */ (function () {
        function Popup() {
        }
        Popup.alert = function (text) {
            return new Promise(function (resolve, reject) {
                window.alert(text);
                return resolve();
            });
        };
        Popup.confirm = function (text) {
            return new Promise(function (resolve, reject) {
                window.confirm(text);
                return resolve();
            });
        };
        Popup.prompt = function (text, defaultAnswer) {
            return new Promise(function (resolve, reject) {
                var response = window.prompt(text, defaultAnswer);
                return resolve(response);
            });
        };
        return Popup;
    }());
    exports.Popup = Popup;
});
