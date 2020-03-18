import { IConfig } from "./config";
import { SystemMessage } from "./messages";
import { Modal, IModal, EModalPosition } from "./styles";

export class Controller{

    private readonly _config:IConfig;

    constructor(config:IConfig){
        this._config = config;
        let mod = <IModal>{
            id: "mymodal",
            header: `<div class="modal-title">Mein Titel</div>`,
            hidden: false,
            position: EModalPosition.prepend,
            selector: "body"
        }
        let modal = new Modal(mod);
        modal.run();
        console.log("done");
    }

}