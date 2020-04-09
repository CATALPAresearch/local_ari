var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./cookie"], function (require, exports, cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cookie_1 = __importDefault(cookie_1);
    var Controller = /** @class */ (function () {
        function Controller(config) {
            this._config = config;
            //let sensor = new Sensor();
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            cookie_1.default.set("heinz", 12, tomorrow);
            console.log(cookie_1.default.getAll());
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
