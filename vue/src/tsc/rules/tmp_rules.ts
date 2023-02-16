import * as rules from "../rules";

export class TmpRules {
    public rule_z3: rules.IRule = {
        id: 3,
        active: true,
        title: 'Rule 3',
        Condition: [
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_active_milestones,
                value: 0,
                operator: rules.EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_milestone_list_views,
                value: 0,
                operator: rules.EOperators.Equal
            }
        ],
        Action: {
            method: rules.ERuleActor.Style,
            text: 'Es wurde eine Meilensteinplanung angelegt. Bitte überprüfen Sie, ob diese Planung so für Sie passt.',
            dom_content_selector: '.ms-headline',
            moodle_context: rules.EMoodleContext.COURSE_OVERVIEW_PAGE,
            delay: 1000, // miliseconds
            timing: rules.ETiming.WHEN_IDLE,
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

    public rule_z4: rules.IRule = {
        id: 4,
        active: true,
        title: 'Rule 4',
        Condition: [
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_active_milestones,
                value: 0,
                operator: rules.EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_milestone_list_views,
                value: 0,
                operator: rules.EOperators.Equal
            },
            {
                context: 'semester_planing',
                key: rules.EConditionDate.milestone_start,
                value: (new Date()).getTime() - 3 * 24 * 3600 * 1000, // 3 days after today
                operator: rules.EOperators.Greater
            },
        ],
        Action: {
            method: rules.ERuleActor.Modal,
            text: 'hello world', // TODO: Haben Sie schon etwas von Ihrem Meilenstein erledigt? -> ja/ Meilentein ansehen; if "ja" -> Abhaken anbieten; if "Meilentein ansehen" ->  open >aktuellen MS<
            moodle_context: rules.EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: rules.ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    public rule_z5: rules.IRule = {
        id: 5,
        active: false,
        title: 'Rule 5',
        Condition: [
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_active_milestones,
                value: 0,
                operator: rules.EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_milestone_list_views,
                value: 0,
                operator: rules.EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: rules.EConditionDate.milestone_start_date,
                value: (new Date()).getDate(),
                operator: rules.EOperators.Equal
            }
        ],
        Action: {
            method: rules.ERuleActor.Modal,
            text: 'Heute beginnt Ihr Meilenstein >>Name aktueller MS<<. Sie können diesen jederzeit anpassen.>>Link zum MS-Editor<< ',
            moodle_context: rules.EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: rules.ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    public rule_z6: rules.IRule = {
        id: 6,
        active: false,
        title: 'Rule 6',
        Condition: [
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_active_milestones,
                value: 0,
                operator: rules.EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_milestone_list_views,
                value: 0,
                operator: rules.EOperators.Greater
            },
            {
                context: 'semester_planing',
                key: rules.EConditionDate.milestone_start_date,
                value: (new Date()).getTime() - 4 * 24 * 3600 * 1000,
                operator: rules.EOperators.Smaller
            },
            {
                context: 'semester_planing',
                key: rules.EConditionDate.milestone_start_date,
                value: (new Date()).getTime() - 3 * 24 * 3600 * 1000,
                operator: rules.EOperators.Greater
            }
        ],
        Action: {
            method: rules.ERuleActor.Modal,
            text: 'hello ', // TODO: Haben Sie schon etwas von Ihrem Meilenstein erledigt? -> ja/ Meilentein ansehen; if "ja" -> Abhaken anbieten; if "Meilentein ansehen" ->  open >aktuellen MS<
            moodle_context: rules.EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: rules.ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

    // template for rule formulation
    public rule_: rules.IRule = {
        id: 0,
        active: true,
        title: 'Test Title',
        Condition: [
            {
                context: 'semester_planing',
                key: rules.EConditionCount.count_active_milestones,
                value: 0,
                operator: rules.EOperators.Greater
            }
        ],
        Action: {
            method: rules.ERuleActor.Modal,
            text: 'hello world',
            moodle_context: rules.EMoodleContext.COURSE_OVERVIEW_PAGE,
            viewport_selector: '#page-footer',
            timing: rules.ETiming.WHEN_VISIBLE,
            repetitions: 1,
        }
    };

}