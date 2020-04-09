var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./sensor"], function (require, exports, sensor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    sensor_1 = __importDefault(sensor_1);
    var Controller = /** @class */ (function () {
        function Controller(config) {
            this._config = config;
            //let sensor = new Sensor();
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            console.log(new sensor_1.default());
            /*let mod = <ICreateModal>{
                id: "mymodal",
                header: `<div class="modal-title">Mein Titel</div>`,
                hidden: false,
                position: EDOMPosition.prepend,
                selector: "body"
            }
            let modal = new CreateModal(mod);
            modal.run();*/
        }
        return Controller;
    }());
    exports.Controller = Controller;
});
