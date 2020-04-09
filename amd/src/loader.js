define(["require", "exports", "./controller", "./config"], function (require, exports, controller_1, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     * @author Marc Burchart
     * @version 1.0-20200409
     * @description xxx
     *
     */
    function init(path) {
        try {
            new controller_1.Controller(config_1.Config, path);
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
