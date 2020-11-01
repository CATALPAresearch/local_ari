/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Manages the rules and the fulfillment of their conditions and execution of the related actions.
 *
 * TODO
 * - handle user reaction on rule presentation
 * - delayed rule execution
 * - reinforcement learning
 * - 
 */

import { ILearnerModel } from './learner_model_manager';
import { Rules, IRule, IRuleAction, IRuleCondition, EOperators, EMoodleContext, ETiming, ERuleActor } from './rules';
import { Modal, IModalConfig, EModalSize } from './actor_bs_modal';
import { Alert } from './actor_js_alert';
//import { StyleHandler } from './actor_style';
import { uniqid } from "./core_helper";
import { DOMVPTracker } from './sensor_viewport';
import { getTabID } from './sensor_tab';
import { sensor_idle } from './sensor_idle';
//import { IndexedDB } from './core_indexeddb'; // replace by dexie


/**
 * RuleManger checks rule conditions and mangages the subsequent rule actions by considering context variables
 */
export class RuleManager {
    public lm: ILearnerModel;
    public actionQueue: IRuleAction[];
    private rules: IRule[] = [];
    private moodleContext: EMoodleContext;
    private moodleInstanceID: number | string;
    private browserTabID: string;
    public activeActors: Array<object>;

    constructor(lm: ILearnerModel) {
        //let t = new IndexedDB('milestones'); // buggy
        //t.open();
        
        this.lm = lm;
        this.actionQueue = [];
        this.moodleContext = this._determineMoodleContext();
        this.moodleInstanceID = this._determineURLParameters('id');
        this.browserTabID = getTabID();
        this.activeActors = [];
        console.log('current context:', this.moodleContext, this.moodleInstanceID, this.browserTabID);
        // initial rule as an example, only for testing
        this.rules = (new Rules()).getAll();

        // checks all rules
        this._checkRules();
    }

