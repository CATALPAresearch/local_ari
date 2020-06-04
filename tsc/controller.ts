import { Modal, IModalConfig, EModalSize } from './core_modal';

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class Controller{  

    constructor(){     
        let modalConfig = <IModalConfig>{
          id: "myfield",
          content: {
            header: "<h5 class=\"modal-title\">Title</h5>",
            body: "<p>Hier könnte Deine Werbung stehen</p>",
            footer: "<p>Das ist der Footer</p>"
          },
          options:{
            centerVertically: true,
            show: true,
            focus: true,
            keyboard: true,
            backdrop: true,
            animate: true,
            size: EModalSize.small
          }
        }
        try{
          console.log("lets go");
          let modal = new Modal(modalConfig);  
        } catch(error){
          console.log(error);
        }
        
    }

}