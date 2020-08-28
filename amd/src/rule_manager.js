define(["require", "exports", "./core_modal", "./core_helper", "./sensor_viewport", "./sensor_tab", "./sensor_idle"], function (require, exports, core_modal_1, core_helper_1, sensor_viewport_1, sensor_tab_1, sensor_idle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ETiming = exports.ERuleMethod = exports.EOperators = exports.EMoodleContext = exports.RuleManager = void 0;
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
                        text: 'hello world x',
                        moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
                        viewport_selector: '#course-footer',
                        timing: ETiming.WHEN_VISIBLE,
                    }
                }];
            this.lm = lm;
            this.actionQueue = [];
            this.moodleContext = this._determineMoodleContext();
            this.moodleInstanceID = this._determineURLParameters('id');
            this.browserTabID = sensor_tab_1.getTabID();
            console.log('current context:', this.moodleContext, this.moodleInstanceID, this.browserTabID);
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
            for (var i = 0; i < this.rules.length; i++) {
                if (this.evaluateConditions(this.rules[i].Condition)) {
                    this._addToActionQueue(this.rules[i].Action);
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
                if (localActions[i].timing === ETiming.WHEN_VISIBLE && localActions[i].viewport_selector !== undefined) {
                    new sensor_viewport_1.DOMVPTracker(localActions[i].viewport_selector, 0)
                        .get().then((resolve) => {
                        console.log('z217 ', resolve);
                    });
                }
                else if (localActions[i].timing === ETiming.WHEN_IDLE && localActions[i].delay !== undefined) {
                    sensor_idle_1.sensor_idle(RuleManager._executeAction, localActions[i], localActions[i].delay);
                }
                else {
                    RuleManager._executeAction(localActions[i]);
                }
            }
        }
        static _executeAction(tmp) {
            console.log('drinn');
            switch (tmp.method) {
                case ERuleMethod.Alert:
                    console.log('Execute ALERT', tmp.text);
                    break;
                case ERuleMethod.Modal:
                    console.log('Execute MODAL', tmp.text);
                    RuleManager.initiateModal('Hinweis', tmp.text);
                    break;
                default:
                    new Error('Undefined rule action executed.');
            }
        }
        static initiateModal(title, message) {
            let config = {
                id: "modal-" + core_helper_1.uniqid(),
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
    exports.RuleManager = RuleManager;
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
        ETiming[ETiming["PAGE_LOADED"] = 1] = "PAGE_LOADED";
        ETiming[ETiming["LOGGED_IN"] = 2] = "LOGGED_IN";
        ETiming[ETiming["WHEN_VISIBLE"] = 3] = "WHEN_VISIBLE";
        ETiming[ETiming["WHEN_IDLE"] = 4] = "WHEN_IDLE";
    })(ETiming = exports.ETiming || (exports.ETiming = {}));
});
//# sourceMappingURL=../tsc/@maps/rule_manager.js.map