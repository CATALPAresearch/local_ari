define(["require", "exports", "./controller", "./config"], function (require, exports, controller_1, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init() {
        try {
            new controller_1.Controller(config_1.Config);
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
