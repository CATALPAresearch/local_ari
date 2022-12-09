/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Load or define strictly defined Rules to be processed by the RuleManager
 *
 */

export class Rules {

    public rule_z3: IRule = {
        id: 3,
        active: true,
        title: 'Rule 3',
        Condition: [
            {
                context: 'semester_planing',
                key: EConditionCount.count_active_milestones,
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: EConditionCount.count_milestone_list_views,
                value: 0,
                operator: EOperators.Equal
            }
        ],
        Action: {
            method: ERuleActor.Style,
            text: 'Es wurde eine Meilensteinplanung angelegt. Bitte überprüfen Sie, ob diese Planung so für Sie passt.',
            dom_selector: '.ms-headline',
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
        id: 4,
        active: true,
        title: 'Rule 4',
        Condition: [
            {
                context: 'semester_planing',
                key: EConditionCount.count_active_milestones,
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: EConditionCount.count_milestone_list_views,
                value: 0,
                operator: EOperators.Equal
            },
            {
                context: 'semester_planing',
                key: EConditionDate.milestone_start,
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
        id: 5,
        active: false,
        title: 'Rule 5',
        Condition: [
            {
                context: 'semester_planing',
                key: EConditionCount.count_active_milestones,
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: EConditionCount.count_milestone_list_views,
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: EConditionDate.milestone_start_date,
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
        id: 6,
        active: false,
        title: 'Rule 6',
        Condition: [
            {
                context: 'semester_planing',
                key: EConditionCount.count_active_milestones,
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: EConditionCount.count_milestone_list_views,
                value: 0,
                operator: EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: EConditionDate.milestone_start_date,
                value: (new Date()).getTime() - 4 * 24 * 3600 * 1000,
                operator: EOperators.Smaller
            },
            {
                context: 'semester_planing',
                key: EConditionDate.milestone_start_date,
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
        id: 0,
        active: true,
        title: 'Test Title',
        Condition: [
            {
                context: 'semester_planing',
                key: EConditionCount.count_active_milestones,
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
        this.rule_z3, this.rule_z4, this.rule_z5,  this.rule_z6
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
    id: number,
    active: boolean,
    title: string,
    Condition: IRuleCondition[];
    Action: IRuleAction; // todo: think about enabling multiple actions per rule
}
export interface IRuleCondition {
    context: string,
    key: EConditionKey,
    value: number,
    operator: EOperators
};
export interface IRuleAction {
    method: ERuleActor,
    text: string,
    moodle_context: EMoodleContext,
    moodle_course?: number,
    dom_selector?: string,
    viewport_selector?: string,
    timing?: ETiming,
    delay?: number,
    priority?: number,
    repetitions: number, // number of time the action should be repeated after being dismissed by the user
}
export enum EMoodleContext {
    LOGIN_PAGE = 'login page',
    HOME_PAGE = 'home page',
    PROFILE_PAGE = 'profile page',
    COURSE_PARTICIPANTS = 'course participants',
    COURSE_OVERVIEW_PAGE = 'course overview page',
    MOD_PAGE = 'mod page',
    MOD_ASSIGNMENT = 'mod assignment',
    MOD_NEWSMOD = 'mod newsmod',
    MOD_QUIZ = 'mod quiz',
    MOD_QUIZ_ATTEMPT = 'mod quiz attempt',
    MOD_QUIZ_SUMMARY = 'mod quiz summary',
    MOD_QUIZ_REVIEW = 'mod quiz review',
    UNKNOWN = 'unknown'
}

export enum EConditionCount {
    count_active_milestones = 'count active milestones',
    count_milestone_list_views = 'count milestone list views',
}

export enum EConditionDate {
    milestone_start_date = 'milestone start date',
    milestone_start = 'milestone start',
    milestone_end_date = 'milestone end date',
}

export type EConditionKey = EConditionCount | EConditionDate;

// export enum EConditionKey {
//     count_active_milestones = 'count active milestones',
//     count_milestone_list_views = 'count milestone list views',
//     milestone_start_date = 'milestone start date',
//     milestone_start = 'milestone start',
//     milestone_end_date = 'milestone end date',
// }

export enum EOperators {
    Smaller = '<',
    Greater = '>',
    Equal = '==',
    Contains = 'contains',
    Similar = 'similar',
    Has = 'has',
}
export enum ERuleActor {
    Alert = 'alert',
    Prompt = 'prompt',
    Confirm = 'confirm',
    Style = 'style',
    Modal = 'modal',
}
export enum ETiming {
    NOW = 'now',
    WHEN_VISIBLE = 'when_visible',
    WHEN_IDLE = 'when_idle',
}