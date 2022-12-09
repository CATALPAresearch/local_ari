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
    id: number;
    active: boolean;
    title: string;
    Condition: IRuleCondition[];
    Action: IRuleAction;
}
export interface IRuleCondition {
    context: string;
    key: EConditionKey;
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
    LOGIN_PAGE = "login page",
    HOME_PAGE = "home page",
    PROFILE_PAGE = "profile page",
    COURSE_PARTICIPANTS = "course participants",
    COURSE_OVERVIEW_PAGE = "course overview page",
    MOD_PAGE = "mod page",
    MOD_ASSIGNMENT = "mod assignment",
    MOD_NEWSMOD = "mod newsmod",
    MOD_QUIZ = "mod quiz",
    MOD_QUIZ_ATTEMPT = "mod quiz attempt",
    MOD_QUIZ_SUMMARY = "mod quiz summary",
    MOD_QUIZ_REVIEW = "mod quiz review",
    UNKNOWN = "unknown"
}
export declare enum EConditionCount {
    count_active_milestones = "count active milestones",
    count_milestone_list_views = "count milestone list views"
}
export declare enum EConditionDate {
    milestone_start_date = "milestone start date",
    milestone_start = "milestone start",
    milestone_end_date = "milestone end date"
}
export declare type EConditionKey = EConditionCount | EConditionDate;
export declare enum EOperators {
    Smaller = "<",
    Greater = ">",
    Equal = "==",
    Contains = "contains",
    Similar = "similar",
    Has = "has"
}
export declare enum ERuleActor {
    Alert = "alert",
    Prompt = "prompt",
    Confirm = "confirm",
    Style = "style",
    Modal = "modal"
}
export declare enum ETiming {
    NOW = "now",
    WHEN_VISIBLE = "when_visible",
    WHEN_IDLE = "when_idle"
}
//# sourceMappingURL=../../../@maps/src/tsc/rules.d.ts.map