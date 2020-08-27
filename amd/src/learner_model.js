define(["require", "exports", "./core_modal", "./sensor_viewport"], function (require, exports, core_modal_1, sensor_viewport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ETiming = exports.ERuleMethod = exports.EOperators = exports.EMoodleContext = exports.LearnerModelManager = void 0;
    class LearnerModelManager {
        constructor() {
            this.checkRules();
        }
        checkRules() {
            new RuleManager(LearnerModelManager.model);
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
    class RuleManager {
        constructor(lm) {
            this.rules = [];
            this.example_rules = [{
                    Condition: [{
                            context: 'semester_planing',
                            key: 'initial_view_ms_list',
                            value: 0,
                            operator: EOperators.Equal
                        }],
                    Action: {
                        method: ERuleMethod.Modal,
                        text: 'hello world',
                        moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
                        viewport_selector: 'img.atto_image_button_text-bottom'
                    }
                }];
            this.lm = lm;
            this.actionQueue = [];
            this.moodleContext = this._determineMoodleContext();
            this.moodleInstanceID = this._determineURLParameters('id');
            console.log(this.moodleContext, this.moodleInstanceID);
            this.rules = this.example_rules;
            this._checkRules();
        }
        _determineMoodleContext() {
            let path = window.location.pathname;
            path = path.replace('/moodle', '');
            switch (path) {
                case "/login/index.php": return EMoodleContext.LOGIN_PAGE;
                case "/": return EMoodleContext.HOME_PAGE;
                case "/user/profile.php": return EMoodleContext.PROFILE_PAGE;
                case "/user/index.php": return EMoodleContext.COURSE_PARTICIPANTS;
                case "/course/view.php": return EMoodleContext.COURSE_OVERVIEW_PAGE;
                case "/mod/page/view.php": return EMoodleContext.MOD_PAGE;
                case "/mod/assign/view.php": return EMoodleContext.MOD_ASSIGNMENT;
                case "/mod/newsmod/view.php": return EMoodleContext.MOD_NEWSMOD;
                case "/mod/quiz/view.php": return EMoodleContext.MOD_QUIZ;
                case "/mod/quiz/attempt.php": return EMoodleContext.MOD_QUIZ_ATTEMPT;
                case "/mod/quiz/summary.php": return EMoodleContext.MOD_QUIZ_SUMMARY;
                case "/mod/quiz/review.php": return EMoodleContext.MOD_QUIZ_REVIEW;
            }
            return EMoodleContext.UNKNOWN;
        }
        _determineURLParameters(param) {
            let parser = document.createElement('a');
            parser.href = window.location.href;
            var query = parser.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] === param) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return -1;
        }
        _checkRules() {
            let tmp;
            for (var i = 0; i < this.rules.length; i++) {
                tmp = this.rules[i];
                if (this.evaluateConditions(tmp.Condition)) {
                    this._addToActionQueue(tmp.Action);
                }
            }
        }
        getLearnerModelKey(context, key) {
            if (key === undefined) {
                return false;
            }
            return this.lm[context][key];
        }
        evaluateConditions(cons) {
            let result = true;
            for (var i = 0; i < cons.length; i++) {
                let condition = cons[i];
                switch (condition.operator) {
                    case EOperators.Equal:
                        result = result && this.getLearnerModelKey(condition.context, condition.key) === condition.value ? true : false;
                        break;
                    default:
                        result = false;
                }
            }
            return result;
        }
        _addToActionQueue(action) {
            this.actionQueue.push(action);
            this._processActionQueue();
        }
        _processActionQueue() {
            let _this = this;
            let localActions = this.actionQueue.filter(function (d) {
                return d.moodle_context === _this.moodleContext;
            });
            for (var i = 0; i < localActions.length; i++) {
                if (localActions[i].viewport_selector !== undefined) {
                    let test = new sensor_viewport_1.DOMVPTracker(localActions[i].viewport_selector);
                    test.get().then((resolve) => {
                        _this._executeAction(localActions[i]);
                        console.log(resolve);
                    });
                }
                else {
                    this._executeAction(localActions[i]);
                }
            }
        }
        _executeAction(tmp) {
            switch (tmp.method) {
                case ERuleMethod.Alert:
                    console.log('Execute ALERT', tmp.text);
                    break;
                case ERuleMethod.Modal:
                    this.initiateModal('Hinweis', tmp.text);
                    console.log('Execute MODAL', tmp.text);
                    break;
                default:
                    new Error('Undefined rule action executed.');
            }
        }
        initiateModal(title, message) {
            let config = {
                id: "myfield",
                content: {
                    header: "<h5 class=\"modal-title\" id=\"exampleModalLabel\">" + title + "</h5>",
                    body: "<p>" + message + "</p>",
                    footer: "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Jetzt nicht</button> \
            <button type=\"button\" class=\"btn btn-primary\">OK, habe verstanden</button>"
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
            new core_modal_1.Modal(config);
        }
    }
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
        ETiming[ETiming["ENTER_PAGE"] = 1] = "ENTER_PAGE";
        ETiming[ETiming["LOGIN"] = 2] = "LOGIN";
        ETiming[ETiming["WHEN_VISIBLE"] = 3] = "WHEN_VISIBLE";
        ETiming[ETiming["WHEN_IDLE"] = 4] = "WHEN_IDLE";
    })(ETiming = exports.ETiming || (exports.ETiming = {}));
});
//# sourceMappingURL=../tsc/@maps/learner_model.js.map