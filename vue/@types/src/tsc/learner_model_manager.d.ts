export declare class LearnerModelManager {
    private wwwroot;
    private user_id;
    private course_id;
    static model: ILearnerModel;
    constructor(wwwroot: string, user_id: number, course_id: number);
    checkRules(): void;
    getLearnerModel(): void;
}
export interface ILearnerModel {
    debug: Array<string>;
    api_path: String;
    execution_time_utc: number;
    execution_time: string;
    user: {
        user_id: number;
        course_id: number;
        semester: string;
        semester_from: {
            date: Date;
            timezone_type: string;
            timezone: string;
        };
        semester_to: {
            date: Date;
            timezone_type: string;
            timezone: string;
        };
    };
    course?: {};
    mod_longpage?: {};
    mod_assign?: {};
    mod_quiz?: {};
    mod_safran?: {};
    mod_questionnaire?: {};
    mod_hypervideo?: {};
    format_serial3?: {};
    userid?: number;
    courseid?: number;
    course_activity?: {
        first_access?: Date;
        last_access?: Date;
        count_total_sessions?: number;
        total_time_spent?: Array<number>;
        ratio_active_days?: number;
        activity_sequence_last7days?: Array<string>;
        selected_goal?: string;
        course_unit_completion?: Map<number, number>;
        course_unit_success?: Map<number, number>;
    };
    assignment_activity?: {
        first_access?: Date;
        last_access?: Date;
        count_sessions?: number;
        time_spent?: Array<number>;
        submissions_per_instance?: Array<number>;
        scores?: Array<number>;
    };
    quiz_activity?: {
        first_access?: Date;
        last_access?: Date;
        count_sessions?: number;
        time_spent?: Array<number>;
        count_attempts?: Array<number>;
        count_unique_quizes?: number;
        count_unique_repeated_quizes?: number;
        count_attempts_per_quiz?: Array<number>;
        avg_attempt_time_per_task?: Map<number, number>;
        reattempt_delay?: Array<number>;
        scores?: Array<number>;
    };
    safran_activity?: {
        first_access?: Date;
        last_access?: Date;
        count_sessions?: number;
        time_spent?: number;
    };
    longpage_activity?: {
        first_access?: Array<number>;
        last_access?: Array<number>;
        count_sessions?: Array<number>;
        time_spent?: Array<number>;
        ratio_read_text?: Array<number>;
        count_opened_quizzes?: Array<number>;
        count_marks?: Array<number>;
        count_bookmarks?: Array<number>;
        count_public_comments?: Array<number>;
        count_private_comments?: Array<number>;
    };
    dashboard_activity?: {
        count_goal_changes?: number;
        count_reflection_attempts?: number;
        count_reflection_submissions?: number;
        count_bookmark_additions?: number;
    };
    hypervideo_activity?: {};
}
//# sourceMappingURL=../../../@maps/src/tsc/learner_model_manager.d.ts.map