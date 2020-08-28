define(["require", "exports", "./rule_manager"], function (require, exports, rule_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LearnerModelManager = void 0;
    class LearnerModelManager {
        constructor() {
            this.checkRules();
        }
        checkRules() {
            new rule_manager_1.RuleManager(LearnerModelManager.model);
        }
        update() { }
    }
    exports.LearnerModelManager = LearnerModelManager;
    LearnerModelManager.model = {
        userid: 101,
        semester_planing: {
            initial_view_ms_list: 0
        }
    };
});
//# sourceMappingURL=../tsc/@maps/learner_model_manager.js.map