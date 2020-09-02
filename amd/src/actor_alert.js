define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Alert = void 0;
    function Alert(message) {
        return new Promise((resolve) => {
            window.alert(message);
            return resolve();
        });
    }
    exports.Alert = Alert;
});
//# sourceMappingURL=../tsc/@maps/actor_alert.js.map