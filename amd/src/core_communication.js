define(["require", "exports", "core/ajax", "./config"], function (require, exports, ajax_1, config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Communication {
        static webservice(method, param) {
            return new Promise((resolve, reject) => {
                ajax_1.default.call([{
                        methodname: config_1.Config.plugin.name + method,
                        args: param ? param : {},
                        timeout: 3000,
                        done: function (data) {
                            return resolve(data);
                        },
                        fail: function (error) {
                            return reject(error);
                        }
                    }]);
            });
        }
    }
    exports.default = Communication;
});
//# sourceMappingURL=../tsc/@maps/core_communication.js.map