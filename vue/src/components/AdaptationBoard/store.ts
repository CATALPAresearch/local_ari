// @ts-nocheck
import Vue from "vue";
import Vuex from "vuex";
import {
  ETargetContext,
  EOperators,
  ERuleActor,
  EActionType,
  ETiming,
  IRule,
  IRuleCondition,
  EActionCategory,
  Rules,
} from "@/tsc/rules";
import Communication from '../../../scripts/communication';

Vue.use(Vuex);

/*
interface RootState {
  message: string;
}

const state: RootState = {
  message: "olleH",
};
*/

const store = new Vuex.Store({
  state: {
    existingRules: [] as IRule[],
    newRules: [] as IRule[],
    backupRules: [] as IRule[],
    course_id: Number,
  },
  mutations: {
    setCourseId(state, course_id:Number){
      state.course_id = course_id;
    },
    moveExistingToNewRules(state, id) {
      let ruleToEdit = state.existingRules.splice(
        state.existingRules.findIndex((rule) => rule.id === id),
        1
      );
      this.commit("addNewRule", ruleToEdit[0]);
      this.commit("addBackupRule", ruleToEdit[0]);
      return ruleToEdit[0];
    },
    moveNewRuleToExistingRules(state, rule_id) {
      let rule_index:number = state.newRules.findIndex(
        (rule) => (rule.id = rule_id)
      );
      if(rule_index != undefined){
        this.dispatch('saveRule', state.newRules[rule_index]);
        this.commit("addExistingRule", state.newRules[rule_index]);
        this.commit("deleteNewRule", state.newRules[rule_index].id);
        this.commit("deleteBackupRule", rule_index);
      }
    },
    restoreNewRuleToExistingRules(state, rule_id) {
      let rule_index:number = rule_id;

      if(rule_index != undefined){
        this.commit("addExistingRule", JSON.parse(state.backupRules[rule_index]));
        this.commit("deleteNewRule", rule_index);
        this.commit("deleteBackupRule", state.backupRules[rule_index].id);
      }
    },
    addNewRule(state, rule) {
      state.newRules = [...state.newRules, rule];
    },
    addBackupRule(state, rule) {
      state.backupRules[rule.id] = JSON.stringify(rule);
    },
    addEmptyNewRule(state): void {
      let newRule: IRule = {
        id: Math.round(Math.random() * 947),
        title: "<title>",
        is_active: false,
        isPerSectionRule: false, // apply rule on every section of the course
        perType: [EActionCategory.COMPETENCY], // apply rule to all activities of this type
        Condition: [] as IRuleCondition,
        Action: [] as IRuleAction,
      } as IRule;
      this.commit("addNewRule", newRule);
    },
    deleteNewRule(state, id) {
      state.newRules.splice(
        state.newRules.findIndex((rule) => rule.id === id),
        1
      );
    },
    deleteBackupRule(state, id) {
      if(state.backupRules[id]){
        delete state.backupRules[id];
      }else{
        console.log('Tried to delete a rules in backupRules that does not exist.')
      }
      
    },

    createExistingRules(state, rules) {
      state.existingRules = rules;
    },
    addExistingRule(state, rule) {
      state.existingRules.push(rule);
    },
    updateExistingRule(state, id) {
      // TOOD: Not yet implemented
      return id; // state.existingRules.find((rule) => rule.id === id);
    },
    deleteExistingRule(state, id) {
      state.existingRules.splice(
        state.existingRules.findIndex((rule) => rule.id === id),
        1
      );
    },
    createConditionOfNewRule(state, rule_id) {
      // @ts-ignore comment
      let rule_index: number = state.newRules.findIndex(
        (rule) => (rule.id = rule_id)
      );
      if (state.newRules[rule_index].Condition != null) {
        let newCondition: IRuleCondition = {
          id: Math.round(Math.random() * 947),
          source_context: "mod_safran",
          key: "lm.x",
          value: 0,
          operator: EOperators.Equal,
        } as IRuleCondition;
        state.newRules[rule_index].Condition = [
          ...state.newRules[rule_index].Condition,
          newCondition,
        ];
        state.newRules = [...state.newRules];
      }
    },
    createActionOfNewRule(state, rule_id) {
        // @ts-ignore comment
        let rule_index: number = state.newRules.findIndex(
          (rule) => (rule.id = rule_id)
        );
        if (state.newRules[rule_index].Action != null) {
          let newAction: IRuleAction = {
            id: Math.round(Math.random() * 947),
            actor: ERuleActor.StoredPrompt,
            type: EActionType.SCOME_COURSE_UNIT,
            category: EActionCategory.COMPETENCY,
            action_title: '',
            action_text: '',
            augmentations: [] as EActionAugmentation[],
            target_context: ETargetContext.COURSE_OVERVIEW_PAGE,
            moodle_course?: 2, // FIXIT THIS
            dom_content_selector: "",
            dom_indicator_selector: "",
            viewport_selector: "", 
            timing: ETiming.NOW,
            delay: 0,
            priority: 0,
            repetitions: 0,
          } as IRuleAction;
          state.newRules[rule_index].Action = [
            ...state.newRules[rule_index].Action,
            newAction,
          ];
          state.newRules = [...state.newRules];
        }
      },
    deleteConditionOfNewRule(state, rule_id, condition_id) {
      let rule_index: number = state.newRules.findIndex(
        (rule) => (rule.id = rule_id)
      );
      state.newRules[rule_index].Condition.splice(
        state.newRules[rule_index].Condition.findIndex(
          (condition) => condition.id === condition_id
        ),
        1
      );
    },
    deleteActionOfNewRule(state, rule_id, action_id) {
        let rule_index: number = state.newRules.findIndex(
          (rule) => (rule.id = rule_id)
        );
        state.newRules[rule_index].Action.splice(
          state.newRules[rule_index].Action.findIndex(
            (action) => action.id === action_id
          ),
          1
        );
      },
      splitContextAndKey(state, payload){
        let rule_index:number = state.newRules.findIndex(
          (rule) => rule.id === payload.rule_id
        );
        
        let cond_index:number = state.newRules[rule_index].Condition.findIndex(
            (condition) => condition.id === payload.condition_id
        );
        let sp:Array = payload.event.target.value.split('.');
        console.log(payload.rule_id, rule_index, sp, cond_index)
        state.newRules[rule_index].Condition[cond_index].source_context = sp[1] != undefined ? sp[1] : '';
        state.newRules[rule_index].Condition[cond_index].key = sp[2] != undefined ? sp[2] : '';
    }
      
  },
  getters: {
    existingRules(state) {
      return state.existingRules;
    },
    existingRule(state, id) {
      return state.existingRules.find((rule) => rule.id === id);
    },
    newRules(state) {
      return state.newRules;
    },
    /*getNewRuleById(state, id){
      return state.newRules.find((rule) => rule.id === id);
    }*/
  },
  actions: {
    async saveRule(state, rule:IRule){
      console.log('tried to save rule', rule.course_id, rule.id, rule.Condition[0])
      await Communication.webservice("set_rules", {
          data: { 
            course_id: rule.course_id,
            rule: JSON.stringify(rule) 
          }, 
      }).then((response:any) => {
          console.log('Saved rule to DB: ', response.data)
      }).catch((error) => {
          console.error("Error in set_rules webservice. ", error);
      });
    }
  },
  modules: {},
});

//export type HelloStore = typeof store; // ??

export default store;
