define(["require", "exports", "./messages"], function (require, exports, messages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *
     * @author Marc Burchart
     * @email marc.burchart@fernuni-hagen.de
     * @version 1.0
     * @description The controller handling the plugin and all features.
     *
     */
    var Controller = /** @class */ (function () {
        function Controller(config) {
            var test = new messages_1.SystemMessage({ message: "Dies ist mein Test" });
            test.run().then(function (resolve) {
                console.log(resolve);
            }, function (reject) {
                console.log(reject);
            });
        }
        return Controller;
    }());
    exports.default = Controller;
});
