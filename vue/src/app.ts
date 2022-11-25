import { defineComponent } from 'vue';
// import {Rules} from "../tsc/rules";

export default defineComponent({
    data: function ()
    {
        return {
            myVar: true,
            myVar2: 42,
            rulesLoaded: true, //false,
            allRules: [{name: "Rule 1"}, {name: "Rule 2"}] //[]
        }
    },
    mounted: function () {
        this.fetchRules();
    },
    methods: {
        fetchRules() {
            // this.allRules = (new Rules()).getAll();
            this.rulesLoaded = true;
        }
    },
    computed: {/*
            alertType: function(){
                return this.$store.getters.getAlertType;
            },
            showAlert: function(){
                return this.$store.getters.getAlertState;
            },
            alertMessage: function(){
                return this.$store.getters.getAlertMessage;
            }*/
    }
})
