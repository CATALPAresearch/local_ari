import { Controller } from "./controller";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export function init(path:string){
	try{	
		new Controller();
	} catch(error){
		console.log(error);
	}
}