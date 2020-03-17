/**
 *
 * @author Marc Burchart
 * @email marc.burchart@fernuni-hagen.de
 * @version 1.0
 * @description A class for basic communication.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "core/ajax"], function (require, exports, ajax_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ajax_1 = __importDefault(ajax_1);
    var Communication = /** @class */ (function () {
        function Communication() {
        }
        /**
         *
         * Communicate with moodle webservices
         * @param method The requested webservice method
         * @param param Parameter you want to send to the webservice.
         * @returns The received data | error
         *
         */
        Communication.webservice = function (method, param) {
            return new Promise(function (resolve, reject) {
                ajax_1.default.call([{
                        methodname: "local_ari_" + method,
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
        };
        return Communication;
    }());
    exports.default = Communication;
});
