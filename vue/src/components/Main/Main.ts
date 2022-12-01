import {defineComponent} from 'vue';
import { Rules, IRule } from '@/tsc/rules';

export default defineComponent({
    name: "Main",
    data () {
        return {
            rulesLoaded: false,
            allRules: [] as IRule[],
            newRules: [] as IRule[]
        }
    },
    mounted: function () {
        this.fetchRules();
    },
    methods: {
        fetchRules() {
            this.allRules = (new Rules()).getAll();
            console.log(this.allRules);
            this.rulesLoaded = true;
        },
        newRule() {
            console.log("addRule");
            this.newRules.push((new Rules()).rule_);
        },
        saveRule(index: number) {
            console.log("saveRules at index " + index);
            console.log(this.newRules.at(index)?.Condition.at(0)?.key, this.newRules.at(index)?.Action.text);
        },
        editRule(index: number) {
            console.log("editRule at index " + index);
        },
        deleteRule(index: number) {
            console.log("deleteRule at index " + index);
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