var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "core/notification"], function (require, exports, notification_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    notification_1 = __importDefault(notification_1);
    /**
     *
     * @author Marc Burchart
     * @version 1.0.0
     * @description This class handles moodle notifications.
     * @param message The message you want to send.
     * @param type The type of the notification (see INotificationType).
     *
     */
    var Notification = /** @class */ (function () {
        function Notification(message, type) {
            var nType = "";
            switch (type) {
                case INotificationType.error:
                    nType = "error";
                    break;
                case INotificationType.warning:
                    nType = "warning";
                    break;
                case INotificationType.info:
                    nType = "info";
                    break;
                case INotificationType.problem:
                    nType = "problem";
                    break;
                case INotificationType.success:
                    nType = "success";
                    break;
                default: nType = "error";
            }
            this._data = {
                message: message,
                type: nType
            };
        }
        /**
         *
         * Show the notification.
         *
         */
        Notification.prototype.show = function () {
            notification_1.default.addNotification(this._data);
        };
        return Notification;
    }());
    exports.Notification = Notification;
    /**
     *
     * The list of all notification types.
     *
     */
    var INotificationType;
    (function (INotificationType) {
        INotificationType[INotificationType["error"] = 0] = "error";
        INotificationType[INotificationType["warning"] = 1] = "warning";
        INotificationType[INotificationType["info"] = 2] = "info";
        INotificationType[INotificationType["problem"] = 3] = "problem";
        INotificationType[INotificationType["success"] = 4] = "success";
    })(INotificationType = exports.INotificationType || (exports.INotificationType = {}));
});
