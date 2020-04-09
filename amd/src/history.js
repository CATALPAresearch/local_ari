/**
 *
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 *
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var History = /** @class */ (function () {
        function History() {
        }
        History.goForward = function (steps) {
            if (steps) {
                if (steps < 0)
                    steps = steps * (-1);
                window.history.go(steps);
            }
            else {
                history.forward();
            }
        };
        History.goBack = function (steps) {
            if (steps) {
                if (steps > 0)
                    steps = steps * (-1);
                window.history.go(steps);
            }
            else {
                history.back();
            }
        };
        return History;
    }());
    exports.History = History;
});
