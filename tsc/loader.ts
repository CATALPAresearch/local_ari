//@ts-ignore
import $ from "jquery"
import { Notification, INotification, ENotificationType } from "./messages";
import { CSS, ICSS } from "./styles";

export function init(){
	try{		
		$(document).ready(
			function(){
				let data = <ICSS>{selector: "body", properties: {"background-color": "red"}};
				let css = new CSS(data);
				alert(css.validate());
				css.run();
			}
		);
	} catch(error){
		console.log(error);
	}
}