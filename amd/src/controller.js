define(["require", "exports", "./sensor"], function (require, exports, sensor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function () {
        function Controller(config) {
            this._config = config;
            var sensor = new sensor_1.Sensor();
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
