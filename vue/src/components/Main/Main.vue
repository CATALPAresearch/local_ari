<template>
  <div id="content">
    <div id="tools">
      <button @click="newRule()">+</button>
      <label for="context-filter">Context filter</label>
      <select v-model="contextFilter" name="context-filter" id="context-filter">
        <option value="None">All</option>
        <option v-for="context in contexts" :value="context">{{ context }}</option>
      </select>

      <label for="time-range-filter-executions">Executions</label>
      <select v-model="chosenTimeRangeFilter" name="time-range-filter-executions" id="time-range-filter-executions">
        <option v-for="range in timeRangeFilterExecutions" :value="range.value">{{ range.name }}</option>
      </select>
    </div>
    <div id="loadingIndicator" v-if="!rulesLoaded">
      <span>loading...</span>
    </div>
    <table id="table_nav" v-if="rulesLoaded">
      <tr>
        <th></th>
        <th>Active</th>
        <th>Title</th>
        <th>Executions</th>
        <th>Condition</th>
        <th>Action</th>
      </tr>
      <tr v-for="rule in ruleInFilter" :key="rule.id">
        <th>{{ rule.id }}</th>
        <th><input type="checkbox" v-model="rule.active"></th>
        <td>{{ rule.title }}</td>
        <td>
          {{ getExecutionCount(rule.id) }}
        </td>
        <td>
          <ul>
            <li v-for="(condition, condInd) in rule.Condition">
              <b>{{ condInd }}:</b>
              {{ condition.key }}
              {{ condition.operator }}
              {{ getConditionValue(condition) }}
            </li>
          </ul>
        </td>
        <td>
          <b>Method:</b> {{ rule.Action.method }} <br>
          <b>Context:</b> {{ rule.Action.moodle_context }} <br>
          <b>Text:</b> {{ rule.Action.text }}
        </td>
        <td>
          <button @click="editRule(rule.id)">edit</button>
          <button @click="deleteRule(rule.id)">delete</button>
        </td>
      </tr>
      <tr v-for="rule in newRules" :key="rule.id">
        <th>{{ rule.id }}</th>
        <th><input type="checkbox" v-model="rule.active"></th>
        <td><input v-model="rule.title"></td>
        <td>
          <ul>
            <li v-for="(condition, condInd) in rule.Condition">
              <b>{{ condInd }}:</b>
              <select name="condition_key" id="condition_key">
                <option v-for="(condition_key) in conditionsKeys" :value="condition.key">{{ condition_key }}</option>
              </select>
              <select name="operator" id="operators">
                <option v-for="(operator) in operators" :value="condition.operator">{{ operator }}</option>
              </select>
              <input v-model="condition.value">
            </li>
          </ul>
        </td>
        <td>
          <b>Method:</b>
          <select name="condition_actor" id="condition_actor">
            <option v-for="(actor) in actors" :value="rule.Action.method">{{ actor }}</option>
          </select><br>
          <b>Context:</b>
          <select name="condition_context" id="condition_context">
            <option v-for="(context) in contexts" :value="rule.Action.moodle_context">{{ context }}</option>
          </select><br>
          <b>Text:</b> <input v-model="rule.Action.text">

        </td>
        <td>
          <button @click="saveRule(rule.id)">save</button>
          <button @click="deleteRule(rule.id)">delete</button>
        </td>
      </tr>
    </table>
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