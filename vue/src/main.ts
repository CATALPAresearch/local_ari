import Vue from "vue";
// import VueRouter from "vue-router";
//import { store } from "./store";
import App from "./app.vue";
import Communication from "../scripts/communication";

function init() {
    // __webpack_public_path__ = M.cfg.wwwroot + "/local/ari/build/";
    Communication.setPluginName("local_ari");

    new Vue({
        el: "#app",
        //store,
        // router,
        render: (h) => h(App),
    });
}

export { init };
