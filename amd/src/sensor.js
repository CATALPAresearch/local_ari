define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sensor = /** @class */ (function () {
        function Sensor() {
            this.startAmbilightDetection();
        }
        Sensor.prototype.startAmbilightDetection = function () {
            window.addEventListener("devicelight", function (event) {
                this.alert(event);
            });
        };
        return Sensor;
    }());
    exports.Sensor = Sensor;
});
