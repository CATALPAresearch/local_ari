import { ILearnerModel } from './learner_model_manager';
import { IRuleAction, IRuleCondition } from './rules';
export declare class RuleManager {
    lm: ILearnerModel;
    actionQueue: IRuleAction[];
    private rules;
    private moodleContext;
    private moodleInstanceID;
    private browserTabID;
    activeActors: Array<object>;
    constructor(lm: ILearnerModel);
    private _determineMoodleContext;
    private _determineURLParameters;
    private _checkRules;
    getLearnerModelKey(context: string, key: string): any;
    evaluateConditions(cons: IRuleCondition[]): boolean;
    private _addToActionQueue;
    private _processActionQueue;
    static _executeAction(tmp: IRuleAction): void;
    storeActorStats(id: string, params: IRuleActorStats): void;
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