export declare class Rules {
    rule_z3: IRule;
    rule_z4: IRule;
    rule_z5: IRule;
    rule_z6: IRule;
    rule_: IRule;
    the_rules: IRule[];
    constructor();
    getAll(): IRule[];
    consistencyCheck(): Boolean;
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
    method: ERuleActor;
    text: string;
    moodle_context: EMoodleContext;
    moodle_course?: number;
    dom_selector?: string;
    viewport_selector?: string;
    timing?: ETiming;
    delay?: number;
    priority?: number;
    repetitions: number;
}
export declare enum EMoodleContext {
    LOGIN_PAGE = 0,
    HOME_PAGE = 1,
    PROFILE_PAGE = 2,
    COURSE_PARTICIPANTS = 3,
    COURSE_OVERVIEW_PAGE = 4,
    MOD_PAGE = "mod_page",
    MOD_ASSIGNMENT = "mod_assignment",
    MOD_NEWSMOD = "mod_newsmod",
    MOD_QUIZ = "mod_quiz",
    MOD_QUIZ_ATTEMPT = "mod_quiz_attempt",
    MOD_QUIZ_SUMMARY = "mod_quiz_summary",
    MOD_QUIZ_REVIEW = "mod_quiz_review",
    UNKNOWN = "unknown"
}
export declare enum EOperators {
    Smaller = 0,
    Greater = 1,
    Equal = 2,
    Contains = 3,
    Similar = 4,
    Has = 5
}
export declare enum ERuleActor {
    Alert = 0,
    Prompt = 1,
    Confirm = 2,
    Style = 3,
    Modal = 4
}
export declare enum ETiming {
    NOW = 0,
    WHEN_VISIBLE = 1,
    WHEN_IDLE = 2
}
//# sourceMappingURL=../../../@maps/src/tsc/rules.d.ts.map