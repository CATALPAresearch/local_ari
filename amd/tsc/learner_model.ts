
/**
 *
 * @author Niels Seidel
 * @version 1.0-20200409
 * @description Model of all data related to the learner
 *
 */


import { Modal, IModalConfig, EModalSize } from './core_modal';


/**
 * Lädt und synchronisiert Learner Model
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
            Condition: [{ context: 'semester_planing', key: 'initial_view_ms_list', value: 0, operator: Operators.Equal }],
            Action: { method: RuleMethod.Modal, text: 'hello world' }
        });

        // checks all rules
        let tmp;
        for (var i = 0; i < all_rules.length; i++) {
            tmp = all_rules[i];
            if (this.evaluateConditions(tmp.Condition)) {
                switch (tmp.Action.method) {
                    case RuleMethod.Alert:
                        console.log(tmp.Action.text);
                        break;
                    case RuleMethod.Modal:
                        this.initiateModal('Hinweis', tmp.Action.text)
                        console.log('MODAL',tmp.Action.text);
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

    /*public getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
        return o[propertyName]; // o[propertyName] is of type T[K]
    }*/

    /**
     * Evaluate each condition of a rule considering the data stored in the learner model
     * @param cons 
     */
    public evaluateConditions(cons: RuleCondition[]) {
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

    /**
     * Triggers Action of a modal Window
     * @param title 
     * @param message 
     */
    public initiateModal(title:string, message:string):void{
        let config = <IModalConfig>{
            id: "myfield",
            content: {
                header: "<h5 class=\"modal-title\" id=\"exampleModalLabel\">"+ title +"</h5>",
                body: "<p>"+ message +"</p>",
                footer: "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button> \
            <button type=\"button\" class=\"btn btn-primary\">Save changes</button>"
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

export interface Rule {
    Condition: RuleCondition[];
    Action: RuleAction; // todo: think about enabling multiple actions per rule
}
export interface RuleCondition {
    context: string,
    key: string,
    value: number,
    operator: Operators
};
export enum Operators {
    Smaller,
    Bigger,
    Equal,
}
export interface RuleAction { method: RuleMethod, text: string }
//export interface ActionContexts { 'semester_planing':string, 'bam':string }
export enum RuleMethod { Alert, Modal }