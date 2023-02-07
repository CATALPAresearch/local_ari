import { defineComponent } from 'vue';
import { EConditionCount, EConditionDate, EMoodleContext, EOperators, ERuleActor, IRule, IRuleCondition, Rules } from '@/tsc/rules';
import Communication from '../../../scripts/communication';

export default defineComponent({
    name: "Main",
    data() {
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
        // Fetch all rule executions from database
        fetchAllRuleExecutions() {
            // Could also be used with rule id as parameter
            // const rule = {
            //     rule_id: id
            // };
            // Communication.webservice("get_rule_execution", {
            //     data: rule,
            // }).then((response) => {
            //     let json = JSON.parse(response.data);
            //     console.log(json);
            // }).catch((error) => {
            //     console.log(error);
            // });
            Communication.webservice("get_rule_execution", {
                data: {},
            }).then((response) => {
                let json = JSON.parse(response.data);
                // format JSON to array
                Object.keys(json).forEach((key) => {
                    this.executions.push(json[key]);
                });
            }).catch((error) => {
                console.log("Error: ", error);
            });
        },

        // Counts the number of rule executions for a rule in a given time range
        getExecutionCount(id: number): number {
            // If filter is set
            if (this.chosenTimeRangeFilter != null) {
                // Get time range as Unix timestamp
                const chosenDate = new Date(Date.now() - this.chosenTimeRangeFilter * 24 * 60 * 60 * 1000);
                chosenDate.setHours(0, 0, 0, 0);
                // Count executions in given time range
                return this.executions.filter((execution) => parseInt(execution.rule_id) === id && (execution.execution_date >= chosenDate.getTime())).length;
            }
            else {
                // Count all executions
                return this.executions.filter((execution) => parseInt(execution.rule_id) === id).length;
            }
        },

        // Get condition as date or numerical value
        getConditionValue: function (condition: IRuleCondition) {
            // TODO check if date or duration
            // If condition is of type date, return date as string, else return numerical value
            return ((<any>Object).values(EConditionDate).includes(condition.key) ?
                this.convertTimestampToDate(condition.value) : condition.value)
        },

        // Convert timestamp to date string
        convertTimestampToDate: function (timestamp: number) {
            return new Date(timestamp).toDateString();
        },

        // Fetch all rules from static typescript file
        fetchRules() {
            // TODO fetch rules from database
            this.existingRules = (new Rules()).getAll();
            this.rulesLoaded = true;
        },

        // Add new rule from template to list of new rules, only local for UI
        newRule() {
            console.log("newRule");
            let newRule = (new Rules()).rule_;
            // TODO get new ID from db
            newRule.id = Math.max(...this.allRules.map((rule) => rule.id)) + 1;
            this.newRules.push(newRule);
        },

        // Save new rule
        saveRule(id: number) {
            console.log("[saveRule] with id " + id + ", database not implemented yet.");

            // get rule and remove it from newRules
            let newRule = this.newRules.splice(this.newRules.findIndex((rule) => rule.id === id), 1);

            // add rule to local copy of existing rules, TODO: remove later when saving to db is implemented, existing rules should be fetched from db
            this.existingRules.push(newRule[0]);

            console.log(newRule);
        },

        // Edit Rule
        editRule(id: number) {
            console.log("[editRule] at id " + id + ", not implemented yet.");

            // get rule and remove it from existingRules
            let ruleToEdit = this.existingRules.splice(this.existingRules.findIndex((rule) => rule.id === id), 1);

            // add rule to local copy of new rules
            this.newRules.push(ruleToEdit[0]);

            console.log(ruleToEdit);
        },

        // Delete Rule
        deleteRule(id: number) {
            console.log("[deleteRule] with id " + id + ", database not implemented yet.");
            this.newRules = this.newRules.filter((rule) => rule.id !== id);

            // TODO remove later, save changes to database if in existingRules
            this.existingRules = this.existingRules.filter((rule) => rule.id !== id);
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
        allRules(): IRule[] {
            return [...this.existingRules, ...this.newRules];
        },
        // Filter rules by context
        ruleInFilter(): IRule[] {
            console.log("chosen filter: " + this.contextFilter);
            return this.contextFilter === "None" ? this.existingRules : this.existingRules.filter((rule) => rule.Action.moodle_context === this.contextFilter);
        },
        // Get all conditions for UI filters
        conditionsKeys(): string[] {
            return (<any>Object).values(EConditionCount).concat((<any>Object).values(EConditionDate));
        },
        timeRangeFilterExecutions(): { name: string, value: any }[] {
            // Array with name and value of time range filter in days
            return [
                { name: "Alle", value: null },
                { name: "Heute", value: 0 },
                { name: "Letzte 7 Tage", value: 7 },
                { name: "Letzte 30 Tage", value: 30 },
                { name: "Seit Semesterbeginn", value: 180 },  // TODO get date from semester start
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