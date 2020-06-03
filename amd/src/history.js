define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class History {
        static goForward(steps) {
            if (steps) {
                if (steps < 0)
                    steps = steps * (-1);
                window.history.go(steps);
            }
            else {
                history.forward();
            }
        }
        static goBack(steps) {
            if (steps) {
                if (steps > 0)
                    steps = steps * (-1);
                window.history.go(steps);
            }
            else {
                history.back();
            }
        }
    }
    exports.History = History;
});
