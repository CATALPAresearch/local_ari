define(["require", "exports", "./core_modal"], function (require, exports, core_modal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor() {
            try {
                let modalConfig = {
                    id: "myfield",
                    content: {
                        body: "<p>Hier könnte Deine Werbung stehen</p>",
                        footer: "<p>Das ist der Footer</p>"
                    },
                    options: {
                        centerVertically: true,
                        show: true,
                        focus: true,
                        keyboard: true,
                        backdrop: true,
                        animate: true,
                        size: core_modal_1.EModalSize.small,
                        showCloseButton: true
                    }
                };
                console.log("lets go");
                let modal = new core_modal_1.Modal(modalConfig);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    exports.Controller = Controller;
});
//# sourceMappingURL=controller.js.map