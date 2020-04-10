/**
 *
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A service worker is a JavaScript running in the background, without affecting the performance of the page.
 *
 * Service Workers can intercept requests and replace them with items from their own cache, thus they behave like a proxy server.
 * They offer offline capabilities to web applications. They can be used across multiple tabs and even continue to be alive when all tabs are closed.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SW = /** @class */ (function () {
        function SW(path, onError) {
            this._state = EServiceWorkerState.undefined;
            this._path = path;
            this._onError = onError;
        }
        SW.supported = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!navigator || !navigator.serviceWorker || !navigator.serviceWorker.register)
                        throw Error("Browser does not support service worker.");
                    if (location.protocol !== 'https:')
                        throw Error("Service Worker can only run with https.");
                    return [2 /*return*/];
                });
            });
        };
        SW.prototype.register = function () {
            return __awaiter(this, void 0, void 0, function () {
                var http, worker;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof this._path !== "string" || this._path.length <= 0)
                                throw Error("No valid path to javascript file.");
                            http = new XMLHttpRequest();
                            http.open('HEAD', this._path, false);
                            http.send();
                            if (http.status !== 404)
                                throw Error("Javascript file for worker not found.");
                            return [4 /*yield*/, SW.supported()];
                        case 1:
                            _a.sent();
                            if (typeof this._registration === "object")
                                return [2 /*return*/];
                            return [4 /*yield*/, navigator.serviceWorker.getRegistration(this._path)];
                        case 2:
                            worker = _a.sent();
                            if (typeof worker !== "object")
                                throw Error("Could not find the registration of the service worker.");
                            this._registration = worker;
                            return [4 /*yield*/, this._getServiceWorker()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SW.prototype.create = function () {
            return __awaiter(this, void 0, void 0, function () {
                var worker, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, SW.supported()];
                        case 1:
                            _b.sent();
                            if (typeof this._registration === "object")
                                return [2 /*return*/];
                            return [4 /*yield*/, navigator.serviceWorker.getRegistration(this._path)];
                        case 2:
                            worker = _b.sent();
                            if (typeof worker === "object") {
                                this._registration = worker;
                                return [2 /*return*/];
                            }
                            _a = this;
                            return [4 /*yield*/, navigator.serviceWorker.register(this._path)];
                        case 3:
                            _a._registration = _b.sent();
                            if (typeof this._registration !== "object")
                                throw new Error("Could not connect to the service worker.");
                            return [4 /*yield*/, this._getServiceWorker()];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SW.prototype.unregister = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.register()];
                        case 1:
                            _a.sent();
                            if (typeof this._worker === "object")
                                delete this._worker;
                            return [4 /*yield*/, this._registration.unregister()];
                        case 2:
                            _a.sent();
                            delete this._registration;
                            return [2 /*return*/];
                    }
                });
            });
        };
        SW.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.register()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this._registration.update()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SW.prototype._getState = function () {
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
        };
        SW.prototype.state = function () {
            return this._state;
        };
        SW.prototype._getServiceWorker = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this, onStateChange;
                return __generator(this, function (_a) {
                    _this = this;
                    onStateChange = function () {
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
                        this._getState();
                        return [2 /*return*/];
                    }
                    else if (this._registration.waiting) {
                        this._worker = this._registration.waiting;
                        if (this._onError)
                            this._worker.addEventListener("error", this._onError);
                        this._worker.addEventListener("statechange", onStateChange);
                        this._getState();
                        return [2 /*return*/];
                    }
                    else if (this._registration.active) {
                        this._worker = this._registration.active;
                        if (this._onError)
                            this._worker.addEventListener("error", this._onError);
                        this._worker.addEventListener("statechange", onStateChange);
                        this._getState();
                        return [2 /*return*/];
                    }
                    throw Error("Could not find the service worker of the registration.");
                });
            });
        };
        SW.prototype.sendMessage = function (message, transfer) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof message !== "string" || message.length <= 0)
                                throw Error("Please enter a valid message.");
                            return [4 /*yield*/, this.register()];
                        case 1:
                            _a.sent();
                            this._worker.postMessage(message, transfer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Register a listener for the worker. Use "message" to receive a message send from the worker.
         * @param event The event name.
         * @param callback The callback for the event.
         *
         */
        SW.prototype.addListener = function (event, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof callback !== "function")
                                throw Error("Callback is not a function.");
                            if (typeof event !== "string" || event.length <= 0)
                                throw Error("Please enter a valid event name.");
                            return [4 /*yield*/, this.register()];
                        case 1:
                            _a.sent();
                            this._worker.addEventListener(event, callback);
                            return [2 /*return*/];
                    }
                });
            });
        };
        SW.prototype.removeListener = function (event, callback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof callback !== "function")
                                throw Error("Callback is not a function.");
                            if (typeof event !== "string" || event.length <= 0)
                                throw Error("Please enter a valid event name.");
                            return [4 /*yield*/, this.register()];
                        case 1:
                            _a.sent();
                            this._worker.removeEventListener(event, callback);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SW;
    }());
    exports.default = SW;
    var EServiceWorkerState;
    (function (EServiceWorkerState) {
        EServiceWorkerState[EServiceWorkerState["installing"] = 0] = "installing";
        EServiceWorkerState[EServiceWorkerState["waiting"] = 1] = "waiting";
        EServiceWorkerState[EServiceWorkerState["active"] = 2] = "active";
        EServiceWorkerState[EServiceWorkerState["undefined"] = 3] = "undefined";
    })(EServiceWorkerState = exports.EServiceWorkerState || (exports.EServiceWorkerState = {}));
});
