import Vue from "vue";
//import VueRouter from "vue-router";
//import { store } from "./store";
import AdaptationDashboardApp from "./adaptationBoardApp.vue";
import Communication from "../scripts/communication";
import { Controller } from "./tsc/controller";


function initAdaptationDashboard() {
    // __webpack_public_path__ = M.cfg.wwwroot + "/local/ari/build/";
    Communication.setPluginName("local_ari");
    new Vue({ el: "#adaptationDashboardApp", render: (h) => h(AdaptationDashboardApp) });
    
}

/*function initPromptPanel() {
    // __webpack_public_path__ = M.cfg.wwwroot + "/local/ari/build/";
    Communication.setPluginName("local_ari");
}*/

function initAdaptations(path:string, user_id:number, course_id:number){
    console.log(user_id, course_id);
    if(user_id == null){
        return;
    }
    if(course_id == null){
        course_id = 0;
    }
    
	try{	
		new Controller(path, user_id, course_id);
	} catch(error){
		console.log(error);
	}
}

export { initAdaptationDashboard };
//export { initPromptPanel };
export { initAdaptations };
