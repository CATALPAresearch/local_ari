define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rules = exports.ETiming = exports.ERuleMethod = exports.EOperators = exports.EMoodleContext = void 0;
    ;
    var EMoodleContext;
    (function (EMoodleContext) {
        EMoodleContext[EMoodleContext["LOGIN_PAGE"] = 0] = "LOGIN_PAGE";
        EMoodleContext[EMoodleContext["HOME_PAGE"] = 1] = "HOME_PAGE";
        EMoodleContext[EMoodleContext["PROFILE_PAGE"] = 2] = "PROFILE_PAGE";
        EMoodleContext[EMoodleContext["COURSE_PARTICIPANTS"] = 3] = "COURSE_PARTICIPANTS";
        EMoodleContext[EMoodleContext["COURSE_OVERVIEW_PAGE"] = 4] = "COURSE_OVERVIEW_PAGE";
        EMoodleContext["MOD_PAGE"] = "mod_page";
        EMoodleContext["MOD_ASSIGNMENT"] = "mod_assignment";
        EMoodleContext["MOD_NEWSMOD"] = "mod_newsmod";
        EMoodleContext["MOD_QUIZ"] = "mod_quiz";
        EMoodleContext["MOD_QUIZ_ATTEMPT"] = "mod_quiz_attempt";
        EMoodleContext["MOD_QUIZ_SUMMARY"] = "mod_quiz_summary";
        EMoodleContext["MOD_QUIZ_REVIEW"] = "mod_quiz_review";
        EMoodleContext["UNKNOWN"] = "unknown";
    })(EMoodleContext = exports.EMoodleContext || (exports.EMoodleContext = {}));
    var EOperators;
    (function (EOperators) {
        EOperators[EOperators["Smaller"] = 0] = "Smaller";
        EOperators[EOperators["Bigger"] = 1] = "Bigger";
        EOperators[EOperators["Equal"] = 2] = "Equal";
    })(EOperators = exports.EOperators || (exports.EOperators = {}));
    var ERuleMethod;
    (function (ERuleMethod) {
        ERuleMethod[ERuleMethod["Alert"] = 0] = "Alert";
        ERuleMethod[ERuleMethod["Modal"] = 1] = "Modal";
    })(ERuleMethod = exports.ERuleMethod || (exports.ERuleMethod = {}));
    var ETiming;
    (function (ETiming) {
        ETiming[ETiming["NOW"] = 0] = "NOW";
        ETiming[ETiming["WHEN_VISIBLE"] = 1] = "WHEN_VISIBLE";
        ETiming[ETiming["WHEN_IDLE"] = 2] = "WHEN_IDLE";
    })(ETiming = exports.ETiming || (exports.ETiming = {}));
    class Rules {
        constructor() {
            this.the_rules = [{
                    Condition: [{
                            context: 'semester_planing',
                            key: 'initial_view_ms_list',
                            value: 0,
                            operator: EOperators.Equal
                        }],
                    Action: {
                        method: ERuleMethod.Modal,
                        text: 'hello world x',
                        moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
                        viewport_selector: '#course-footer',
                        timing: ETiming.WHEN_VISIBLE,
                    }
                }];
        }
        getAll() {
            return this.the_rules;
        }
    }
    exports.Rules = Rules;
});
//# sourceMappingURL=../tsc/@maps/rules.js.map