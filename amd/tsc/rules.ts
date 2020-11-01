/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Load or define strictly defined Rules to be processed by the RuleManager
 *
 */

export class Rules {

    public rule_z3: IRule = {
        Condition: [
            {
                context: 'semester_planing',
                key: 'count_active_milestones',
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: 'count_milestone_list_views',
                value: 0,
                operator: EOperators.Equal
            }
        ],
        Action: {
            method: ERuleActor.Alert,
            text: 'Es wurde eine Meilensteinplanung angelegt. Bitte überprüfen Sie, ob diese Planung so für Sie passt.',
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
            delay: 1000, // miliseconds
            timing: ETiming.WHEN_IDLE,
            //viewport_selector: 'h3.sectionname',
            //viewport_selector: '.ms-headline',
            //timing: ETiming.WHEN_VISIBLE,
            repetitions: 1,
            /**
             *   NOW,
            WHEN_VISIBLE,
            WHEN_IDLE,
             */
        }
    };

    public rule_z4: IRule = {
        Condition: [
            {
                context: 'semester_planing',
                key: 'count_active_milestones',
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: 'count_milestone_list_views',
                value: 0,
                operator: EOperators.Equal
            },
            {
                context: 'semester_planing',
                key: 'milestone_start',
                value: (new Date()).getTime() - 3 * 24 * 3600 * 1000, // 3 days after today
                operator: EOperators.Greater
            },
        ],
        Action: {
            method: ERuleActor.Modal,
            text: 'hello world', // TODO: Haben Sie schon etwas von Ihrem Meilenstein erledigt? -> ja/ Meilentein ansehen; if "ja" -> Abhaken anbieten; if "Meilentein ansehen" ->  open >aktuellen MS<
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    public rule_z5: IRule = {
        Condition: [
            {
                context: 'semester_planing',
                key: 'count_active_milestones',
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: 'count_milestone_list_views',
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: 'milestone_start_date',
                value: (new Date()).getDate(),
                operator: EOperators.Equal
            }
        ],
        Action: {
            method: ERuleActor.Modal,
            text: 'Heute beginnt Ihr Meilenstein >>Name aktueller MS<<. Sie können diesen jederzeit anpassen.>>Link zum MS-Editor<< ',
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    public rule_z6: IRule = {
        Condition: [
            {
                context: 'semester_planing',
                key: 'count_active_milestones',
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: 'count_milestone_list_views',
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: 'milestone_start_date',
                value: (new Date()).getTime() - 4 * 24 * 3600 * 1000,
                operator: EOperators.Smaller
            },
            {
                context: 'semester_planing',
                key: 'milestone_start_date',
                value: (new Date()).getTime() - 3 * 24 * 3600 * 1000,
                operator: EOperators.Greater
            }
        ],
        Action: {
            method: ERuleActor.Modal,
            text: 'hello ', // TODO: Haben Sie schon etwas von Ihrem Meilenstein erledigt? -> ja/ Meilentein ansehen; if "ja" -> Abhaken anbieten; if "Meilentein ansehen" ->  open >aktuellen MS<
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    // template for rule formulation
    public rule_: IRule = {
        Condition: [
            {
                context: 'semester_planing',
                key: 'count_active_milestones',
                value: 0,
                operator: EOperators.Greater
            }
        ],
        Action: {
            method: ERuleActor.Modal,
            text: 'hello world',
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    // list of rules
    public the_rules: IRule[] = [
        this.rule_z3
    ];

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
    Greater,
    Equal,
    Contains,
    Similar,
    Has
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