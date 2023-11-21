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
import { RulesTesting } from './rules_testing';

export class Rules {

    public course_id:number = -1;
    public the_rules: IRule[] = [];

    constructor(course_id:number) {
        this.course_id = course_id;
        Communication.setPluginName('local_ari');
        this.loadRules();
    }
    
    public getAll(): IRule[] {
        return this.the_rules;
    }

    public async loadRules():Promise<void> {
        await Communication.webservice("get_rules", {
            data: { course_id: this.course_id }, // FIXME: static param 
        }).then((response:any) => {
            try{
                //console.log('GET RULES   ',response.data)
                //console.log('GET RULES DEBUG  ',response.debug)
                for(let rule in JSON.parse(response.data)){
                    const json:IRule = <IRule>JSON.parse(response.data)[rule];
                    this.the_rules.push(json); 
                }
            }catch(e){
                console.error('Error at get_rules. Cast to IRules failed. ', response);
            }
        }).catch((error) => {
            console.error("Error at get_rules. Could not load rules from database. ", error);
        });
    }


    /**
     * Testing rules are loaded from a file and enable the user to test featurues of ARI within the Adaptation Rule Dashboard.
     */
    public loadTestingRules():void{
        let tr = new RulesTesting();
        let testing_rules:IRule[]  = tr.getAll();
        this.the_rules  = [...this.the_rules, ...testing_rules];
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
    course_id?: number,
    is_active: boolean,
    is_per_section_rule?: boolean, // apply rule on every section of the course
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
    UNSPECIFIED = 'unspecified',
    TIME_MANAGEMENT = 'time_management',
    PROGRESS = 'progress',
    SUCCESS = 'success',
    SOCIAL = 'social',
    COMPETENCY = 'competency',
}

export enum EActionAugmentation {
    USER_DATA = 'user_data',
    LEARNER_MODEL = 'learner_model',
    RELATED_RESOURCE = 'related_resource',
    NEXT_STEP = 'next_step',
    LLM_PROMPT = 'LLM_prompt',
    REFLECTION_TASK = 'reflection task',
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
    Equal = '==',
    Modolo = '%',
    Smaller = '<',
    SmallerEqual = '<=',
    Greater = '>',
    GreaterEqual = '>=',

    SumSmaller = 'sum()<',
    SumRecursiveSmaller = 'sumR()<',
    SumGreater = 'sum()>',
    SumRecursiveGreater = 'sumR()>',
    Contains = 'contains',
    Similar = 'similar',
    Has = 'has',
    DaysDistanceSmallerThan = 'days distance <',
    DaysDistanceGreaterThan = 'days distance >',


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
    UNSPECIFIED = 'unspecified',
    NOW = 'now',
    WHEN_VISIBLE = 'when_visible',
    WHEN_IDLE = 'when_idle',
};