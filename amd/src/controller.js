define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function () {
        function Controller(config, path) {
            this._config = config;
            this._path = path;
            //Popup.prompt("Bitte geben Sie einen Wert ein!", "Der Wert");
            /*try{
                console.log("chat start");
                let chat_data:IChatMessage = {
                    message: "Hier kommt eine Nachricht!"
                }
                let chat = new ChatMessage(chat_data);
                chat.run().then(
                    (resolve) => {
                        console.log("resolve");
                    },
                    (reject) => {
                        console.log(reject);
                    }
                );
                console.log("chat end");
            } catch(error){
                console.log(error);
            }*/
            /*
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
            });*/
            //let id = new IndexDB("mydb");
            /*$('body').append("<video autoplay=\"true\" id=\"videoElement\"></video>");
    
            let webcam  = new MediaStream({video: true});
            webcam.start().then(
                (resolve) => {
                    let video = document.querySelector("#videoElement");
                    //@ts-ignore
                    video.srcObject = webcam._mediaStream;
                },
                (reject) => {
                    console.log(reject);
                }
            )
    
            */
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
        return Controller;
    }());
    exports.Controller = Controller;
});
