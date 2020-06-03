var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SW {
        constructor(path, onError) {
            this._state = EServiceWorkerState.undefined;
            this._path = path;
            this._onError = onError;
        }
        static supported() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!navigator || !navigator.serviceWorker || !navigator.serviceWorker.register)
                    throw Error("Browser does not support service worker.");
                if (location.protocol !== 'https:')
                    throw Error("Service Worker can only run with https.");
                return;
            });
        }
        register() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof this._path !== "string" || this._path.length <= 0)
                    throw Error("No valid path to javascript file.");
                var http = new XMLHttpRequest();
                http.open('HEAD', this._path, false);
                http.send();
                if (http.status !== 404)
                    throw Error("Javascript file for worker not found.");
                yield SW.supported();
                if (typeof this._registration === "object")
                    return;
                let worker = yield navigator.serviceWorker.getRegistration(this._path);
                if (typeof worker !== "object")
                    throw Error("Could not find the registration of the service worker.");
                this._registration = worker;
                yield this._getServiceWorker();
                return;
            });
        }
        create() {
            return __awaiter(this, void 0, void 0, function* () {
                yield SW.supported();
                if (typeof this._registration === "object")
                    return;
                let worker = yield navigator.serviceWorker.getRegistration(this._path);
                if (typeof worker === "object") {
                    this._registration = worker;
                    return;
                }
                this._registration = yield navigator.serviceWorker.register(this._path);
                if (typeof this._registration !== "object")
                    throw new Error("Could not connect to the service worker.");
                yield this._getServiceWorker();
                return;
            });
        }
        unregister() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.register();
                if (typeof this._worker === "object")
                    delete this._worker;
                yield this._registration.unregister();
                delete this._registration;
                return;
            });
        }
        update() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.register();
                yield this._registration.update();
                return;
            });
        }
        _setState() {
            if (this._registration.installing) {
                this._state = EServiceWorkerState.installing;
                return;
            }
            else if (this._registration.waiting) {
                this._state = EServiceWorkerState.waiting;
                return;
            }
            else if (this._registration.active) {
                this._state = EServiceWorkerState.active;
                return;
            }
            this._state = EServiceWorkerState.undefined;
            return;
        }
        getState() {
            return this._state;
        }
        _getServiceWorker() {
            return __awaiter(this, void 0, void 0, function* () {
                let _this = this;
                let onStateChange = function () {
                    if (_this._registration.installing) {
                        _this._state = EServiceWorkerState.installing;
                        return;
                    }
                    else if (_this._registration.waiting) {
                        _this._state = EServiceWorkerState.waiting;
                        return;
                    }
                    else if (_this._registration.active) {
                        _this._state = EServiceWorkerState.active;
                        return;
                    }
                    _this._state = EServiceWorkerState.undefined;
                    return;
                };
                if (this._registration.installing) {
                    this._worker = this._registration.installing;
                    if (this._onError)
                        this._worker.addEventListener("error", this._onError);
                    this._worker.addEventListener("statechange", onStateChange);
                    this._setState();
                    return;
                }
                else if (this._registration.waiting) {
                    this._worker = this._registration.waiting;
                    if (this._onError)
                        this._worker.addEventListener("error", this._onError);
                    this._worker.addEventListener("statechange", onStateChange);
                    this._setState();
                    return;
                }
                else if (this._registration.active) {
                    this._worker = this._registration.active;
                    if (this._onError)
                        this._worker.addEventListener("error", this._onError);
                    this._worker.addEventListener("statechange", onStateChange);
                    this._setState();
                    return;
                }
                throw Error("Could not find the service worker of the registration.");
            });
        }
        sendMessage(message, transfer) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof message !== "string" || message.length <= 0)
                    throw Error("Please enter a valid message.");
                yield this.register();
                this._worker.postMessage(message, transfer);
                return;
            });
        }
        addListener(event, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof callback !== "function")
                    throw Error("Callback is not a function.");
                if (typeof event !== "string" || event.length <= 0)
                    throw Error("Please enter a valid event name.");
                yield this.register();
                this._worker.addEventListener(event, callback);
                return;
            });
        }
        removeListener(event, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof callback !== "function")
                    throw Error("Callback is not a function.");
                if (typeof event !== "string" || event.length <= 0)
                    throw Error("Please enter a valid event name.");
                yield this.register();
                this._worker.removeEventListener(event, callback);
                return;
            });
        }
    }
    exports.default = SW;
    var EServiceWorkerState;
    (function (EServiceWorkerState) {
        EServiceWorkerState[EServiceWorkerState["installing"] = 0] = "installing";
        EServiceWorkerState[EServiceWorkerState["waiting"] = 1] = "waiting";
        EServiceWorkerState[EServiceWorkerState["active"] = 2] = "active";
        EServiceWorkerState[EServiceWorkerState["undefined"] = 3] = "undefined";
    })(EServiceWorkerState = exports.EServiceWorkerState || (exports.EServiceWorkerState = {}));
});
