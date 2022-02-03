
/*

Brachen wir aktuell noch nicht.
*/
export default {
    state: {
        namex: 'Mein Test'
    },
    //strict: process.env.NODE_ENV !== 'production',
    mutations: {
        setName(state, name) {
            state.pluginName = name;
        },
        
    },
    getters: {
        getName: function (state) {
            return state.name;
        }
    },
    actions: {
        
    }
}

