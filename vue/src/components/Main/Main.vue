<template>
  <div id="content">
    <div id="loadingIndicator" v-if="!rulesLoaded">
      <span>loading...</span>
    </div>
    <table id="table_nav" v-if="rulesLoaded">
      <tr>
        <th>Rule</th>
        <th>Condition</th>
        <th>Action</th>
      </tr>
      <tr v-for="(rule, ruleInd) in allRules">
        <th>{{ ruleInd }}</th>
        <td id="rule-name">
          <ul>
            <li v-for="(condition, condInd) in rule.Condition">
              {{ condInd }}: {{ condition.context }}, {{ condition.key }}, {{ condition.operator }}
            </li>
          </ul>
        </td>
        <td id="rule-action-text">
          {{ rule.Action.text }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts" src="./Main.ts"></script>
<style scoped></style>