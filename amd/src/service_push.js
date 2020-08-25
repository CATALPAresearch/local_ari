define(["require", "exports", "./core_worker"], function (require, exports, core_worker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PushNotification = void 0;
    class PushNotification extends core_worker_1.ServiceWorker {
        constructor() {
            super(".");
        }
    }
    exports.PushNotification = PushNotification;
});
//# sourceMappingURL=../tsc/@maps/service_push.js.map