import { ILearnerModel } from "./learner_model_manager";
import { IRuleCondition, IRuleAction, EActionAugmentation, EActionType, EActionCategory } from "./rules";
export declare class RuleManager {
    static lm: ILearnerModel;
    static course_id: number;
    static wwwroot: string;
    actionQueue: IRuleAction[];
    private rules;
    private targetContext;
    private moodleInstanceID;
    private browserTabID;
    activeActors: Array<object>;
    constructor(lm: ILearnerModel, course_id: number, wwwroot: string);
    private _determineTargetContext;
    private _determineURLParameters;
    private _checkRules;
    getLearnerModelKey(context: string, key: string, section?: string): any;
    evaluateConditions(cons: IRuleCondition[], is_per_section_rule?: boolean): object;
    private _addToActionQueue;
    private _processActionQueue;
    static _executeAction(tmp: IRuleAction): void;
    static processAugmentation(augmentations: EActionAugmentation[], text: string): string;
    private resetStoredPrompts;
    private updatePromptAtDB;
    private getPromptFromDB;
    static getNestedKeys(arr: Object, prefix?: string): string[];
    storeActorStats(id: string, params: IRuleActorStats): void;
    static initiateActorStoredPrompt(action_id: number, section: string, type: EActionType, category: EActionCategory, title: string, message: string, indicator?: string): boolean;
    static initiateActorHtmlPrompt(hook: string, message: string, indicatorhook?: string): boolean;
    static initiateActorAlert(message: string): void;
    static initiateActorStyle(selector: string): void;
    static initiateActorModal(title: string, message: string): void;
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
//# sourceMappingURL=../../../@maps/src/tsc/rule_manager.d.ts.map