define(["require", "exports", "./core_modal"], function (require, exports, core_modal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RuleMethod = exports.Operators = exports.LearnerModelManager = void 0;
    class LearnerModelManager {
        constructor() {
            this.lm = {
                userid: 101,
                semester_planing: {
                    initial_view_ms_list: 0
                }
            };
            this.checkRules(this.lm);
        }
        checkRules(lm) {
            new Rules(lm);
        }
        update() { }
    }
    exports.LearnerModelManager = LearnerModelManager;
    class Rules {
        constructor(lm) {
            this.lm = lm;
            let all_rules = [];
            all_rules.push({
                Condition: [{ context: 'semester_planing', key: 'initial_view_ms_list', value: 0, operator: Operators.Equal }],
                Action: { method: RuleMethod.Modal, text: 'hello world' }
            });
            let tmp;
            for (var i = 0; i < all_rules.length; i++) {
                tmp = all_rules[i];
                if (this.evaluateConditions(tmp.Condition)) {
                    switch (tmp.Action.method) {
                        case RuleMethod.Alert:
                            console.log(tmp.Action.text);
                            break;
                        case RuleMethod.Modal:
                            this.initiateModal('Hinweis', tmp.Action.text);
                            console.log('MODAL', tmp.Action.text);
                            break;
                        default:
                            console.error('Undefined rule action called');
                    }
                }
            }
        }
        getLearnerModelKey(context, key) {
            if (key === undefined) {
                return false;
            }
            return this.lm[context][key];
        }
        getProperty(o, propertyName) {
            return o[propertyName];
        }
        evaluateConditions(cons) {
            let result = true;
            for (var i = 0; i < cons.length; i++) {
                let condition = cons[i];
                switch (condition.operator) {
                    case Operators.Equal:
                        result = result && this.getLearnerModelKey(condition.context, condition.key) === condition.value ? true : false;
                        break;
                    default:
                        result = false;
                }
            }
            return result;
        }
        initiateModal(title, message) {
            let config = {
                id: "myfield",
                content: {
                    header: "<h5 class=\"modal-title\" id=\"exampleModalLabel\">" + title + "</h5>",
                    body: "<p>" + message + "</p>",
                    footer: "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button> \
            <button type=\"button\" class=\"btn btn-primary\">Save changes</button>"
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
    var Operators;
    (function (Operators) {
        Operators[Operators["Smaller"] = 0] = "Smaller";
        Operators[Operators["Bigger"] = 1] = "Bigger";
        Operators[Operators["Equal"] = 2] = "Equal";
    })(Operators = exports.Operators || (exports.Operators = {}));
    var RuleMethod;
    (function (RuleMethod) {
        RuleMethod[RuleMethod["Alert"] = 0] = "Alert";
        RuleMethod[RuleMethod["Modal"] = 1] = "Modal";
    })(RuleMethod = exports.RuleMethod || (exports.RuleMethod = {}));
});
//# sourceMappingURL=../tsc/@maps/learner_model.js.map