export declare class LearnerModelManager {
    static model: ILearnerModel;
    constructor();
    checkRules(): void;
    update(): void;
}
export interface ILearnerModel {
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
export interface IRule {
    Condition: IRuleCondition[];
    Action: IRuleAction;
}
export interface IRuleCondition {
    context: string;
    key: string;
    value: number;
    operator: EOperators;
}
export interface IRuleAction {
    method: ERuleMethod;
    text: string;
    moodle_context: EMoodleContext;
    moodle_course?: number;
    timing?: ETiming;
    priority?: number;
    repeatitions?: number;
}
export declare enum EMoodleContext {
    LOGIN_PAGE = 0,
    HOME_PAGE = 1,
    PROFILE_PAGE = 2,
    COURSE_PARTICIPANTS = 3,
    COURSE_OVERVIEW_PAGE = 4,
    MOD_PAGE = 5,
    MOD_ASSIGNMENT = 6,
    MOD_NEWSMOD = 7,
    MOD_QUIZ = 8,
    UNKNOWN = 9
}
export declare enum EOperators {
    Smaller = 0,
    Bigger = 1,
    Equal = 2
}
export declare enum ERuleMethod {
    Alert = 0,
    Modal = 1
}
export declare enum ETiming {
    NOW = 0,
    ENTER_PAGE = 1,
    LOGIN = 2,
    WHEN_VISIBLE = 3,
    WHEN_IDLE = 4
}
//# sourceMappingURL=../tsc/@maps/learner_model.d.ts.map