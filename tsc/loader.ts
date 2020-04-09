import { Controller } from "./controller";
import { Config } from "./config";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export function init(path:string){
	try{	
		new Controller(Config, path);
	} catch(error){
		console.log(error);
	}
}