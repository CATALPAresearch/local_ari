import App from "./app.vue";
import { createApp } from 'vue';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
//import { store } from './store';
import { initStore } from './stores';

//import mainPage from './components/_main';
import notFound from './components/notfound';
//import storePage from './components/_store';
import compTest from './components/test';

//import Communication from './scripts/communication';

function init() {
    // We need to overwrite the variable for lazy loading.
    __webpack_public_path__ = M.cfg.wwwroot + '/local/ari/amd/build/';

    //Communication.setPluginName(fullPluginName);
    const store = initStore({})
    /*const store = initStore({ name: 'xxx' });
    store.commit('setConfigValue', someConfig);
    store.commit('setPluginName', fullPluginName);
    store.commit('setCourseModuleID', coursemoduleid);
    store.commit('setContextID', contextid);
    store.commit('setModerator', isModerator);
    store.dispatch('loadComponentStrings');
*/
    // base URL is /mod/vuejsdemo/view.php/[course module id]/
    const currenturl = window.location.pathname;
    // const base = currenturl.substring(0, currenturl.indexOf('.php')) + '.php/'));
    // You have to use child routes if you use the same component. Otherwise the component's beforeRouteUpdate
    // will not be called.
    const router = createRouter({
        history: createWebHistory(currenturl),
        routes: [
            { path: '/', component: compTest },
          //  { path: '/store/:id', component: storePage },
         { path: '/:pathMatch(.*)', component: notFound },
        ]
    });


    router.beforeEach((to, from, next) => {
        // Find a translation for the title.
        if (to.hasOwnProperty('meta') && to.meta.hasOwnProperty('title')) {
            if (store.state.strings.hasOwnProperty(to.meta.title)) {
                document.title = store.state.strings[to.meta.title];
            }
        }
        next()
    });

    try {
        const app = createApp(App);
        app.use(router);
        app.use(store);
        app.mount("#app");
    } catch (e) {
        /* eslint-disable no-console */
        console.error(e);
    }
    /*
    {
        el: '#app',
        store,
        router,
        render: (h) => h(App),
    }
    */

}

export { init };
