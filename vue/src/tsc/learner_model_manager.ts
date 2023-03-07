/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Load and synchronize the learner model from database and provide the information to the Rule Manager which executes the rules.
 *
 */

import { RuleManager } from './rule_manager';

//@ts-ignore
export class LearnerModelManager {
    public static model: ILearnerModel = {
        userid: 2,
        courseid: 2,
        quiz_activity: {
            count_attempts: 33,
            avg_attpempt_time_per_task: new Map<number, number>([[22, 4.3], [34, 20.4]]),
        },
    };

    constructor() {
       this.checkRules();
    };

    public checkRules(): void {
        new RuleManager(LearnerModelManager.model);
    };

    public update(): void { }
}


/*
Kurstext/Longpage
- Themenbezogener Lernstand
(wie der quantitative lernstand, nur bezogen auf ein Thema des Kurses (bspw. Prozesse))
- Ressourcenbezogener Lernstand
- gesehen / besuchte/gesehene Seiten/Abschnitte

Forum
◆ Wird im Forum gelesen oder auch geschrieben? (bspw.: read=true, write=false)

*/

export interface ILearnerModel {
    userid: number;
    courseid: number;
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
    assignment_activity?:{ 
        first_access?: Date;
        last_access?: Date;
        count_sessions?: number;
        time_spent?: Array<number>;
        submissions_per_instance?: Array<number>;
        scores?: Array<number>;
    };
    quiz_activity?:{ 
        first_access?: Date;
        last_access?: Date;
        count_sessions?: number;
        time_spent?: Array<number>;
        count_attempts?: Array<number>;
        count_unique_quizes?: number;
        count_unique_repeated_quizes?: number;
        count_attempts_per_quiz?: Array<number>;
        avg_attpempt_time_per_task?: Map<number,number>; 
        reattempt_delay?: Array<number>; // which reattempts? or is it the average?
        scores?: Array<number>;
    };
    safran_activity?:{
        first_access?: Date;
        last_access?: Date;
        count_sessions?: number;
        time_spent?: number;
    }; // course, user, utc, type, instance, action, value
    longpage_activity?: { // all measures as key-value list of longpage instance
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
    hypervideo_activity?:{}
    
}


