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
    class PushNotifications {
        constructor(workerJSPath) {
            this._path = workerJSPath;
        }
        update() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof navigator !== "object" || typeof navigator.serviceWorker !== "object")
                    throw Error("Browser does not support service worker.");
                if (typeof this._worker !== "object") {
                    let worker = yield navigator.serviceWorker.getRegistration(this._path);
                    if (typeof worker === "object") {
                        this._worker = worker;
                        yield this._worker.update();
                    }
                }
            });
        }
        subscribe() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof navigator !== "object" || typeof navigator.serviceWorker !== "object")
                    throw Error("Browser does not support service worker.");
                if (typeof window !== "object" || typeof window.PushManager !== "function")
                    throw Error("Browser does not support push.");
                yield this.requestPermission();
                yield this.update();
                console.log(this._worker);
                if (typeof this._worker === "object")
                    return;
                this._worker = yield navigator.serviceWorker.register(this._path);
                if (typeof this._worker === "object")
                    return;
                throw Error("Could not register worker");
            });
        }
        unsubscribe() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.update();
                if (typeof this._worker === "object") {
                    let del = yield this._worker.unregister();
                    if (del)
                        return;
                }
                throw Error("Could not unregister worker.");
            });
        }
        requestPermission() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof Notification === "object" || typeof Notification.requestPermission !== "function")
                    throw Error("Browser does not support notifications.");
                if (Notification.permission === "granted")
                    return;
                let permission = yield Notification.requestPermission();
                if (permission === "granted")
                    return;
                throw Error("No permission");
            });
        }
        workerJavaScript() {
            console.log("working hard");
        }
    }
    exports.default = PushNotifications;
});
