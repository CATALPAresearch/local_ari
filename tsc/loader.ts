import { Controller } from "./controller";
import { Config } from "./config";

export function init(){
	try{		
		new Controller(Config);
	} catch(error){
		console.log(error);
	}
}