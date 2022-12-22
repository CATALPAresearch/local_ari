import {defineComponent} from 'vue';
import {EConditionCount, EConditionDate, EMoodleContext, EOperators, ERuleActor, IRule, IRuleCondition, Rules} from '@/tsc/rules';

export default defineComponent({
    name: "Main",
    data () {
        return {
            rulesLoaded: false,
            existingRules: [] as IRule[],
            newRules: [] as IRule[],
            contextFilter: "None",
        }
    },
    mounted: function () {
        console.log(this.contextFilter);
        this.fetchRules();
    },
    methods: {
        getConditionValue: function (condition: IRuleCondition) {
            // TODO check if date or duration
            return ((<any>Object).values(EConditionDate).includes(condition.key) ?
                this.convertTimestampToDate(condition.value) : condition.value)
        },
        convertTimestampToDate: function (timestamp: number) {
            console.log(timestamp);
            return new Date(timestamp).toDateString();
        },
        fetchRules() {
            this.existingRules = (new Rules()).getAll();
            console.log(this.existingRules);
            this.rulesLoaded = true;
        },
        newRule() {
            console.log("newRule");
            let new_rule = (new Rules()).rule_;
            // TODO get new id from db
            new_rule.id = Math.max(...this.allRules.map((rule) => rule.id)) + 1;
            this.newRules.push(new_rule);
        },
        saveRule(index: number) {
            console.log("saveRule at index " + index + ", not implemented yet.");
            // only stored in local copy, TODO: save to db
            let new_rule = this.newRules.find((rule) => rule.id === index);
            console.log(new_rule);
        },
        editRule(index: number) {
            console.log("[editRule] at index " + index + ", not implemented yet.");
        },
        deleteRule(index: number) {
            console.log("deleteRule at index " + index);
            this.newRules = this.newRules.filter((rule) => rule.id !== index);
            this.existingRules = this.existingRules.filter((rule) => rule.id !== index);
        }
    },
    computed: {
        operators() {
            return EOperators;
        },
        contexts() {
            return EMoodleContext;
        },
        actors() {
            return ERuleActor;
        },
        allRules() : IRule[] {
            return [...this.existingRules, ...this.newRules];
        },
        ruleInFilter() : IRule[] {
            console.log("chosen filter: " + this.contextFilter);
            return this.contextFilter === "None" ? this.existingRules : this.existingRules.filter((rule) => rule.Action.moodle_context === this.contextFilter);
        },
        conditionsKeys() : string[] {
            return (<any>Object).values(EConditionCount).concat((<any>Object).values(EConditionDate));
        }
        /*
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