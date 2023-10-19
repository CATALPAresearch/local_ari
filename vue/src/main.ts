import Vue from "vue";
import AdaptationDashboardApp from "./adaptationBoardApp.vue";
import Communication from "../scripts/communication";
import { Controller } from "./tsc/controller";


function initAdaptationDashboard() { 
    // __webpack_public_path__ = M.cfg.wwwroot + "/local/ari/build/";
    Communication.setPluginName("local_ari");
    console.log('board ', 0);
    new Vue({ el: "#adaptationDashboardApp", render: (h) => h(AdaptationDashboardApp) });
}

function initAdaptations(path:string, user_id:number, course_id:number){
    if(user_id == null){
        return;
    }
    if(course_id == null){
        course_id = 0;
    }
    
	try{	
		new Controller(path, user_id, course_id);
	} catch(error){
		console.error('Could not initiate the ARI controler at main.ts. ', error);
	}
}

export { initAdaptationDashboard };
export { initAdaptations };
