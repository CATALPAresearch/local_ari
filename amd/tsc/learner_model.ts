
/**
 *
 * @author Niels Seidel
 * @version 1.0-20200409
 * @description Model of all data related to the learner
 *
 */

//@ts-ignore
class LearnerModelManeger {
    constructor() {

    }

    public load(): void { }
    public update(): void { }
}

export interface LearnerModel {
    id: string;
    semester_planing?: {
        initial_view_ms_list?: number; // rezeptive NUtzung der MS Liste, open collapse
        body?: string; // drei tage nach MS start Der Studierende hat die MS-Planung weder aufgerufen noch angpasst. Wir möchten wissen, ob er die Planung nun einmal ansehen und ggf. anpassen möchte.
        initial_edit_ms_list?: string; // Listenansicht der MS-Planung wurde rezeptiv genutzt, der Studierende soll an die Anpassung seiner aktiven Meilensteine erinnert werden.
        footer?: string;
    };

}