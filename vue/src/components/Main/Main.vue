<template>
  <div id="content">
    <div class="mb-3" id="tools">
      <span class="mr-3">
        <label for="context-filter">Context filter</label>
        <select class="filter-select" v-model="contextFilter" name="context-filter" id="context-filter">
          <option value="None">All</option>
          <option v-for="context in contexts" :value="context">{{ context }}</option>
        </select>
      </span>
      <span class="mr-3">
        <label for="time-range-filter-executions">Executions</label>
        <select class="filter-select" v-model="chosenTimeRangeFilter" name="time-range-filter-executions" id="time-range-filter-executions">
          <option v-for="range in timeRangeFilterExecutions" :value="range.value">{{ range.name }}</option>
        </select>
      </span>
    </div>
    <div id="loadingIndicator" v-if="!rulesLoaded">
      <span>loading...</span>
    </div>
    <table id="table_nav" v-if="rulesLoaded">
      <tr>
        <th>ID</th>
        <th>Active</th>
        <th>Title</th>
        <th>Executions</th>
        <th class="p-0 m-0">Conditions</th>
        <th>Actions</th>
      </tr>
      <tr v-for="rule in ruleInFilter" :key="rule.id">
        <th class="align-text-top">{{ rule.id }}</th>
        <th class="align-text-top"><input type="checkbox" v-model="rule.active"></th>
        <td class="align-text-top">{{ rule.title }}</td>
        <td class="align-text-top text-center">
          {{ getExecutionCount(rule.id) }}
        </td>
        <td class="align-text-top">
          <ol class="p-0 m-0">
            <li v-for="(condition, condInd) in rule.Condition">
              <b hidden>{{ condInd }}:</b>
              {{ condition.key }}
              {{ condition.operator }}
              {{ getConditionValue(condition) }}
            </li>
          </ol>
        </td>
        <td class="align-text-top">
          <b>Method:</b> {{ rule.Action.method }} <br>
          <b>Context:</b> {{ rule.Action.moodle_context }} <br>
          <b>Text:</b> {{ rule.Action.text }}
        </td>
        <td class="align-text-bottom">
          <button class="btn btn-light" @click="editRule(rule.id)">edit</button>
          <button hidden class="btn btn-light" @click="deleteRule(rule.id)">delete</button>
        </td>
      </tr>
      <tr style="background-color: lightblue;" v-for="rule in newRules" :key="rule.id">
        <th class="align-text-top">{{ rule.id }}</th>
        <th class="align-text-top"><input type="checkbox" v-model="rule.active"></th>
        <td class="align-text-top"><input v-model="rule.title"></td>
        <td></td>
        <td>
          <ol class="p-0 m-0">
            <li class="mb-2" v-for="(condition, condInd) in rule.Condition">
              <b hidden>{{ condInd }}:</b>
              <select class="filter-select-edit" name="condition_key" id="condition_key" v-model="condition.key">
                <option v-for="condition_key in conditionsKeys" :value="condition_key">{{ condition_key }}</option>
              </select>
              <select class="filter-select-edit" name="condition_operator" id="condition_operator" v-model="condition.operator">
                <option v-for="operator in operators" :value="operator">{{ operator }}</option>
              </select>
              <input v-model="condition.value">
            </li>
          </ol>
        </td>
        <td>
          <span class="row mb-2">
            <b class="col-2">Method:</b>
            <select class="filter-select-edit col-6" name="action_actor" id="action_actor" v-model="rule.Action.method">
              <option v-for="actor in actors" :value="actor">{{ actor }}</option>
            </select>
          </span>
          <span class="row mb-2">
            <b class="col-2">Context:</b>
            <select class="filter-select-edit col-6" name="action_context" id="action_context" v-model="rule.Action.moodle_context">
              <option v-for="context in contexts" :value="context">{{ context }}</option>
            </select>
          </span>  
          <span class="row mb-2">
            <b class="col-2">Text:</b>
            <textarea class="col-8 action-text" v-model="rule.Action.text"></textarea>
          </span>
        </td>
        <td>
          <button class="btn btn-primary" @click="saveRule(rule.id)">save</button>
          <button style="color:red;" class="btn btn-link" @click="deleteRule(rule.id)">delete</button>
        </td>
      </tr>
    </table>
    <button class="btn btn-info" @click="newRule()">+ add new rule</button>
  </div>
</template>

<script lang="ts" src="./Main.ts"></script>


<style scoped>
#table_nav {
  border-collapse: collapse;
  width: 100%;
}

#table_nav th,
td {
  text-align: left;
  padding: 8px;
}

#table_nav tr:nth-child(even) {
  background-color: #f2f2f2;
}

.filter-select {
  background-color: lightblue;
}
.filter-select-edit {
  color:#f2f2f2;
  background-color: #336699;
}

.action-text{
  padding:2px;
}
</style>