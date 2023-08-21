import { Controller } from "./controller";

/**
 * 
 * @author Marc Burchart
 * @version 1.0-20200409
 * @description xxx
 * 
 */

export function init(path:string, user_id:number, group_id:number){
	try{	
		new Controller(path, user_id, group_id);
	} catch(error){
		console.log(error);
	}
}