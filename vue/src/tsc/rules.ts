/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Load or define strictly defined Rules to be processed by the RuleManager
 *
 * TODO
 * - condition contect refers to the context of data collection
 * - action context which is currently missing refers to to the context where the action should executed.
 */
//import * as ruleset from "./rules/test-rule";
import Communication from '../../scripts/communication';

export class Rules {

    constructor() {
        Communication.setPluginName('local_ari');
        this.loadRules();
    }

    public course_id:number = 2;

    // Wie kann ich eine Condition definieren, die je section geprüft wird und je section eine action auslöst?
    // basic example
    public rule:IRule = {
        id: 100,
        isActive: true,
        isPerSectionRule: true,
        title: "Course-Progress",
        Condition: [
            {
                source_context: "mod_assign",
                key: 'last_access_days_ago',
                value: 10,
                operator: EOperators.Smaller,
            },
            /*{
                source_context: "mod_quiz",
                key: 'mean_rel_submissions',
                value: 0.5,
                operator: EOperators.Smaller,
            }*/
          ],
        Action: [
            {
                id: 999,
                actor: ERuleActor.StoredPrompt,
                type: EActionType.SCOPE_COURSE,
                section: '', 
                category: EActionCategory.TIME_MANAGEMENT,
                action_title: 'Titel der Empfehlung',
                action_text:   'Hallo Herr {user.firstname} {user.lastname}, Sie haben bislang weniger als die Hälfte der Einsende- und Quizaufgaben bearbeitet. ',
                target_context: ETargetContext.COURSE_OVERVIEW_PAGE,
                moodle_course: 2,
                dom_content_selector: ".page-header-headings",//".testbed",//".page-header-headings",
                //dom_indicator_selector: ".completion-item-quiz-6",
                //delay: 1000, // miliseconds
                repetitions: 2,
                timing: ETiming.NOW,
            }
        ],
      };


      public rule_long_absense:IRule = {
        id: 100,
        isActive: true,
        title: "Long course absense, low progress",
        Condition: [
            {
                source_context: "course",
                key: 'last_access_days_ago',
                value: 14,
                operator: EOperators.Greater,
            },
            {
                source_context: "mod_assign",
                key: 'mean_rel_submissions',
                value: 0.5,
                operator: EOperators.Smaller,
            },
            {
                source_context: "mod_quiz",
                key: 'mean_rel_submissions',
                value: 0.5,
                operator: EOperators.Smaller,
            }
          ],
        Action: [
            {
                id: 989,
                section: '',
                actor: ERuleActor.StoredPrompt,
                type: EActionType.SCOPE_COURSE, 
                category: EActionCategory.TIME_MANAGEMENT,
                action_title: 'Willkommen',
                action_text:   "Hallo Herr {user.firstname} {user.lastname}, Ihr letzter Besuch im Kurs liegt bereits {lm.course.last_access_days_ago} Tage zurück. Bislang haben Sie {lm.course.relative_progress} % der Aufgaben im Kurs mit einer Erfolgsqoute von {lm.course.relative_success} % bearbeitet. Sie haben dafür insgesamt {lm.course.total_time_spent_hms} Stunden aufgewendet.",
                target_context: ETargetContext.TEST,
                moodle_course: 2,
                dom_content_selector: ".page-header-headings",
                repetitions: 2,
                timing: ETiming.NOW,
            }
        ],
      };

    
    public the_rules: IRule[] = [
        this.rule
    ];

    public getAll(): IRule[] {
        return this.the_rules;
    }

    public async loadRules():Promise<void> {
        await Communication.webservice("get_rules", {
            data: { course_id: this.course_id }, // FIXME: static param 
        }).then((response:any) => {
            try{
                const json:IRule = <IRule>JSON.parse(response.data)["rule1"];
                this.the_rules.push(json); 
            }catch(e){
                console.error('Error at get_rules. Cast to IRules failed. ', response);
            }
        }).catch((error) => {
            console.error("Error at get_rules. Could not load rules from database. ", error);
        });
    }

    public ruleConsistencyCheck(): Boolean {
        // @TODO: test the existence of the required keys and data types.
        return true;
    }

    public modelConsistencyCheck(): Boolean {
        // @TODO Check wheter all elements and values defined in the rule interface IRule have been represented in the database.
        return true;
    }
}


