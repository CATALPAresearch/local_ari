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
        count_active_milestones?: number;
        count_milestone_list_views?: number;
        body?: string;
        initial_edit_ms_list?: string;
        footer?: string;
    };
    longpage?: {};
    self_assessments?: {};
}
//# sourceMappingURL=../tsc/@maps/learner_model_manager.d.ts.map