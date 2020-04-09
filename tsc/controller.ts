import { IConfig } from "./config";
import { EDOMPosition, CreateModal, ICreateModal } from "./dom";
import { Sensor } from "./sensor";
import Cookie from "./cookie";

export class Controller{

    private readonly _config:IConfig;

    constructor(config:IConfig){
        this._config = config;

        //let sensor = new Sensor();


        let today = new Date()
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);


        Cookie.set("heinz", 12, tomorrow);
        console.log(Cookie.getAll());

        /*let mod = <ICreateModal>{
            id: "mymodal",
            header: `<div class="modal-title">Mein Titel</div>`,
            hidden: false,
            position: EDOMPosition.prepend,
            selector: "body"
        }
        let modal = new CreateModal(mod);
        modal.run();*/        
    }
}