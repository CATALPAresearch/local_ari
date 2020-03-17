define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init() {
        try {
            alert("geklappt");
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
