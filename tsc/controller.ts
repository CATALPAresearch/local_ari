import { IConfig } from "./config";
import SW from "./serviceworker";

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


        let sw = new SW("https://127.0.0.1/moodle/local/ari/lib/worker.js");     
        
        sw.update();
        

        $("#mytest").on("click", function(){
           sw.create().then(
               (resolve) => {
                    console.log("Resolve");
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