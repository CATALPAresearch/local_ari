<template>
  <div id="content">
    <div id="loadingIndicator" v-if="!rulesLoaded">
      <span>loading...</span>
    </div>
    <div id="content" v-if="rulesLoaded">
      <div id="tools">
        <button @click="newRule()">+</button>
      </div>
      <table id="table_nav">
        <tr>
          <th></th>
          <th>Condition</th>
          <th>Action</th>
        </tr>
        <tr v-for="(rule, ruleInd) in allRules">
          <th>{{ ruleInd+1 }}</th>
          <td id="rule-name">
            <ul>
              <li v-for="(condition, condInd) in rule.Condition">
                {{ condInd }}: {{ condition.key }}, {{ condition.value }}, {{ condition.operator }}
              </li>
            </ul>
          </td>
          <td id="rule-action-text">
            {{ rule.Action.text }}
          </td>
          <td>
            <button @click="editRule(ruleInd)">edit</button>
            <button @click="deleteRule(ruleInd)">delete</button>
          </td>
        </tr>
        <tr v-for="(rule, ruleInd) in newRules">
          <th>{{ ruleInd+allRules.length+1 }}</th>
          <td>
            <ul>
              <li v-for="(condition, condInd) in rule.Condition">
                {{ condInd }}:
                <input v-model="condition.key">,
                <input v-model="condition.value">,

                <label for="operator">Operator</label>
                <select name="operator" id="operators">
                  <option v-for="(operator) in operators" :value="condition.operator">{{ operator }}</option>
                </select>
              </li>
            </ul>
          </td>
          <td>
            <input v-model="rule.Action.text">
          </td>
          <td>
            <button @click="saveRule(ruleInd)">save</button>
            <button @click="deleteRule(ruleInd)">delete</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts" src="./Main.ts"></script>
<style scoped>
#table_nav {
  border-collapse: collapse;
  width: 100%;
}
#table_nav th, td {
  text-align: left;
  padding: 8px;
}
#table_nav tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>