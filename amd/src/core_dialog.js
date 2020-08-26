define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Confirm = exports.Prompt = exports.Alert = void 0;
    function Alert(message) {
        return new Promise((resolve) => {
            window.alert(message);
            return resolve();
        });
    }
    exports.Alert = Alert;
    function Prompt(message, defAnswer) {
        return new Promise((resolve, reject) => {
            let result = window.prompt(message, defAnswer);
            if (result !== null) {
                return resolve(result);
            }
            return reject();
        });
    }
    exports.Prompt = Prompt;
    function Confirm(message) {
        return new Promise((resolve, reject) => {
            let result = window.confirm(message);
            if (typeof result === "boolean")
                return resolve(result);
            return reject();
        });
    }
    exports.Confirm = Confirm;
});
//# sourceMappingURL=../tsc/@maps/core_dialog.js.map