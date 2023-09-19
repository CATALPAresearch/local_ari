// @ts-nocheck

import Vue from "vue";
import Vuex from "vuex";
import {
  ETargetContext,
  EOperators,
  ERuleActor,
  IRule,
  IRuleCondition,
  EActionCategory,
  Rules,
} from "@/tsc/rules";

Vue.use(Vuex);

interface RootState {
  message: string;
}

const state: RootState = {
  message: "olleH",
};

const store = new Vuex.Store({
  state: {
    existingRules: [] as IRule[],
    newRules: [] as IRule[],
  },
  mutations: {
    moveExistingToNewRules(state, id) {
      let ruleToEdit = state.existingRules.splice(
        state.existingRules.findIndex((rule) => rule.id === id),
        1
      );
      this.commit("addNewRule", ruleToEdit[0]);
      return ruleToEdit[0];
    },
    moveNewRuleToExistingRules(state, rule_id) {
      let rule_index: number = state.newRules.findIndex(
        (rule) => (rule.id = rule_id)
      );
      this.commit("addExistingRule", state.newRules[rule_index]);
      this.commit("deleteNewRule", state.newRules[rule_index].id);
    },
    restoreNewRuleToExistingRules(state, rule_id) {
        // TODO restore old rule 
    },
    addNewRule(state, rule) {
      state.newRules = [...state.newRules, rule];
    },
    addEmptyNewRule(state): void {
      let newRule: IRule = {
        id: Math.round(Math.random() * 947),
        title: "<title>",
        isActive: false,
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
    deleteConditionOfNewRule(state, rule_id, condition_id) {
      let rule_index: number = state.newRules.findIndex(
        (rule) => (rule.id = rule_id)
      );
      state.newRules[rule_index].Condition.splice(
        state.newRules[rule_index].Condition.find(
          (condition) => condition.id === condition_id
        ),
        1
      );
    },
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
  },
  actions: {},
  modules: {},
});

export type HelloStore = typeof store; // ??

export default store;