    /**
     * Should this become a sensor of its own?
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
        path = path.replace('/moodle', ''); // bad fix for my local installation
        switch (path) {
            case "/login/index.php": return EMoodleContext.LOGIN_PAGE;
            case "/": return EMoodleContext.HOME_PAGE;
            case "/user/profile.php": return EMoodleContext.PROFILE_PAGE;
            case "/user/index.php": return EMoodleContext.COURSE_PARTICIPANTS;
            case "/course/view.php": return EMoodleContext.COURSE_OVERVIEW_PAGE;
            case "/mod/page/view.php": return EMoodleContext.MOD_PAGE;
            case "/mod/assign/view.php": return EMoodleContext.MOD_ASSIGNMENT;
            case "/mod/newsmod/view.php": return EMoodleContext.MOD_NEWSMOD;
            case "/mod/quiz/view.php": return EMoodleContext.MOD_QUIZ;
            case "/mod/quiz/attempt.php": return EMoodleContext.MOD_QUIZ_ATTEMPT;
            case "/mod/quiz/summary.php": return EMoodleContext.MOD_QUIZ_SUMMARY;
            case "/mod/quiz/review.php": return EMoodleContext.MOD_QUIZ_REVIEW;
        }
        return EMoodleContext.UNKNOWN;
    }


    /**
     * Determines whether a given URL parameter exists and returns its value.
     * @param param 
     */
    private _determineURLParameters(param: string): string | number {
        // let params = <any>{};
        let parser = document.createElement('a');
        parser.href = window.location.href;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] === param) {
                return decodeURIComponent(pair[1])
            }
        }
        return -1;
    }


    /**
     * Iterates over all rules in order to check whether thei condistions are fulfilled. If all conditions are met the rule actions are pushed to the ruleActionQueue.
     */
    private _checkRules(): void {
        console.log('rules',this.rules)
        console.log('lm',this.lm)
        for (var i = 0; i < this.rules.length; i++) {
            console.log(this.evaluateConditions(this.rules[i].Condition))
            if (this.evaluateConditions(this.rules[i].Condition)) {
                this._addToActionQueue(this.rules[i].Action);
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
        console.log('lm-key',this.lm[context][key])
        // @ts-ignore
        return this.lm[context][key];
    }


    /**
     * Evaluate each condition of a rule considering the data stored in the learner model
     * @param cons 
     */
    public evaluateConditions(cons: IRuleCondition[]) { console.log('eveal')
        let result = true;
        // iterate over all conditions and conjugate them
        for (var i = 0; i < cons.length; i++) {
            
            let condition = cons[i];
            // console.log(this.getLearnerModelKey(condition.context, condition.key), condition.value, condition.operator)
            switch (condition.operator) {
                case EOperators.Equal:
                    result = result && this.getLearnerModelKey(condition.context, condition.key) === condition.value ? true : false;
                    break;
                case EOperators.Greater:
                    result = result && this.getLearnerModelKey(condition.context, condition.key) > condition.value ? true : false;
                    break;
                default:
                    result = false;
            }
        } console.log('res', result)
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
        // filter by current location/page
        let localActions: IRuleAction[] = this.actionQueue.filter(function (d) {
            return d.moodle_context === _this.moodleContext;
        });
        // TODO: exclude rule actions that are not related to the current course

        // TODO: consider the action timing
        /**
             */

        // execute
        for (var i = 0; i < localActions.length; i++) {
            let tmpLocalAction = localActions[i];
            if (!tmpLocalAction) {
                new Error('No local action found in loop.')
            }
            if (tmpLocalAction.timing === ETiming.WHEN_VISIBLE && tmpLocalAction.viewport_selector !== undefined) {
                new DOMVPTracker(tmpLocalAction.viewport_selector, 0)
                    .get().then((resolve) => {
                        
                        //console.log('z217 ',tmpLocalAction.moodle_context)
                        RuleManager._executeAction(tmpLocalAction);
                        console.log('z217 ', resolve);
                    }
                    );
            } else if (tmpLocalAction.timing === ETiming.WHEN_IDLE && tmpLocalAction.delay !== undefined) {
                //this._callWhenIdle(tmpLocalAction, tmpLocalAction.delay)
                sensor_idle(RuleManager._executeAction, tmpLocalAction, tmpLocalAction.delay);
            } else { // === ETiming.NOW
                RuleManager._executeAction(tmpLocalAction);
            }
        }
    }


    /**
     * 
     * @param tmp 
     */
    public static _executeAction(tmp: IRuleAction): void {
        console.log('drinn')
        if (tmp.repetitions < 1){
            return;
        }
        //let _this = this;
        switch (tmp.method) {
            case ERuleActor.Alert:
                console.log('Execute ALERT', tmp.text);
                RuleManager.initiateActorAlert(tmp.text);
                break;
            case ERuleActor.Modal:
                console.log('Execute MODAL', tmp.text);
                RuleManager.initiateActorModal('Hinweis', tmp.text);
                break;
            default:
                new Error('Undefined rule action executed.');
        }
        tmp.repetitions--;
    }



    /**
     * duration?: number;
        opened?:number;
        closed?: number;
        viewportAccessed?: number;
        hovered?: number;
        agreed?: number;
        dismissed?: number;
        dived?: number;
     * @param id 
     * @param params 
     */
    public storeActorStats(id: string, params: IRuleActorStats) {
        // @ts-ignore
        let instance = this.activeActors[id];
        if (instance === null) {
            instance = {
                opened: 0,
                closed: 0,
                viewportAccessed: 0,
                hovered: 0,
                agreed: 0,
                dismissed: 0,
                dived: 0,
            };

        }

        instance.duration = params.duration === undefined ? undefined : params.duration;
    }


    /**
     * Triggers style changes
     * @param title Modal title
     * @param message Message body
     */
    /*
    public static initiateActorStyle(selector:string, property:string, value:string): void {
        // let t = new StyleHandler();
        return;
    }
    */

    /**
     * Triggers a alert window as actor
     * @param title Modal title
     * @param message Message body
     */
    public static initiateActorAlert(message: string): void {
        //let start: number = 0, end: number = 0;
        if (message.length > 0) {
            //start = new Date().getDate();
            Alert(message);
            //end = new Date().getDate();
        }
        //this.storeActorStats("bam", { duration: (end - start) });
    }

    /**
     * Triggers a modal Window
     * @param title Modal title
     * @param message Message body
     */
    public static initiateActorModal(title: string, message: string): void {
        let config = <IModalConfig>{
            id: "modal-" + uniqid(),
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

export interface IRuleActorStats {
    duration?: number;
    opened?: number;
    closed?: number;
    viewportAccessed?: number;
    hovered?: number;
    agreed?: number;
    dismissed?: number;
    dived?: number;
}



