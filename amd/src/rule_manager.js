define(["require", "exports", "./rules", "./core_modal", "./core_helper", "./sensor_viewport", "./sensor_tab", "./sensor_idle"], function (require, exports, rules_1, core_modal_1, core_helper_1, sensor_viewport_1, sensor_tab_1, sensor_idle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RuleManager = void 0;
    class RuleManager {
        constructor(lm) {
            this.rules = [];
            this.lm = lm;
            this.actionQueue = [];
            this.moodleContext = this._determineMoodleContext();
            this.moodleInstanceID = this._determineURLParameters('id');
            this.browserTabID = sensor_tab_1.getTabID();
            console.log('current context:', this.moodleContext, this.moodleInstanceID, this.browserTabID);
            this.rules = (new rules_1.Rules()).getAll();
            this._checkRules();
        }
        _determineMoodleContext() {
            let path = window.location.pathname;
            path = path.replace('/moodle', '');
            switch (path) {
                case "/login/index.php": return rules_1.EMoodleContext.LOGIN_PAGE;
                case "/": return rules_1.EMoodleContext.HOME_PAGE;
                case "/user/profile.php": return rules_1.EMoodleContext.PROFILE_PAGE;
                case "/user/index.php": return rules_1.EMoodleContext.COURSE_PARTICIPANTS;
                case "/course/view.php": return rules_1.EMoodleContext.COURSE_OVERVIEW_PAGE;
                case "/mod/page/view.php": return rules_1.EMoodleContext.MOD_PAGE;
                case "/mod/assign/view.php": return rules_1.EMoodleContext.MOD_ASSIGNMENT;
                case "/mod/newsmod/view.php": return rules_1.EMoodleContext.MOD_NEWSMOD;
                case "/mod/quiz/view.php": return rules_1.EMoodleContext.MOD_QUIZ;
                case "/mod/quiz/attempt.php": return rules_1.EMoodleContext.MOD_QUIZ_ATTEMPT;
                case "/mod/quiz/summary.php": return rules_1.EMoodleContext.MOD_QUIZ_SUMMARY;
                case "/mod/quiz/review.php": return rules_1.EMoodleContext.MOD_QUIZ_REVIEW;
            }
            return rules_1.EMoodleContext.UNKNOWN;
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
                    case rules_1.EOperators.Equal:
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
                if (localActions[i].timing === rules_1.ETiming.WHEN_VISIBLE && localActions[i].viewport_selector !== undefined) {
                    new sensor_viewport_1.DOMVPTracker(localActions[i].viewport_selector, 0)
                        .get().then((resolve) => {
                        console.log('z217 ', resolve);
                    });
                }
                else if (localActions[i].timing === rules_1.ETiming.WHEN_IDLE && localActions[i].delay !== undefined) {
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
                case rules_1.ERuleMethod.Alert:
                    console.log('Execute ALERT', tmp.text);
                    break;
                case rules_1.ERuleMethod.Modal:
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
});
//# sourceMappingURL=../tsc/@maps/rule_manager.js.map