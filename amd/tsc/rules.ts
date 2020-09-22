/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Load or define strictly defined Rules to be processed by the RuleManager
 *
 */

export class Rules {
    public the_rules: IRule[] = [{
        Condition: [{
            context: 'semester_planing', // better EMoodleContext ??
            key: 'initial_view_ms_list',
            value: 0,
            operator: EOperators.Equal
        }],
        Action: {
            method: ERuleActor.Modal,
            text: 'hello world',
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,

            //delay: 3000, // miliseconds
            //timing: ETiming.WHEN_IDLE,

            //viewport_selector: 'h3.sectionname',
            viewport_selector: '#page-footer',
            timing: ETiming.WHEN_VISIBLE,

            repetitions: 1,
            /**
             *   NOW,
            WHEN_VISIBLE,
            WHEN_IDLE,
             */
        }
    }];

    constructor() {
        // TODO load from json file
    }

    public getAll(): IRule[] {
        return this.the_rules;
    }

    public consistencyCheck(): Boolean {
        // TODO
        return true;
    }
}


export interface IRule {
    Condition: IRuleCondition[];
    Action: IRuleAction; // todo: think about enabling multiple actions per rule
}
export interface IRuleCondition {
    context: string,
    key: string,
    value: number,
    operator: EOperators
};
export interface IRuleAction {
    method: ERuleActor,
    text: string,
    moodle_context: EMoodleContext,
    moodle_course?: number,
    viewport_selector?: string,
    timing?: ETiming,
    delay?: number,
    priority?: number,
    repetitions: number, // number of time the action should be repeated after being dismissed by the user
}
export enum EMoodleContext {
    LOGIN_PAGE,
    HOME_PAGE,
    PROFILE_PAGE,
    COURSE_PARTICIPANTS,
    COURSE_OVERVIEW_PAGE,
    MOD_PAGE = 'mod_page',
    MOD_ASSIGNMENT = 'mod_assignment',
    MOD_NEWSMOD = 'mod_newsmod',
    MOD_QUIZ = 'mod_quiz',
    MOD_QUIZ_ATTEMPT = 'mod_quiz_attempt',
    MOD_QUIZ_SUMMARY = 'mod_quiz_summary',
    MOD_QUIZ_REVIEW = 'mod_quiz_review',
    UNKNOWN = 'unknown'
}
export enum EOperators {
    Smaller,
    Bigger,
    Equal,
}
export enum ERuleActor {
    Alert,
    Prompt,
    Confirm,
    Style,
    Modal
}
export enum ETiming {
    NOW,
    WHEN_VISIBLE,
    WHEN_IDLE,
}