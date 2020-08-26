
/**
 *
 * @author Niels Seidel
 * @version 1.0-20200409
 * @description Model of all data related to the learner
 *
 */

//@ts-ignore
export class LearnerModelManager {
    public lm: LearnerModel = {
        userid: 101,
        semester_planing: {
            initial_view_ms_list: 0
        }
    };

    constructor() {
        this.checkRules(this.lm);
    }

    public checkRules(lm: LearnerModel): void {
        new Rules(lm);
    }

    public update(): void { }


}



export interface LearnerModel {
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

class Rules {
    public lm: LearnerModel;

    constructor(lm: LearnerModel) {
        this.lm = lm;
        let all_rules = [];
        // initial rule as an example
        all_rules.push({
            Condition: [{ key: 'initial_view_ms_list', value: 0, operator: Operators.Equal }],
            Action: { method: RuleMethod.Alert, text: 'hello world' }
        });

        //
        let tmp;
        for (var i = 0; i < all_rules.length; i++) {
            tmp = all_rules[i];
            if (this.evaluateConditions(tmp.Condition)) {
                switch (tmp.Action.method) {
                    case RuleMethod.Alert:
                        console.log(tmp.Action.text);
                        break;
                    case RuleMethod.Modal:
                        console.log(tmp.Action.text);
                        break;
                    default:
                        console.error('Undefined rule action called');
                }
            }
        }

    }

    public getLearnerModelKey(context: string, key: string): any {
        if (key === undefined) {
            return false;
        }
        // @ts-ignore
        return this.lm[context][key];
    }

    public getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
        return o[propertyName]; // o[propertyName] is of type T[K]
    }

    /**
     * Evaluate each condition of a rule considering the data stored in the learner model
     * @param cons 
     */
    public evaluateConditions(cons: RuleCondition[]) {
        let x = this.lm;
        let result = true;
        // iterate over all conditions and 
        for (var i = 0; i < cons.length; i++) {
            let condition = cons[i];
            switch (condition.operator) {
                case Operators.Equal:
                    result = result && this.getLearnerModelKey(condition.context, condition.key) === condition.value ? true : false;
                    break;
                default:
                    result = false;
            }
        }
        return result;
    }
}

export interface Rule {
    Condition: RuleCondition[];
    Action: RuleAction; // todo: think about enabling multiple actions per rule
}
export interface RuleCondition { context: string, key: string, value: number, operator: Operators };
export enum Operators {
    Smaller,
    Bigger,
    Equal,
}
export interface RuleAction { method: RuleMethod, text: string }
export enum RuleMethod { Alert }