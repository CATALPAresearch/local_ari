/**
 * @author Marc Burchart
 * @version 1.0.0
 * @description The Controller
 */

import Controller from "./controller";

export function init(){
    try{
        new Controller();
    } catch(error){
        console.log(error);
    }    
}