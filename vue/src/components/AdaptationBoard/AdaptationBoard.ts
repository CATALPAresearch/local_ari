
import { defineComponent } from 'vue';
import { ETargetContext, EOperators, ERuleActor, IRule, IRuleCondition, Rules, EActionType, EActionCategory, EActionAugmentation, ETiming } from '@/tsc/rules';
import Communication from '../../../scripts/communication';
import { RuleManager } from '@/tsc/rule_manager';

import { mapGetters, mapMutations } from 'vuex'
import store  from "./store";
import 'vue-multiselect/dist/vue-multiselect.min.css';

import Multiselect from 'vue-multiselect';
//Vue.component('multiselect', Multiselect)

export default defineComponent({
    name: "AdaptationBoard",
    
    data() {
        return {
            selected: null,
            rulesLoaded: false,
            contextFilter: "None",
            executions: [] as any[],
            chosenTimeRangeFilter: null as any,
            show:false,
        }
    },
    mounted: function ():void {
        this.$store.commit('setCourseId', 0);
        console.log('board ', 1);
        // @ts-expect-error
        this.fetchRules();
        console.log('board ', 2);
        // @ts-expect-error
        this.fetchAllRuleExecutions();
    },

    store: store as any,

    components: {
        Multiselect: Multiselect
      },
    

    methods: {
        // Fetch all rule executions from database
        fetchAllRuleExecutions():void {
            Communication.webservice("get_rule_execution", {
                data: {},
            }).then((response) => {
                let json = JSON.parse(response.data);
                this.executions = json;
                //Object.keys(json).forEach((key) => {
                    //this.executions.push(json[key]);
                //});
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
            return this.executions[id] ? this.executions[id].count : 0;
            
        },

        // Get condition as date or numerical value
        getConditionValue: function (condition: IRuleCondition):any {
            // TODO check if date or duration
            //return ((<any>Object).values(EConditionDate).includes(condition.key) ? this.convertTimestampToDate(condition.value) : condition.value)
            return condition.value;
        },

        // Convert timestamp to date string
        convertTimestampToDate: function (timestamp: number):string {
            return new Date(timestamp).toDateString();
        },

        // Fetch all rules from static typescript file
        fetchRules: function() {
            store.commit('createExistingRules', (new Rules()).getAll());
            this.rulesLoaded = true;
        },

        // Edit Rule
        editRule(id: number):void {
            console.log("[editRule] with id " + id );
            let ruleToEdit = store.commit('moveExistingToNewRule', id);
            console.log(ruleToEdit);
        },

        
    },
    computed: {
        ...mapGetters([]),
        ...mapMutations(['setCourseId']),

        operators() {
            return EOperators;
        },
        action_target_context() {
            return ETargetContext;
        },
        action_actors() {
            return ERuleActor;
        },
        action_type() {
            return EActionType;
        },
        action_category() {
            return EActionCategory;
        },
        action_augmentation() {
            return Object.values(EActionAugmentation);
        },
        action_timing() {
            return ETiming;
        },
        ruleInFilter(): IRule[] {
            console.log("chosen filter: " + this.contextFilter);
            return this.contextFilter === "None" ? store.getters.existingRules : store.getters.filter((rule) => rule.Action.some(mc => mc.target_context === this.contextFilter));
        },
        advancedActionOptions(id:number):Boolean{
            return this.advancedActionOptions[id];
        },
        // Get all conditions for UI filters
        conditionsKeys(): string[] {
            return RuleManager.getNestedKeys(RuleManager.lm, 'lm');
        },
        timeRangeFilterExecutions(): { name: string, value: any }[] {
            // Array with name and value of time range filter in days
            return [
                { name: "all", value: null },
                { name: "today", value: 0 },
                { name: "last 7 days", value: 7 },
                { name: "last 30 days", value: 30 },
                { name: "since semester start", value: 180 },  // TODO get date from semester start
            ]
        }
    }
});