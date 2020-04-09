define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sensor = /** @class */ (function () {
        function Sensor() {
        }
        Sensor.updateWindowData = function () {
            Sensor.window = {
                innerHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight : undefined,
                innerWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : undefined,
                outerHeight: window && window.outerHeight ? window.outerHeight : undefined,
                outerWidth: window && window.outerWidth ? window.outerWidth : undefined
            };
        };
        Sensor.startDeviceOrientationTracking = function () {
            if (typeof window !== "object" || typeof window.DeviceOrientationEvent === "undefined")
                return false;
            Sensor.deviceOrientationFunction = function (event) {
                Sensor.orientation = {
                    azimuth: event.gamma,
                    pitch: event.beta,
                    roll: event.alpha
                };
            };
            window.addEventListener("deviceorientation", this.deviceOrientationFunction);
            return true;
        };
        Sensor.stopDeviceOrientationTracking = function () {
            if (typeof Sensor.deviceOrientationFunction !== "function")
                return false;
            window.removeEventListener("deviceorientation", Sensor.deviceOrientationFunction);
            delete Sensor.deviceOrientationFunction;
            return true;
        };
        Sensor.getGeolocation = function (options) {
            if (typeof navigator !== "object" || typeof navigator.geolocation !== "object" || typeof navigator.geolocation.getCurrentPosition !== "function")
                Promise.reject(new Error("The browser does not support GeoLocation."));
            return new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    if (typeof position.coords !== "object")
                        return reject(new Error("Could not get the coords."));
                    return resolve(position.coords);
                }, function (error) {
                    return reject(error);
                }, options);
            });
        };
        Sensor.browser = {
            cookiesEnabled: navigator && navigator.cookieEnabled ? navigator.cookieEnabled : undefined,
            name: navigator && navigator.appName ? navigator.appName : undefined,
            codeName: navigator && navigator.appCodeName ? navigator.appCodeName : undefined,
            engine: navigator && navigator.product ? navigator.product : undefined,
            version: navigator && navigator.appVersion ? navigator.appVersion : undefined,
            language: navigator && navigator.language ? navigator.language : undefined,
            online: navigator && navigator.onLine ? navigator.onLine : undefined,
            javaEnabled: navigator && navigator.javaEnabled ? navigator.javaEnabled() : undefined,
            platform: navigator && navigator.platform ? navigator.platform : undefined
        };
        Sensor.location = window.location;
        Sensor.screen = screen;
        Sensor.os = navigator && navigator.userAgent ? navigator.userAgent : undefined;
        Sensor.window = {
            innerHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight : undefined,
            innerWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : undefined,
            outerHeight: window && window.outerHeight ? window.outerHeight : undefined,
            outerWidth: window && window.outerWidth ? window.outerWidth : undefined
        };
        return Sensor;
    }());
    exports.Sensor = Sensor;
    window.addEventListener("resize", Sensor.updateWindowData);
});
