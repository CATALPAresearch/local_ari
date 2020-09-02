define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sensor_idle = void 0;
    function sensor_idle(callback, action, idleTime) {
        idleTime = idleTime === undefined ? 3000 : idleTime;
        let timerID;
        window.addEventListener('load', resetTimer, true);
        var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(function (name) {
            document.addEventListener(name, resetTimer, true);
        });
        function resetTimer() {
            clearTimeout(timerID);
            timerID = setTimeout((() => {
                callback(action);
            }), idleTime);
        }
    }
    exports.sensor_idle = sensor_idle;
    ;
});
//# sourceMappingURL=../tsc/@maps/sensor_idle.js.map