import { ILearnerModel } from './learner_model_manager';
import { IRuleAction, IRuleCondition } from './rules';
export declare class RuleManager {
    lm: ILearnerModel;
    actionQueue: IRuleAction[];
    private rules;
    private moodleContext;
    private moodleInstanceID;
    private browserTabID;
    constructor(lm: ILearnerModel);
    private _determineMoodleContext;
    private _determineURLParameters;
    private _checkRules;
    getLearnerModelKey(context: string, key: string): any;
    evaluateConditions(cons: IRuleCondition[]): boolean;
    private _addToActionQueue;
    private _processActionQueue;
    static _executeAction(tmp: IRuleAction): void;
    static initiateModal(title: string, message: string): void;
}
//# sourceMappingURL=../tsc/@maps/rule_manager.d.ts.map