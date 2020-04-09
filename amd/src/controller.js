var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./push", "jquery"], function (require, exports, push_1, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    push_1 = __importDefault(push_1);
    jquery_1 = __importDefault(jquery_1);
    var Controller = /** @class */ (function () {
        function Controller(config, path) {
            this._config = config;
            this._path = path;
            //let sensor = new Sensor();    
            jquery_1.default("body").append("<button id=\"mytest\">Meintest</button>");
            var test = new push_1.default(this._path);
            jquery_1.default("#mytest").on("click", function () {
                test.subscribe().then(function (resolve) {
                    console.log("resolve");
                }, function (reject) {
                    console.log(reject);
                });
            });
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
