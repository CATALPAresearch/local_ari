define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Prompt = void 0;
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
});
//# sourceMappingURL=../tsc/@maps/actor_prompt.js.map