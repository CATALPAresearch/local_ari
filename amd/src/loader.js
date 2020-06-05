define(["require", "exports", "./controller"], function (require, exports, controller_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init(path) {
        try {
            new controller_1.Controller(path);
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
//# sourceMappingURL=../tsc/@maps/loader.js.map