
/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description A Skript to handle Service- and Webworker.
 * 
 */

import { ServiceWorker } from "./core_worker";

export class PushNotification extends ServiceWorker{
    constructor(){
        super(".");
    }
}