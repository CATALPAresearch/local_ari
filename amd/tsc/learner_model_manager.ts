/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Model of all data related to the learner
 *
 */


import { RuleManager } from './rule_manager';

/**
 * Loads and synchronizes the Learner Model
 */
//@ts-ignore
export class LearnerModelManager {
    public static model: ILearnerModel = {
        userid: 2,
        semester_planing: {
            initial_view_ms_list: 0,
            count_active_milestones: 0,
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
        count_active_milestones?: number;
        body?: string; // drei tage nach MS start Der Studierende hat die MS-Planung weder aufgerufen noch angpasst. Wir möchten wissen, ob er die Planung nun einmal ansehen und ggf. anpassen möchte.
        initial_edit_ms_list?: string; // Listenansicht der MS-Planung wurde rezeptiv genutzt, der Studierende soll an die Anpassung seiner aktiven Meilensteine erinnert werden.
        footer?: string;
    };
    longpage?: {};
    self_assessments?: {};
}



