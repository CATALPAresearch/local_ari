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

import { ILearnerModel } from "./learner_model_manager";
import {
    Rules,
    IRule,
    IRuleCondition,
    IRuleAction,
    EActionAugmentation,
    EOperators,
    //ESourceContext,
    ETargetContext,
    ETiming,
    ERuleActor,
    EActionType,
    EActionCategory
} from "./rules";
import { Modal, IModalConfig, EModalSize } from "./actor_bs_modal";
import { HtmlPrompt, IHtmlPromptConfig } from "./actor_js_html_prompt";
import { StoredPrompt, IStoredPromptConfig} from "./actor_stored_prompt";
import { Alert } from "./actor_js_alert";
import { StyleHandler } from "./actor_style";
import { uniqid } from "./core_helper";
import { DOMVPTracker } from "./sensor_viewport";
import { getTabID } from "./sensor_tab";
import { sensor_idle } from "./sensor_idle";
//import { IndexedDB } from './core_indexeddb'; // replace by dexie
//import { JSONPath } from "jsonpath-plus";
//import { JSONPath } from "jsonpath/lib";

/**
 * RuleManger checks rule conditions and mangages the subsequent rule actions by considering context variables
 */
export class RuleManager {
    public static lm: ILearnerModel;
    public actionQueue: IRuleAction[];
    private rules: IRule[] = [];
    //private sourceContext: ESourceContext;
    private targetContext: ETargetContext;
    private moodleInstanceID: number | string;
    private browserTabID: string;
    public activeActors: Array<object>;

    constructor(lm: ILearnerModel) {
        //let t = new IndexedDB('milestones'); // buggy
        //t.open();

        RuleManager.lm = lm;
        this.actionQueue = [];
        //this.sourceContext:ESourceContext;
        this.targetContext = this._determineTargetContext();
        this.moodleInstanceID = this._determineURLParameters("id");
        this.browserTabID = getTabID();
        this.activeActors = [];
        console.log(
            "ARI::current context:",
            //this.sourceContext,
            this.targetContext,
            this.moodleInstanceID,
            this.browserTabID
        );

        // initial rule as an example, only for testing
        // later on the set of rules could be filtered by the current moodleContext
        this.rules = new Rules().getAll();

        // FIXME: locale-plugins load before course-format plugins. If we do not wait some seconds the prompts cannot be attached to DOM elements.
        setTimeout(() => {
            // checks all rules
            this._checkRules();
        }, 5000);
    }


    /**
       * Should this become a sensor of its own?
       * /login/index.php ... Login Page
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
    private _determineTargetContext(): ETargetContext {
        let path = window.location.pathname;
        path = path.replace("/moodle311", "").replace("/moodle", ""); // FIXME: bad fix for my local installation
        // path = path.split('#')[0]; // cut-off DOM paths and vue router routs
        path =
            path.charAt(path.length - 1) === "/"
                ? path.substring(0, path.length - 1)
                : path; // remove trailling slash
        console.log("ARI::moodle context", path);
        switch (path) {
            case "/login/index.php":
                return ETargetContext.LOGIN_PAGE;
            case "/":
                return ETargetContext.HOME_PAGE;
            case "/user/profile.php":
                return ETargetContext.PROFILE_PAGE;
            case "/user/index.php":
                return ETargetContext.COURSE_PARTICIPANTS;
            case "/course/view.php":
                return ETargetContext.COURSE_OVERVIEW_PAGE;
            case "/mod/page/view.php":
                return ETargetContext.MOD_PAGE;
            case "/mod/longpage/view.php":
                return ETargetContext.MOD_LONGPAGE;
            case "/mod/assign/view.php":
                return ETargetContext.MOD_ASSIGNMENT;
            case "/mod/newsmod/view.php":
                return ETargetContext.MOD_NEWSMOD;
            case "/mod/quiz/view.php":
                return ETargetContext.MOD_QUIZ;
            case "/mod/quiz/attempt.php":
                return ETargetContext.MOD_QUIZ_ATTEMPT;
            case "/mod/quiz/summary.php":
                return ETargetContext.MOD_QUIZ_SUMMARY;
            case "/mod/quiz/review.php":
                return ETargetContext.MOD_QUIZ_REVIEW;
            case "/mod/safran/view.php":
                return ETargetContext.MOD_SAFRAN_REVIEW;
            case "/local/ari/index.php":
                    return ETargetContext.TEST;
                    case "/local/ari":
                        return ETargetContext.TEST;
        }
        console.log('ARI:: path ', path)
        return ETargetContext.UNKNOWN;
    }

    /**
     * Determines whether a given URL parameter exists and returns its value.
     * @param param
     */
    private _determineURLParameters(param: string): string | number {
        // let params = <any>{};
        let parser = document.createElement("a");
        parser.href = window.location.href;
        var query = parser.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return -1;
    }

