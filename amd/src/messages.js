var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "core/notification", "./communication"], function (require, exports, notification_1, communication_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Notification {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.message !== "string" || this._data.message.length <= 0)
                return false;
            if (typeof this._data.type !== "number" || !(this._data.type in ENotificationType))
                return false;
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let type = "error";
                switch (this._data.type) {
                    case ENotificationType.error:
                        type = "error";
                        break;
                    case ENotificationType.info:
                        type = "info";
                        break;
                    case ENotificationType.problem:
                        type = "problem";
                        break;
                    case ENotificationType.success:
                        type = "success";
                        break;
                    case ENotificationType.warning:
                        type = "warning";
                        break;
                }
                notification_1.default.addNotification({
                    message: this._data.message,
                    type: type
                });
                return;
            });
        }
    }
    exports.Notification = Notification;
    var ENotificationType;
    (function (ENotificationType) {
        ENotificationType[ENotificationType["error"] = 0] = "error";
        ENotificationType[ENotificationType["warning"] = 1] = "warning";
        ENotificationType[ENotificationType["info"] = 2] = "info";
        ENotificationType[ENotificationType["problem"] = 3] = "problem";
        ENotificationType[ENotificationType["success"] = 4] = "success";
    })(ENotificationType = exports.ENotificationType || (exports.ENotificationType = {}));
    class SystemMessage {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.subject !== "string" || this._data.subject.length <= 0)
                return false;
            if (typeof this._data.message !== "string" || this._data.message.length <= 0)
                return false;
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield communication_1.default.webservice('sendSystemMessage', { subject: this._data.subject, message: this._data.message });
                console.log(result);
                return;
            });
        }
    }
    exports.SystemMessage = SystemMessage;
    class ChatMessage {
        constructor(data) {
            this._data = data;
        }
        validate() {
            if (typeof this._data !== "object")
                return false;
            if (typeof this._data.message !== "string" || this._data.message.length <= 0)
                return false;
            return true;
        }
        run() {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield communication_1.default.webservice('sendChatMessage', { message: this._data.message });
                console.log(result);
                return;
            });
        }
    }
    exports.ChatMessage = ChatMessage;
});
