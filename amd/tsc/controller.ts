//import { ServiceWorker } from './core_worker';
//import { LearnerModelManager } from './learner_model_manager';
import { Webcam } from './core_webcam';
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export class Controller{
  
  private wwwroot:string;

  constructor(wwwroot: string) {
    //new LearnerModelManager();
    this.wwwroot = wwwroot;
    console.log(this.wwwroot);
    new Webcam();
  }
    
}