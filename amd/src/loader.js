/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init() {
        try {
            alert("Hier spielt die Musik!");
        }
        catch (error) {
            console.log(error);
        }
    }
    exports.init = init;
});
