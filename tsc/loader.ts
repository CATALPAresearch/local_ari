import { Controller } from "./controller";
import { Config } from "./config";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export function init(){
	try{		
		new Controller(Config);
	} catch(error){
		console.log(error);
	}
}