    /**
     * Iterates over all rules in order to check whether their condistions are fulfilled.
     * If all conditions are met the rule actions are pushed to the ruleActionQueue.
     */
    private _checkRules(): void {
        console.log(
            "ARI::Check rules for a given learner model",
            this.rules,
            RuleManager.lm
        );
        for (var i = 0; i < this.rules.length; i++) {
            let result = this.evaluateConditions(this.rules[i].Condition);
            console.log("ARI::check individual rules: ", this.rules[i].title, result);
            if (result) {
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
        let result = '';
        if(RuleManager.lm[context] != null){
            if(RuleManager.lm[context][key] != null){
                result = RuleManager.lm[context][key]
            }
        }
        console.log("+++++++++++++++++++++++++++++++++++++++++++");
        console.log(result);
        // @ts-ignore
        return result;
    }

    /**
     * Evaluate each condition of a rule considering the data stored in the learner model
     * @param cons
     */
    public evaluateConditions(cons: IRuleCondition[]) {
        console.log("ARI::evaluate rule conditions");
        let result = true;

        // iterate over all conditions and conjugate them
        for (var i = 0; i < cons.length; i++) {
            let condition = cons[i];
            // console.log(this.getLearnerModelKey(condition.source_context, condition.key), condition.value, condition.operator)
            switch (condition.operator) {
                case EOperators.Equal:
                    result =
                        result &&
                            this.getLearnerModelKey(condition.source_context, condition.key) ===
                            condition.value
                            ? true
                            : false;
                    break;
                case EOperators.Greater:
                    result =
                        result &&
                            this.getLearnerModelKey(condition.source_context, condition.key) >
                            condition.value
                            ? true
                            : false;
                    break;
                case EOperators.Smaller:
                    result =
                        result &&
                            this.getLearnerModelKey(condition.source_context, condition.key) <
                            condition.value
                            ? true
                            : false;
                    break;
                case EOperators.Contains:
                    //result = result && this.getLearnerModelKey(condition.source_context, condition.key) > condition.value ? true : false;
                    // TODO:
                    let mkey = this.getLearnerModelKey(condition.source_context, condition.key);
                    if (typeof mkey == "string") {
                        //result = result && mkey.includes(condition.value);
                    } else if (typeof mkey == "object") {
                        //result = result && mkey.includes(condition.value);
                    }
                    result = false;
                    break;
                case EOperators.Has:
                    // has child element
                    result = false;
                    break;
                case EOperators.Similar:
                    // text similarity
                    result = false;
                    break;
                default:
                    result = false;
            }
        }
        console.log("ARI::rule conditions result", result);
        return result;
    }

    /**
     * Pushes IRuleAction to the actionQueue.
     * @param action (IRuleAction)
     */
    private _addToActionQueue(actions: IRuleAction[]): void {
        for (let i = 0; i < actions.length; i++) {
            this.actionQueue.push(actions[i]);
        }
        this._processActionQueue();
    }

    /**
     *
     */
    private _processActionQueue(): void {
        let _this = this;
        // filter by current location/page
        let localActions: IRuleAction[] = this.actionQueue.filter(function (d) {
            console.log("test", d.target_context, _this.targetContext);
            return d.target_context === _this.targetContext;
        });
        //let localActions: IRuleAction[] = this.actionQueue;
        // TODO: exclude rule actions that are not related to the current course

        // TODO: consider the action timing

        // execute
        for (var i = 0; i < localActions.length; i++) {
            let tmpLocalAction = localActions[i];
            if (!tmpLocalAction) {
                new Error("No local action found in loop.");
            }
            if (
                tmpLocalAction.timing === ETiming.WHEN_VISIBLE &&
                tmpLocalAction.viewport_selector !== undefined
            ) {
                new DOMVPTracker(tmpLocalAction.viewport_selector, 0)
                    .get()
                    .then((resolve) => {
                        //console.log('z217 ',tmpLocalAction.moodle_context)
                        RuleManager._executeAction(tmpLocalAction);
                        console.log("z217 ", resolve);
                    });
            } else if (
                tmpLocalAction.timing === ETiming.WHEN_IDLE &&
                tmpLocalAction.delay !== undefined
            ) {
                //this._callWhenIdle(tmpLocalAction, tmpLocalAction.delay)
                sensor_idle(
                    RuleManager._executeAction,
                    tmpLocalAction,
                    tmpLocalAction.delay
                );
            } else {
                // === ETiming.NOW
                console.log("HHHH", ETiming.NOW);
                RuleManager._executeAction(tmpLocalAction);
            }
        }
    }

    /**
     *
     * @param tmp
     */
    public static _executeAction(tmp: IRuleAction): void {
        console.log("ARI:Select action type to be executed");
        //if (tmp.repetitions < 1) { return; }
        // mixin augmentations to preprocess the output text, e.g. to include links
        tmp.augmentations = [];
        tmp.augmentations[0] = EActionAugmentation.USER_DATA; // for testing
        tmp.augmentations[1] = EActionAugmentation.LEARNER_MODEL
        if (tmp.augmentations.length > 0){
          tmp.action_text = this.processAugmentation(tmp.augmentations, tmp.action_text);
        }
        console.log("ARI::MIxin ", tmp.action_text);

        //let _this = this;
        switch (tmp.actor) {
            case ERuleActor.StoredPrompt:
                console.log("Execute StoredPrompt", tmp.action_text);
                RuleManager.initiateActorStoredPrompt(tmp.type, tmp.category, tmp.action_title, tmp.action_text, tmp.dom_indicator_selector)
                break;
            case ERuleActor.HtmlPrompt:
                console.log("Execute HhtmlPrompt", tmp.action_text);
                let res: boolean = RuleManager.initiateActorHtmlPrompt(
                    tmp.dom_content_selector || "body",
                    tmp.action_text,
                    tmp.dom_indicator_selector || "body"
                );
                if (res == false) {
                    tmp.repetitions++;
                }
                break;
            case ERuleActor.Alert:
                console.log("Execute ALERT", tmp.action_text);
                RuleManager.initiateActorAlert(tmp.action_text);
                break;
            case ERuleActor.Modal:
                console.log("Execute MODAL", tmp.action_text);
                RuleManager.initiateActorModal("Hinweis", tmp.action_text);
                break;
            case ERuleActor.Style:
                //console.log('Execute STYLE', tmp.action_text);
                RuleManager.initiateActorStyle(tmp.dom_content_selector || "");
                break;
            default:
                new Error("Undefined rule action executed.");
        }
        tmp.repetitions--;
    }


    /**
     * Process the assignes augmentation types to inject parameters into the action prompt or message presented to the student
     */
    public static processAugmentation(augmentations:EActionAugmentation[], text:string):string {
        
        for(let i = 0; i < augmentations.length; i++){
            switch(augmentations[i]){
                case EActionAugmentation.USER_DATA: 
                    // Include standard variables about the user
                    const allowed_user_keys = ["user.firstname", "user.lastname"];
                    const user_values = { // @FIXME load data from DB
                        "user.firstname": "Hans", 
                        "user.lastname": "Meyer"
                    }; 
                    for(let key = 0; key < allowed_user_keys.length; key=key+1) {
                        let ree = "\{"+ allowed_user_keys[key] + "\}";
                        let re = new RegExp(ree,"gi");
                        text = text.replace(re, user_values[allowed_user_keys[key]]);
                    }
                    break;
                case EActionAugmentation.LEARNER_MODEL: 
                    // Include values from LM, e.g. You've achived {lm.mod_assign.total_scores} so fare.
                    let allowed_lm_keys:string[] = RuleManager.getNestedKeys(RuleManager.lm, 'lm');
                    for(let key = 0; key < allowed_lm_keys.length; key=key+1) {
                        let ree = "\{"+ allowed_lm_keys[key] + "\}";
                        let re = new RegExp(ree,"gi");
                        if(allowed_lm_keys[key] != null){
                            let lm_value = allowed_lm_keys[key].split('.');
                            if(lm_value.length == 2){
                                text = text.replace(re, RuleManager.lm[lm_value[1]]);
                            } else if(lm_value.length == 3){
                                text = text.replace(re, RuleManager.lm[lm_value[1]][lm_value[2]]);
                            }
                        }
                    }
                    break;
                case EActionAugmentation.RELATED_RESOURCE:
                    // @TODO .. conceptional not finished
                    // Include ressources related to the one in the condition: So fare, you've achieved only a low scores in the assignement tasks. We recommend you to try the following self assessments first: {related.mod_safran}
                    /*const allowed_rel_resource_keys = ["related.safran_to_assign"];
                     
                    for(let key = 0; key < allowed_rel_resource_keys.length; key=key+1) {
                        let ree = "\{"+ allowed_rel_resource_keys[key] + "\}";
                        let re = new RegExp(ree,"gi");
                        //text = text.replace(re, user_values[allowed_rel_resource_keys[key]]);
                    }*/
                    break;
                    
                case EActionAugmentation.NEXT_STEP: 
                    // Include next learning steps, e.g. by using q-matrix
                    break;
                case EActionAugmentation.LLM_PROMPT: 
                    //Define a Prompt for an LLM.
                    break;
                //case 3: Sugest activity type in section: Your reading activity is high, but assessment attempts are low. We suggest to do more assessments {link_to_safran}
            }
        
        }
        return text;
    }

    /**
     * 
     * @param arr Returns the keys of the first two nested levels of the Learner Model
     * @returns 
     */
    public static getNestedKeys(arr:Object, prefix:string=''):string[]{
        let res:Array<string> = [];
        Object.keys(arr).forEach((item) => {
            if (typeof arr[item] != 'object'){
                res.push(prefix + '.' + item);
            }
            if (typeof arr[item] == 'object' && Object.keys(arr[item]) != null){
                Object.keys(arr[item]).forEach((iitem) => { 
                    if (typeof arr[item][iitem] != 'object'){
                        res.push(prefix + '.' + item + '.' + iitem); 
                    }
                    // TODO iterate on the third level
                });
            }
        });
        return res;
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

        instance.duration =
            params.duration === undefined ? undefined : params.duration;
    }


    /**
     * Triggers a promp for local storage
     * @param title 
     * @param message Message body
     */
    public static initiateActorStoredPrompt(type: EActionType, category: EActionCategory, title:string, message: string, indicator?: string): boolean {
        let config = <IStoredPromptConfig>{
            id: "storedprompt-" + uniqid(),
            type: type,
            category: category,
            indicatorhook: indicator !== undefined ? indicator : 'nix',
            title: title,
            message: message,
            timecreated: Date.now(),
        };
        new StoredPrompt(config);
        return true;//action.run();
    }

    /**
     * Triggers a HTML prompt
     * @param title Modal title
     * @param message Message body
     */
    public static initiateActorHtmlPrompt(hook: string, message: string, indicatorhook?: string): boolean {
        let config = <IHtmlPromptConfig>{
            id: "htmlprompt-" + uniqid(),
            hook: hook,
            indicatorhook: indicatorhook !== undefined ? indicatorhook : undefined,
            content: {
                message: message,
                /*urgency?:EHtmlPromptUrgency;
                        html?:string;
                        style?:string;*/
            },
        };
        let action = new HtmlPrompt(config);
        return action.run();
    }

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
     * Triggers a css style change as a actor
     * @param selector DOM selctor to be styled
     * @param message Message body
     */
    public static initiateActorStyle(selector: string): void {
        //let start: number = 0, end: number = 0;
        //start = new Date().getDate();
        StyleHandler.style({
            documentReady: true,
            selector: selector,
            property: "color",
            value: "red",
        });
        StyleHandler.animate({
            documentReady: true,
            selector: selector,
            params: {
                width: "70%",
                opacity: 0.4,
                marginLeft: "0.6in",
                fontSize: "3em",
                borderWidth: "10px",
            },
            duration: 1500,
        });
        //end = new Date().getDate();

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
                header:
                    '<h5 class="modal-title" id="exampleModalLabel">' + title + "</h5>",
                body: "<p>" + message + "</p>",
                footer:
                    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Jetzt nicht</button> \
            <button type="button" class="btn btn-primary">OK, habe verstanden</button>',
            },
            options: {
                centerVertically: true,
                show: true,
                focus: true,
                keyboard: true,
                backdrop: true,
                animate: true,
                size: EModalSize.small,
                showCloseButton: true,
            },
        };
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
