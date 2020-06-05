import { ServiceWorker } from './core_worker';

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class Controller{
  
    private _path:string;

    constructor(path:string){   
      this._path = path;  
      console.log(this._path);      
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
      return;
    }
}