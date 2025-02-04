export declare class Rules {
    course_id: number;
    the_rules: IRule[];
    constructor(course_id: number);
    getAll(): IRule[];
    loadRules(): Promise<void>;
    loadTestingRules(): void;
    ruleConsistencyCheck(): Boolean;
    modelConsistencyCheck(): Boolean;
}
export interface IRule {
    id: number;
    title: string;
    course_id?: number;
    is_active: boolean;
    is_per_section_rule?: boolean;
    Condition: IRuleCondition[];
    Action: IRuleAction[];
}
export interface IRuleCondition {
    id?: number;
    source_context: string;
    key: string;
    value: number;
    operator: EOperators;
}
export interface IRuleAction {
    id: number;
    actor: ERuleActor;
    type: EActionType;
    category: EActionCategory;
    section: string;
    action_title: string;
    action_text: string;
    augmentations?: EActionAugmentation[];
    target_context: ETargetContext;
    moodle_course?: number;
    dom_content_selector?: string;
    dom_indicator_selector?: string;
    viewport_selector?: string;
    timing?: ETiming;
    delay?: number;
    priority?: number;
    repetitions: number;
}
export declare enum EActionType {
    SCOPE_COURSE = "scope_course",
    SCOME_COURSE_UNIT = "scope_course_unit",
    SCOPE_ACTIVITY_TYPE = "scope_activity_type",
    SCOPE_ACTIVITY = "scope_activity",
    NEXT_STEP = "next_step"
}
export declare enum EActionCategory {
    UNSPECIFIED = "unspecified",
    TIME_MANAGEMENT = "time_management",
    PROGRESS = "progress",
    SUCCESS = "success",
    SOCIAL = "social",
    COMPETENCY = "competency"
}
export declare enum EActionAugmentation {
    USER_DATA = "user_data",
    LEARNER_MODEL = "learner_model",
    RELATED_RESOURCE = "related_resource",
    NEXT_STEP = "next_step",
    LLM_PROMPT = "LLM_prompt",
    REFLECTION_TASK = "reflection task"
}
export declare enum ESourceContext {
    MOD_PAGE = "mod_page",
    MOD_LONGPAGE = "mod_longpage",
    MOD_SAFRAN = "mod_safran",
    MOD_ASSIGNMENT = "mod_assign",
    MOD_NEWSMOD = "mod_usenet",
    MOD_HYPERVIDEO = "mod_hypervideo",
    MOD_QUIZ = "mod_quiz",
    MOD_QUESTIONNAIRE = "mod_questionnaire",
    USER = "user",
    COURSE_ENROLLMENT = "course_enrollment"
}
export declare enum ETargetContext {
    LOGIN_PAGE = "login_page",
    HOME_PAGE = "home_page",
    PROFILE_PAGE = "profile_page",
    COURSE_PARTICIPANTS = "course_participants",
    COURSE_OVERVIEW_PAGE = "course_overview_page",
    MOD_PAGE = "mod_page",
    MOD_LONGPAGE = "mod_longpage",
    MOD_SAFRAN = "mod_safran",
    MOD_ASSIGNMENT = "mod_assign",
    MOD_NEWSMOD = "mod_usenet",
    MOD_HYPERVIDEO = "mod_hypervideo",
    MOD_QUIZ = "mod_quiz",
    TEST = "local_ari",
    MOD_QUIZ_ATTEMPT = "mod_quiz_attempt",
    MOD_QUIZ_SUMMARY = "mod_quiz_summary",
    MOD_QUIZ_REVIEW = "mod_quiz_review",
    MOD_SAFRAN_REVIEW = "mod_safran_review",
    UNKNOWN = "action context unknown"
}
export declare enum EOperators {
    Equal = "==",
    Modolo = "%",
    Smaller = "<",
    SmallerEqual = "<=",
    Greater = ">",
    GreaterEqual = ">=",
    SumSmaller = "sum()<",
    SumRecursiveSmaller = "sumR()<",
    SumGreater = "sum()>",
    SumRecursiveGreater = "sumR()>",
    Contains = "contains",
    Similar = "similar",
    Has = "has",
    DaysDistanceSmallerThan = "days distance <",
    DaysDistanceGreaterThan = "days distance >"
}
export declare enum ERuleActor {
    Alert = "alert",
    Prompt = "prompt",
    Confirm = "confirm",
    Style = "style",
    Modal = "modal",
    HtmlPrompt = "htmlPrompt",
    StoredPrompt = "storedPrompt",
    DashboardCourse = "dashboard_course",
    DashboardCourseUnit = "dashboard_course_unit",
    DashboardActivity = "dashboard_activity"
}
export declare enum ETiming {
    UNSPECIFIED = "unspecified",
    NOW = "now",
    WHEN_VISIBLE = "when_visible",
    WHEN_IDLE = "when_idle"
}
//# sourceMappingURL=../../../@maps/src/tsc/rules.d.ts.map