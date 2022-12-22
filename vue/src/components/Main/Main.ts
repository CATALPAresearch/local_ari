import {defineComponent} from 'vue';
import {EConditionCount, EConditionDate, EMoodleContext, EOperators, ERuleActor, IRule, IRuleCondition, Rules} from '@/tsc/rules';
import Communication from '@scripts/communication';

export default defineComponent({
    name: "Main",
    data () {
        return {
            rulesLoaded: false,
            existingRules: [] as IRule[],
            newRules: [] as IRule[],
            contextFilter: "None",
            executions: [] as any[],
            chosenTimeRangeFilter: null as any,
        }
    },
    mounted: function () {
        this.fetchRules();
        this.fetchAllRuleExecutions();
    },
    methods: {
        fetchAllRuleExecutions()
        {
            // Could also be used with rule id as parameter
            //     const rule = {
            //         rule_id: id
            //     };
            // Communication.webservice("get_rule_execution", {
            //         data: rule,
            Communication.webservice("get_rule_execution", {
                data: {},
            }).then((response) => {
                let json = JSON.parse(response.data);
                Object.keys(json).forEach((key) => {
                    this.executions.push(json[key]);
                });
            }).catch((error) => {
                console.log("Error: ", error);
            });
        },
        getExecutionCount(id: number) : number {
            if(this.chosenTimeRangeFilter != null){
                const chosenDate = new Date(Date.now() - this.chosenTimeRangeFilter * 24 * 60 * 60 * 1000);
                chosenDate.setHours(0, 0, 0, 0);
                return this.executions.filter((execution) => parseInt(execution.rule_id) === id && (execution.execution_date >= chosenDate.getTime()) ).length;
            }
            else {
                return this.executions.filter((execution) => parseInt(execution.rule_id) === id).length;
            }
        },
        getConditionValue: function (condition: IRuleCondition) {
            // TODO check if date or duration
            return ((<any>Object).values(EConditionDate).includes(condition.key) ?
                this.convertTimestampToDate(condition.value) : condition.value)
        },
        convertTimestampToDate: function (timestamp: number) {
            return new Date(timestamp).toDateString();
        },
        fetchRules() {
            this.existingRules = (new Rules()).getAll();
            this.rulesLoaded = true;
        },
        newRule() {
            console.log("newRule");
            let new_rule = (new Rules()).rule_;
            // TODO get from db
            new_rule.id = Math.max(...this.allRules.map((rule) => rule.id)) + 1;
            this.newRules.push(new_rule);
        },
        saveRule(index: number) {
            console.log("saveRule at index " + index);
            // only stored in local copy, TODO: save to db
            console.log(this.newRules.at(index)?.Condition.at(0), this.newRules.at(index)?.Action.text);
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
        },
        timeRangeFilterExecutions() : {name: string, value: any}[]  {
            return [
                {name: "Alle", value: null},
                {name: "Heute", value: 0},
                {name: "Letzte 7 Tage", value: 7},
                {name: "Letzte 30 Tage", value: 30},
                {name: "Seit Semesterbeginn", value:  180},  // TODO get date from semester start
            ]
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
});