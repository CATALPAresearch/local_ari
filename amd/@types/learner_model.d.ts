export declare class LearnerModelManager {
    lm: LearnerModel;
    constructor();
    checkRules(lm: LearnerModel): void;
    update(): void;
}
export interface LearnerModel {
    userid: number;
    semester_planing?: {
        initial_view_ms_list?: number;
        body?: string;
        initial_edit_ms_list?: string;
        footer?: string;
    };
    longpage?: {};
    self_assessments?: {};
}
export interface Rule {
    Condition: RuleCondition[];
    Action: RuleAction;
}
export interface RuleCondition {
    context: string;
    key: string;
    value: number;
    operator: Operators;
}
export declare enum Operators {
    Smaller = 0,
    Bigger = 1,
    Equal = 2
}
export interface RuleAction {
    method: RuleMethod;
    text: string;
}
export declare enum RuleMethod {
    Alert = 0
}
//# sourceMappingURL=../tsc/@maps/learner_model.d.ts.map