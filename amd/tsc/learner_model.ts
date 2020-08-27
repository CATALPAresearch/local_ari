
/**
 *
 * @author Niels Seidel
 * @version 1.0-20200409
 * @description Model of all data related to the learner
 *
 */


import { Modal, IModalConfig, EModalSize } from './core_modal';


/**
 * Loads and synchronizes the Learner Model
 */
//@ts-ignore
export class LearnerModelManager {
    public static model: ILearnerModel = {
        userid: 101,
        semester_planing: {
            initial_view_ms_list: 0
        }
    };

    constructor() {
        this.checkRules();
    }

    public checkRules(): void {
        new RuleManager(LearnerModelManager.model);
    }

    public update(): void { }
}



export interface ILearnerModel {
    userid: number;
    semester_planing?: {
        initial_view_ms_list?: number; // rezeptive NUtzung der MS Liste, open collapse
        body?: string; // drei tage nach MS start Der Studierende hat die MS-Planung weder aufgerufen noch angpasst. Wir möchten wissen, ob er die Planung nun einmal ansehen und ggf. anpassen möchte.
        initial_edit_ms_list?: string; // Listenansicht der MS-Planung wurde rezeptiv genutzt, der Studierende soll an die Anpassung seiner aktiven Meilensteine erinnert werden.
        footer?: string;
    };
    longpage?: {};
    self_assessments?: {};
}




/**
 * RuleManger checks rule conditions and mangages the subsequent rule actions by considering context variables
 */
class RuleManager {
    public lm: ILearnerModel;
    public actionQueue: IRuleAction[];
    private rules: IRule[] = [];
    private moodleContext: EMoodleContext;
    private moodleInstanceID: number;

    private example_rules: IRule[] = [{
        Condition: [{
            context: 'semester_planing', // better EMoodleContext ??
            key: 'initial_view_ms_list',
            value: 0,
            operator: EOperators.Equal
        }],
        Action: {
            method: ERuleMethod.Modal,
            text: 'hello world',
            moodle_context: EMoodleContext.COURSE_OVERVIEW_PAGE
        }
    }];


    constructor(lm: ILearnerModel) {
        this.lm = lm;
        this.actionQueue = [];
        this.moodleContext = this._determineMoodleContext();
        // @ts-ignore
        this.moodleInstanceID = this._determineURLParameters('id');
        console.log(this.moodleContext, this.moodleInstanceID);
        // initial rule as an example, only for testing
        this.rules = this.example_rules;

        // checks all rules
        this._checkRules();
    }

    /**
     * 
     */
    private _determineMoodleContext(): EMoodleContext {
        let path = window.location.pathname;
        /*
        /login/index.php ... Login Page
        / ... home page
        /user/profile.php?id=4
        /user/index.php?id=5 ... user overview
        /course/view.php?id=5
        /mod/page/view.php?id=248 ... longpage
        /mod/assign/view.php?id=249 ... EA
        /mod/quiz/view.php?id=259 ... self-assessment
        https://aple.fernuni-hagen.de/mod/quiz/attempt.php?attempt=7753&cmid=259 ... start of a quiz
        https://aple.fernuni-hagen.de/mod/quiz/summary.php?attempt=7753&cmid=259 ... after entering solution
        https://aple.fernuni-hagen.de/mod/quiz/review.php?attempt=7753&cmid=259 ... after submission
        */
       path = path.replace('/moodle',''); // bad fix for my local installation
        switch (path) {
            case "/login/index.php": return EMoodleContext.LOGIN_PAGE;
            case "/": return EMoodleContext.HOME_PAGE;
            case "/user/profile.php": return EMoodleContext.PROFILE_PAGE;
            case "/user/index.php": return EMoodleContext.COURSE_PARTICIPANTS;
            case "/course/view.php": return EMoodleContext.COURSE_OVERVIEW_PAGE;
            case "/mod/page/view.php": return EMoodleContext.MOD_PAGE;
            case "/mod/assign/view.php": return EMoodleContext.MOD_ASSIGNMENT;
            case "/mod/quiz/view.php": return EMoodleContext.MOD_QUIZ;
            case "/mod/newsmod/view.php": return EMoodleContext.MOD_NEWSMOD;
        }
        return EMoodleContext.UNKNOWN;
    }


