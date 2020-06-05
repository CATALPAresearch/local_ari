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
    class Worker {
        constructor(scriptURL) {
            if (typeof scriptURL !== "string" || scriptURL.length <= 0)
                throw new Error("Invalid script path.");
            let http = new XMLHttpRequest();
            http.open('HEAD', scriptURL, false);
            http.send();
            if (http.status === 404)
                throw new Error("Script not found.");
        }
    }
    class ServiceWorker extends Worker {
        constructor(scriptURL) {
            super(scriptURL);
            if (!navigator || !navigator.serviceWorker || !navigator.serviceWorker.register)
                throw new Error("Browser does not support ServiceWorker.");
            if (location.protocol !== 'https:')
                throw new Error("ServiceWorker can only run with https.");
            this._path = scriptURL;
        }
        create(scope, error, stateChange) {
            return __awaiter(this, void 0, void 0, function* () {
                let registration = yield navigator.serviceWorker.register(this._path, { scope: scope });
                if (typeof registration !== "object")
                    throw new Error("Could not create ServiceWorker.");
                this._registration = registration;
                this._worker = this._getWorker(registration);
                if (error)
                    this._worker.onerror = error;
                if (stateChange)
                    this._worker.onstatechange = stateChange;
                return;
            });
        }
        register(error, stateChange) {
            return __awaiter(this, void 0, void 0, function* () {
                let registration = yield navigator.serviceWorker.getRegistration(this._path);
                if (typeof registration !== "object")
                    throw new Error("Could not register ServiceWorker.");
                this._registration = registration;
                this._worker = this._getWorker(registration);
                if (error)
                    this._worker.onerror = error;
                if (stateChange)
                    this._worker.onstatechange = stateChange;
                return;
            });
        }
        update() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof this._registration !== "object")
                    throw new Error("No registered ServiceWorker found.");
                yield this._registration.update();
                return;
            });
        }
        sendNotification(message, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof this._worker !== "object")
                    throw new Error("No ServiceWorker found.");
                yield Notification.requestPermission();
                console.log(Notification.permission);
                if (Notification.permission !== "granted")
                    throw new Error("No notification permission.");
                this._registration.showNotification(message, options);
                return;
            });
        }
        _getWorker(registration) {
            if (this._registration.installing) {
                return this._registration.installing;
            }
            else if (this._registration.waiting) {
                return this._registration.waiting;
            }
            else if (this._registration.active) {
                return this._registration.active;
            }
            throw new Error("No ServiceWorker found.");
        }
    }
    exports.ServiceWorker = ServiceWorker;
    class WebWorker extends Worker {
        constructor(scriptURL) {
            super(scriptURL);
        }
    }
    exports.WebWorker = WebWorker;
});
//# sourceMappingURL=core_worker.js.map