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
    var PushNotifications = /** @class */ (function () {
        function PushNotifications(workerJSPath) {
            this._path = workerJSPath;
        }
        PushNotifications.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var worker;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof navigator !== "object" || typeof navigator.serviceWorker !== "object")
                                throw Error("Browser does not support service worker.");
                            if (!(typeof this._worker !== "object")) return [3 /*break*/, 3];
                            return [4 /*yield*/, navigator.serviceWorker.getRegistration(this._path)];
                        case 1:
                            worker = _a.sent();
                            if (!(typeof worker === "object")) return [3 /*break*/, 3];
                            this._worker = worker;
                            return [4 /*yield*/, this._worker.update()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Subscribe the user to get push notifications.
         * @important Must always be called from inside a short running user-generated event handler, such as click or keydown
         */
        PushNotifications.prototype.subscribe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (typeof navigator !== "object" || typeof navigator.serviceWorker !== "object")
                                throw Error("Browser does not support service worker.");
                            if (typeof window !== "object" || typeof window.PushManager !== "function")
                                throw Error("Browser does not support push.");
                            return [4 /*yield*/, this.requestPermission()];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, this.update()];
                        case 2:
                            _b.sent();
                            console.log(this._worker);
                            if (typeof this._worker === "object")
                                return [2 /*return*/];
                            _a = this;
                            return [4 /*yield*/, navigator.serviceWorker.register(this._path)];
                        case 3:
                            _a._worker = _b.sent();
                            if (typeof this._worker === "object")
                                return [2 /*return*/];
                            throw Error("Could not register worker");
                    }
                });
            });
        };
        PushNotifications.prototype.unsubscribe = function () {
            return __awaiter(this, void 0, void 0, function () {
                var del;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.update()];
                        case 1:
                            _a.sent();
                            if (!(typeof this._worker === "object")) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._worker.unregister()];
                        case 2:
                            del = _a.sent();
                            if (del)
                                return [2 /*return*/];
                            _a.label = 3;
                        case 3: throw Error("Could not unregister worker.");
                    }
                });
            });
        };
        /**
         * Request permission to send notifications.
         * @important Must always be called from inside a short running user-generated event handler, such as click or keydown
         */
        PushNotifications.prototype.requestPermission = function () {
            return __awaiter(this, void 0, void 0, function () {
                var permission;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof Notification === "object" || typeof Notification.requestPermission !== "function")
                                throw Error("Browser does not support notifications.");
                            if (Notification.permission === "granted")
                                return [2 /*return*/];
                            return [4 /*yield*/, Notification.requestPermission()];
                        case 1:
                            permission = _a.sent();
                            if (permission === "granted")
                                return [2 /*return*/];
                            throw Error("No permission");
                    }
                });
            });
        };
        PushNotifications.prototype.workerJavaScript = function () {
            console.log("working hard");
        };
        return PushNotifications;
    }());
    exports.default = PushNotifications;
});