    private _determineURLParameters(param:string):string|number {
        // let params = <any>{};
        let parser = document.createElement('a');
        parser.href = window.location.href;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            // @ts-ignore
            if (pair[0] === param){
                return decodeURIComponent(pair[1])
            }
        }
        return -1;
    }


    /**
     * Iterates over all rules in order to check whether thei condistions are fulfilled. If all conditions are met the rule actions are pushed to the ruleActionQueue.
     */
    private _checkRules(): void {
        let tmp;
        for (var i = 0; i < this.rules.length; i++) {
            tmp = this.rules[i];
            if (this.evaluateConditions(tmp.Condition)) {
                this._addToActionQueue(tmp.Action);
            }
        }
    }

    /**
     * 
     * @param context 
     * @param key 
     */
    public getLearnerModelKey(context: string, key: string): any {
        if (key === undefined) {
            return false;
        }
        // @ts-ignore
        return this.lm[context][key];
    }

    /**
     * Evaluate each condition of a rule considering the data stored in the learner model
     * @param cons 
     */
    public evaluateConditions(cons: IRuleCondition[]) {
        let result = true;
        // iterate over all conditions and conjugate them
        for (var i = 0; i < cons.length; i++) {
            let condition = cons[i];
            switch (condition.operator) {
                case EOperators.Equal:
                    result = result && this.getLearnerModelKey(condition.context, condition.key) === condition.value ? true : false;
                    break;
                default:
                    result = false;
            }
        }
        return result;
    }


    /**
     * Pushes IRuleAction to the actionQueue.
     * @param action (IRuleAction)
     */
    private _addToActionQueue(action: IRuleAction): void {
        this.actionQueue.push(action);
        this._processActionQueue();
    }


    /**
     * 
     */
    private _processActionQueue(): void {
        let _this = this;
        // filter by current location
        let localActions: IRuleAction[] = this.actionQueue.filter(function (d) {
            return d.moodle_context === _this.moodleContext;
        });

        // consider the action timing, TODO

        // execute
        for (var i = 0; i < localActions.length; i++) {
            this._executeAction(localActions[i]);
        }
    }


    /**
     * 
     * @param tmp 
     */
    private _executeAction(tmp: IRuleAction) {
        switch (tmp.method) {
            case ERuleMethod.Alert:
                console.log('Execute ALERT', tmp.text);
                break;
            case ERuleMethod.Modal:
                this.initiateModal('Hinweis', tmp.text)
                console.log('Execute MODAL', tmp.text);
                break;
            default:
                new Error('Undefined rule action executed.');
        }
    }


    /**
     * Triggers a modal Window
     * @param title Modal title
     * @param message Message body
     */
    public initiateModal(title: string, message: string): void {
        let config = <IModalConfig>{
            id: "myfield",
            content: {
                header: "<h5 class=\"modal-title\" id=\"exampleModalLabel\">" + title + "</h5>",
                body: "<p>" + message + "</p>",
                footer: "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Jetzt nicht</button> \
            <button type=\"button\" class=\"btn btn-primary\">OK, habe verstanden</button>"
            },
            options: {
                centerVertically: true,
                show: true,
                focus: true,
                keyboard: true,
                backdrop: true,
                animate: true,
                size: EModalSize.small,
                showCloseButton: true
            }
        }
        new Modal(config);
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
    method: ERuleMethod,
    text: string,
    moodle_context: EMoodleContext,
    moodle_course?: number,
    timing?: ETiming,
    priority?: number,
    repeatitions?: number, // number of time the action should be repeated after being dismissed by the user
}
export enum EMoodleContext {
    LOGIN_PAGE,
    HOME_PAGE,
    PROFILE_PAGE,
    COURSE_PARTICIPANTS,
    COURSE_OVERVIEW_PAGE,
    MOD_PAGE  = 'mod_page',
    MOD_ASSIGNMENT = 'mod_assignment',
    MOD_NEWSMOD = 'mod_newsmod',
    MOD_QUIZ = 'mod_quiz',
    UNKNOWN = 'unknown'
}
export enum EOperators {
    Smaller,
    Bigger,
    Equal,
}
export enum ERuleMethod {
    Alert,
    Modal
}
export enum ETiming {
    NOW,
    ENTER_PAGE,
    LOGIN,
    WHEN_VISIBLE,
    WHEN_IDLE,
}