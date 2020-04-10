var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./serviceworker", "jquery"], function (require, exports, serviceworker_1, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    serviceworker_1 = __importDefault(serviceworker_1);
    jquery_1 = __importDefault(jquery_1);
    var Controller = /** @class */ (function () {
        function Controller(config, path) {
            this._config = config;
            this._path = path;
            //let sensor = new Sensor();    
            jquery_1.default("body").append("<button id=\"mytest\">Meintest</button>");
            var sw = new serviceworker_1.default("https://127.0.0.1/moodle/local/ari/lib/worker.js");
            sw.update();
            jquery_1.default("#mytest").on("click", function () {
                sw.create().then(function (resolve) {
                    console.log("Resolve");
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
