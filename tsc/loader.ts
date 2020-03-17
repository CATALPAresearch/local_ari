import Controller from "./controller";
import { Config } from "./config";

export function init(){
    try{
        console.log("init ari");
        new Controller(Config);
    } catch(error){
        console.log(error);
    }
}