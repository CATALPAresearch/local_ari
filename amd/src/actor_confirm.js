define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Confirm = void 0;
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
//# sourceMappingURL=../tsc/@maps/actor_confirm.js.map