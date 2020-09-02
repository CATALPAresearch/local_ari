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
import { Rules, IRule, IRuleAction, IRuleCondition, EOperators, EMoodleContext, ETiming, ERuleActor} from './rules';
import { Modal, IModalConfig, EModalSize } from './actor_modal';
import { uniqid } from "./core_helper";
import { DOMVPTracker } from './sensor_viewport';
import { getTabID } from './sensor_tab';
import { sensor_idle } from './sensor_idle';

/**
 * RuleManger checks rule conditions and mangages the subsequent rule actions by considering context variables
 */
export class RuleManager {
    public lm: ILearnerModel;
    public actionQueue: IRuleAction[];
    private rules: IRule[] = [];
    private moodleContext: EMoodleContext;
    private moodleInstanceID: number;
    private browserTabID: string;


    constructor(lm: ILearnerModel) {
        this.lm = lm;
        this.actionQueue = [];
        this.moodleContext = this._determineMoodleContext();
        // @ts-ignore
        this.moodleInstanceID = this._determineURLParameters('id');
        this.browserTabID = getTabID();
        console.log('current context:', this.moodleContext, this.moodleInstanceID, this.browserTabID);
        // initial rule as an example, only for testing
        this.rules = (new Rules()).getAll();

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
        for (var i = 0; i < this.rules.length; i++) {
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

            if (localActions[i].timing === ETiming.WHEN_VISIBLE && localActions[i].viewport_selector !== undefined) {
                // @ts-ignore
                new DOMVPTracker(localActions[i].viewport_selector, 0)
                    .get().then((resolve) => {
                        //console.log('z217 ',localActions[i].moodle_context)
                        //RuleManager._executeAction(localActions[i]);
                        console.log('z217 ', resolve);
                    }
                );
            } else if (localActions[i].timing === ETiming.WHEN_IDLE && localActions[i].delay !== undefined) {
                //this._callWhenIdle(localActions[i], localActions[i].delay)
                sensor_idle(RuleManager._executeAction, localActions[i], localActions[i].delay);
            } else { // === ETiming.NOW
                RuleManager._executeAction(localActions[i]);
            }
        }
    }


    /**
     * 
     * @param tmp 
     */
    public static _executeAction(tmp: IRuleAction): void {
        console.log('drinn')
        //let _this = this;
        switch (tmp.method) {
            case ERuleActor.Alert:
                console.log('Execute ALERT', tmp.text);
                break;
            case ERuleActor.Modal:
                console.log('Execute MODAL', tmp.text);
                RuleManager.initiateModal('Hinweis', tmp.text);
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
    public static initiateModal(title: string, message: string): void {
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



