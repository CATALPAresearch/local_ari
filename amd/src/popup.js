define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Popup {
        static alert(text) {
            return new Promise((resolve, reject) => {
                window.alert(text);
                return resolve();
            });
        }
        static confirm(text) {
            return new Promise((resolve, reject) => {
                window.confirm(text);
                return resolve();
            });
        }
        static prompt(text, defaultAnswer) {
            return new Promise((resolve, reject) => {
                let response = window.prompt(text, defaultAnswer);
                return resolve(response);
            });
        }
    }
    exports.Popup = Popup;
});