export interface IRule {
    id: number,
    title: string,
    isActive: boolean,
    isPerSectionRule?: boolean, // apply rule on every section of the course
    // perType: EActionCategory[], // apply rule to all activities of this type
    Condition: IRuleCondition[];
    Action: IRuleAction[]; 
};

export interface IRuleCondition {
    id?: number,
    source_context: string,
    key: string, // this is a path used by json-path-plus
    value: number,
    operator: EOperators
};

export interface IRuleAction {
    id: number,
    actor: ERuleActor,
    type: EActionType,
    category: EActionCategory,
    section: string,
    action_title: string,
    action_text: string,
    augmentations?: EActionAugmentation[],
    target_context: ETargetContext,
    moodle_course?: number,
    dom_content_selector?: string,
    dom_indicator_selector?: string,
    viewport_selector?: string, // ??
    timing?: ETiming,
    delay?: number,
    priority?: number,
    repetitions: number, // number of time the action should be repeated after being dismissed by the user
};

export enum EActionType {
    SCOPE_COURSE = 'scope_course',
    SCOME_COURSE_UNIT = 'scope_course_unit',
    SCOPE_ACTIVITY_TYPE = 'scope_activity_type',
    SCOPE_ACTIVITY = 'scope_activity',
    NEXT_STEP = 'next_step',
}

export enum EActionCategory {
    TIME_MANAGEMENT = 'time_management',
    PROGRESS = 'progress',
    SUCCESS = 'success',
    SOCIAL = 'social',
    COMPETENCY = 'competency',
    
    // TODO
}

export enum EActionAugmentation {
    USER_DATA = 'user_data',
    LEARNER_MODEL = 'learner_model',
    RELATED_RESOURCE = 'related_resource',
    NEXT_STEP = 'next_step',
    LLM_PROMPT = 'LLM_prompt',
}


export enum ESourceContext {
    MOD_PAGE = 'mod_page',
    MOD_LONGPAGE = 'mod_longpage',
    MOD_SAFRAN = 'mod_safran',
    MOD_ASSIGNMENT = 'mod_assign',
    MOD_NEWSMOD = 'mod_usenet',
    MOD_HYPERVIDEO = 'mod_hypervideo',
    MOD_QUIZ = 'mod_quiz',
    MOD_QUESTIONNAIRE = 'mod_questionnaire',
    USER = 'user',
    COURSE_ENROLLMENT = 'course_enrollment'
};

export enum ETargetContext {
    // Standard locations
    LOGIN_PAGE = 'login_page',
    HOME_PAGE = 'home_page',
    PROFILE_PAGE = 'profile_page',
    COURSE_PARTICIPANTS = 'course_participants',
    COURSE_OVERVIEW_PAGE = 'course_overview_page',
    
    // activity plugins
    MOD_PAGE = 'mod_page',
    MOD_LONGPAGE = 'mod_longpage',
    MOD_SAFRAN = 'mod_safran',
    MOD_ASSIGNMENT = 'mod_assign',
    MOD_NEWSMOD = 'mod_usenet',
    MOD_HYPERVIDEO = 'mod_hypervideo',
    MOD_QUIZ = 'mod_quiz',

    TEST = 'local_ari',
    
    // specific locations (not deployed in DB)
    MOD_QUIZ_ATTEMPT = 'mod_quiz_attempt',
    MOD_QUIZ_SUMMARY = 'mod_quiz_summary',
    MOD_QUIZ_REVIEW = 'mod_quiz_review',
    MOD_SAFRAN_REVIEW = 'mod_safran_review',


    
    UNKNOWN = 'action context unknown',
};


export enum EOperators {
    Smaller = '<',
    SumSmaller = 'sum()<',
    SumRecursiveSmaller = 'sumR()<',
    Greater = '>',
    SumGreater = 'sum()>',
    SumRecursiveGreater = 'sumR()>',
    Equal = '==',
    Contains = 'contains',
    Similar = 'similar',
    Has = 'has',
};

export enum ERuleActor {
    Alert = 'alert',
    Prompt = 'prompt',
    Confirm = 'confirm',
    Style = 'style',
    Modal = 'modal',
    HtmlPrompt = 'htmlPrompt',
    StoredPrompt = 'storedPrompt',
    DashboardCourse = 'dashboard_course',
    DashboardCourseUnit = 'dashboard_course_unit',
    DashboardActivity = 'dashboard_activity',
};

export enum ETiming {
    NOW = 'now',
    WHEN_VISIBLE = 'when_visible',
    WHEN_IDLE = 'when_idle',
};