define(["require", "exports", "./learner_model_manager"], function (require, exports, learner_model_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    class Controller {
        constructor(wwwroot) {
            new learner_model_manager_1.LearnerModelManager();
            this.wwwroot = wwwroot;
            console.log(this.wwwroot);
        }
    }
    exports.Controller = Controller;
});
//# sourceMappingURL=../tsc/@maps/controller.js.map