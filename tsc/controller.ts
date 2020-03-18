import { IConfig } from "./config";
import { EDOMPosition, CreateModal, ICreateModal } from "./dom";

export class Controller{

    private readonly _config:IConfig;

    constructor(config:IConfig){
        this._config = config;
        let mod = <ICreateModalt>{
            id: "mymodal",
            header: `<div class="modal-title">Mein Titel</div>`,
            hidden: false,
            position: EDOMPosition.prepend,
            selector: "body"
        }
        let modal = new CreateModal(mod);
        modal.run();        
    }

}