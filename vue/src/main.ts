import Vue from "vue";
//import VueRouter from "vue-router";
//import { store } from "./store";
import AdaptationDashboardApp from "./adaptationBoardApp.vue";
import PromptPanelApp from "./promptPanelApp.vue";
import Communication from "../scripts/communication";
import { Controller } from "./tsc/controller";

function initAdaptationDashboard() {
    // __webpack_public_path__ = M.cfg.wwwroot + "/local/ari/build/";
    Communication.setPluginName("local_ari");
    new Vue({ el: "#adaptationDashboardApp", render: (h) => h(AdaptationDashboardApp) });
}

function initPromptPanel() {
    // __webpack_public_path__ = M.cfg.wwwroot + "/local/ari/build/";
    Communication.setPluginName("local_ari");
    new Vue({ el: "#promptPanelApp", render: (h) => h(PromptPanelApp) });
    
}

function initAdaptations(path:string){
	try{	
		new Controller(path);
	} catch(error){
		console.log(error);
	}
}

export { initAdaptationDashboard };
export { initPromptPanel };
export { initAdaptations };
