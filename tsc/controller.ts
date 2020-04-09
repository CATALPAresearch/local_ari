import { IConfig } from "./config";
import { EDOMPosition, CreateModal, ICreateModal } from "./dom";
import Sensor from "./sensor";
import Cookie from "./cookie";
import PushNotifications from "./push";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */
//@ts-ignore
import $ from "jquery";

export class Controller{

    private readonly _config:IConfig;
    private readonly _path:string;

    constructor(config:IConfig, path:string){
        this._config = config;
        this._path = path;

        //let sensor = new Sensor();    
        $("body").append(
            "<button id=\"mytest\">Meintest</button>"
        );    


        let test = new PushNotifications(this._path);

        $("#mytest").on("click", function(){
            test.subscribe().then(
                (resolve) => {
                    console.log("resolve");
                },
                (reject) => {
                    console.log(reject);
                }
            );
        });

        


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