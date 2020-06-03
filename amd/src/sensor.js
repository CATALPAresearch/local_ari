define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Sensor {
        constructor() {
            this.browser = {};
            this.screen = {};
            this.window = {};
            this.deviceOrientation = Sensor.deviceOrientation;
            this.os = navigator && navigator.userAgent ? navigator.userAgent : undefined;
            if (typeof sessionStorage === "object") {
                if (typeof sessionStorage.tabID === "undefined") {
                    let rand = Date.now() / 1000;
                    let pre = rand.toString(16).split(".").join("");
                    while (pre.length < 14) {
                        pre += "0";
                    }
                    let post = Math.round(Math.random() * 100000000);
                    sessionStorage.tabID = `${pre}.${post}`;
                }
                this.tabID = sessionStorage.tabID;
            }
            if (typeof navigator === "object") {
                if (navigator.appName)
                    this.browser.name = navigator.appName;
                if (navigator.appCodeName)
                    this.browser.codeName = navigator.appCodeName;
                if (navigator.appVersion)
                    this.browser.version = navigator.appVersion;
                if (typeof navigator.cookieEnabled === "boolean") {
                    if (navigator.cookieEnabled === true) {
                        this.browser.cookieEnabled = true;
                    }
                    else {
                        this.browser.cookieEnabled = false;
                    }
                }
                if (typeof navigator.javaEnabled === "function") {
                    this.browser.javaEnabled = navigator.javaEnabled();
                }
                if (navigator.doNotTrack) {
                    if (navigator.doNotTrack === "1") {
                        this.browser.doNotTrack = true;
                    }
                    else {
                        this.browser.doNotTrack = false;
                    }
                }
                if (navigator.language)
                    this.browser.language = navigator.language;
                if (navigator.languages)
                    this.browser.languages = JSON.parse(JSON.stringify(navigator.languages));
                if (typeof navigator.onLine === "boolean")
                    this.browser.online = navigator.onLine;
                if (navigator.platform)
                    this.browser.platform = navigator.platform;
                if (navigator.product)
                    this.browser.engine = navigator.product;
            }
            if (typeof screen === "object") {
                if (screen.width)
                    this.screen.width = screen.width;
                if (screen.height)
                    this.screen.height = screen.height;
                if (screen.availHeight)
                    this.screen.availHeight = screen.availHeight;
                if (screen.availWidth)
                    this.screen.availWidth = screen.availWidth;
                if (screen.pixelDepth)
                    this.screen.pixelDepth = screen.pixelDepth;
                if (screen.colorDepth)
                    this.screen.colorDepth = screen.colorDepth;
                this.screen.orientation = this.getOrientation();
            }
            if (typeof window === "object") {
                if (window.innerHeight)
                    this.window.innerHeight = window.innerHeight;
                if (window.innerWidth)
                    this.window.innerWidth = window.innerWidth;
                if (window.outerHeight)
                    this.window.outerHeight = window.outerHeight;
                if (window.outerWidth)
                    this.window.outerWidth = window.outerWidth;
            }
        }
        getOrientation() {
            if (window.matchMedia("(orientation: portrait)").matches)
                return EOrientation.portrait;
            if (window.matchMedia("(orientation: landscape)").matches)
                return EOrientation.landscape;
            if (screen.orientation) {
                let orientation = screen.orientation.type;
                if (orientation.indexOf("portrait") !== -1)
                    return EOrientation.portrait;
                if (orientation.indexOf("landscape") !== -1)
                    return EOrientation.landscape;
            }
            if (typeof window !== "object" || typeof window.innerHeight !== "number" || typeof window.innerWidth)
                return EOrientation.undefined;
            if (window.innerHeight > window.innerWidth || (typeof window.orientation === "number" && (window.orientation === 0 || window.orientation === -180)))
                return EOrientation.portrait;
            if (window.innerWidth > window.innerHeight || (typeof window.orientation === "number" && (window.orientation === 90 || window.orientation === -90)))
                return EOrientation.landscape;
            return EOrientation.undefined;
        }
        getGeolocation() {
            if (navigator && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === "function") {
                return Promise.reject(new Error("Browser does not support Geolocation."));
            }
            let _this = this;
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((coords) => {
                    if (typeof coords.coords === "object") {
                        _this.geolocation = coords.coords;
                        return resolve();
                    }
                    return reject(new Error("Could not get Coordinates."));
                });
            });
        }
        startDeviceOrientationTracking() {
            if (typeof window !== "object" || typeof window.DeviceOrientationEvent === "undefined")
                return Promise.reject("Browser does not support device orientation.");
            Sensor.deviceOrientationFunction = (event) => {
                Sensor.deviceOrientation.azimuth = event.alpha;
                Sensor.deviceOrientation.pitch = event.beta;
                Sensor.deviceOrientation.roll = event.gamma;
            };
            window.addEventListener("deviceorientation", Sensor.deviceOrientationFunction);
            return;
        }
        stopDeviceOrientationTracking() {
            if (typeof Sensor.deviceOrientationFunction === "function" && typeof window === "object")
                window.removeEventListener("deviceorientation", Sensor.deviceOrientationFunction);
            return true;
        }
    }
    exports.default = Sensor;
    Sensor.deviceOrientation = {};
    var EOrientation;
    (function (EOrientation) {
        EOrientation[EOrientation["landscape"] = 0] = "landscape";
        EOrientation[EOrientation["portrait"] = 1] = "portrait";
        EOrientation[EOrientation["undefined"] = 2] = "undefined";
    })(EOrientation = exports.EOrientation || (exports.EOrientation = {}));
});
