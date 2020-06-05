import { ServiceWorker } from './core_worker';

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class Controller{  

    constructor(){           
      this.go().then(
        (resolve) => {
          console.log(`Resolve: ${resolve}`);
        },
        (reject) => {
          console.log(`Reject: ${reject}`);
        }
      );
    }

    public async go(){
      //@ts-ignore
      let worker = new ServiceWorker(M.cfg.wwwroot+"/local/ari/lib/src/worker.js", "/"); 
      //@ts-ignore
      await worker.create(M.cfg.wwwroot+"/local/ari/lib/src/worker.js", 
        (error:ErrorEvent) => {
          console.log(error);
        }, 
        (state:any) => {
          console.log(state.target.state)
        }
      );  
      await worker.update();
      let notificationOptions = <NotificationOptions> {
        body: "Hier steht der Body",
        icon: 'images/example.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      await worker.sendNotification("Headline", notificationOptions);
      return;
    }
}