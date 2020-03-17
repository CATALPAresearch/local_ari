//@ts-ignore
import $ from "jquery"

export function init(){
	try{
		alert("marc");
		$(document).ready(
			function(){
				alert("yes");
			}
		);
	} catch(error){
		console.log(error);
	}
}