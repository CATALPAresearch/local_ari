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

export class Rules {

    constructor() {
        // TODO load from json file or from database
    }

    public rule:IRule = {
        id: 100,
        active: true,
        title: "Test HTML Prompt",
        Condition: [
            {
              context: "quiz_activity",
              key: EConditionCount.count_quiz_attempts,
              value: 0,
              operator: EOperators.Greater,
            }
          ],
        Action: {
          method: ERuleActor.HtmlPrompt,
          text:   'Sie haben diese Aufgabe innerhalb kurzer Zeit sehr oft wiederholt ohne sich zu verbessern. In <a href="http://localhost/moodle/mod/longpage/view.php?id=48">KE1</a> finden Sie Hinweise wie diese Aufgabe zu gelöst werden kann. Wie Sie Ihr Leseverständnis steigern können, erfahren Sie <a href="#/strategies/readingcomprehension">hier</a>',
          moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE,
          moodle_course: 3,
          dom_content_selector: ".prompt.quiz-6",
          dom_indicator_selector: ".completion-item-quiz-6",
          delay: 1000, // miliseconds
          repetitions: 1,
          timing: ETiming.NOW,
        },
      };

    
    public the_rules: IRule[] = [
        this.rule
    ];

    public getAll(): IRule[] {
        return this.the_rules;
    }

    public consistencyCheck(): Boolean {
        // TODO: test the existence of the required keys and data types.
        return true;
    }
}


export interface IRule {
    id: number,
    active: boolean,
    title: string,
    Condition: IRuleCondition[];
    Action: IRuleAction; // todo: think about enabling multiple actions per rule
};

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
    dom_content_selector?: string,
    dom_indicator_selector?: string,
    viewport_selector?: string,
    timing?: ETiming,
    delay?: number,
    priority?: number,
    repetitions: number, // number of time the action should be repeated after being dismissed by the user
};

export enum EMoodleContext {
    LOGIN_PAGE = 'login page',
    HOME_PAGE = 'home page',
    PROFILE_PAGE = 'profile page',
    COURSE_PARTICIPANTS = 'course participants',
    COURSE_OVERVIEW_PAGE = 'course overview page',
    MOD_PAGE = 'mod page',
    MOD_LONGPAGE = 'mod longpage',
    MOD_SAFRAN = 'mod safran',
    MOD_ASSIGNMENT = 'mod assignment',
    MOD_NEWSMOD = 'mod newsmod',
    MOD_QUIZ = 'mod quiz',
    MOD_QUIZ_ATTEMPT = 'mod quiz attempt',
    MOD_QUIZ_SUMMARY = 'mod quiz summary',
    MOD_QUIZ_REVIEW = 'mod quiz review',
    MOD_SAFRAN_REVIEW = 'mod safran review',
    UNKNOWN = 'unknown'
};

export enum EConditionCount {
    count_quiz_attempts = 'count_attempts',
    count_active_milestones = 'count_active_milestones',
    count_milestone_list_views = 'count_milestone_list_views',
};

export enum EConditionDate {
    milestone_start_date = 'milestone start date',
    milestone_start = 'milestone start',
    milestone_end_date = 'milestone end date',
};

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
};

export enum ETiming {
    NOW = 'now',
    WHEN_VISIBLE = 'when_visible',
    WHEN_IDLE = 'when_idle',
};