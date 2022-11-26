import {defineComponent} from 'vue';
import { Rules, IRule } from '@/tsc/rules';

export default defineComponent({
    name: "Main",
    data () {
        return {
            myVar: true,
            myVar2: 42,
            rulesLoaded: false,
            allRules: [] as IRule[]
        }
    },
    mounted: function () {
        this.fetchRules();
    },
    methods: {
        fetchRules() {
            // this.allRules = [{name: "Rule 1"}, {name: "Rule 2"}]
            this.allRules = (new Rules()).getAll();
            console.log(this.allRules);
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