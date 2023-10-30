

<template>
  <div id="content">
    <div hidden class="testbed">Getterer form store {{ $store.getters.newRules }}</div>
    <div class="mb-3" id="tools">
      <span class="mr-3">
        <label for="context-filter">Context filter</label>
        <select class="form-select filter-select-edit" v-model="contextFilter" name="context-filter" id="context-filter">
          <option value="None">All</option>
          <option v-for="context in contexts" :value="context">{{ context }}</option>
        </select>
      </span>
      <span class="mr-3">
        <label for="time-range-filter-executions">Executions</label>
        <select class="filter-select filter-select-edit" v-model="chosenTimeRangeFilter" name="time-range-filter-executions"
          id="time-range-filter-executions">
          <option v-for="range in timeRangeFilterExecutions" :value="range.value">{{ range.name }}</option>
        </select>
      </span>
    </div>
    <div id="loadingIndicator" v-if="!rulesLoaded">
      <span>loading...</span>
    </div>
    <table id="table_nav" v-if="rulesLoaded">
      <tr>
        <th>Active</th>
        <th>Title</th>
        <th>Executions</th>
        <th class="p-0 m-0">Conditions</th>
        <th>Actions</th>
      </tr>
      <tr v-for="rule in ruleInFilter" :key="rule.id">
        <th class="align-text-top"><input type="checkbox" v-model="rule.is_active" /></th>
        <td class="align-text-top">
          {{ rule.title }}
          <div>(ID: {{ rule.id }})</div>
          <div v-if="rule.isPerSectionRule">
            <span><i class="fa fa-check pr-1"></i>Applied to each section</span>
          </div>
        </td>
        <td class="align-text-top text-center">
          {{ getExecutionCount(rule.id) }}
        </td>
        <td class="align-text-top">
          <ol class="p-0 m-0">
            <li v-for="(condition, condInd) in rule.Condition">
              <b hidden>{{ condInd }}:</b>
              {{ 'lm.'+condition.source_context+'.'+condition.key }}
              {{ condition.operator }}
              {{ getConditionValue(condition) }}
            </li>
          </ol>
        </td>
        <td class="align-text-top">
          <!-- 
            {{ rule.Action }}
          -->
          <ol class="p-0 m-0">
            <li v-for="(action, actInd) in rule.Action">
              <div>
                <b hidden>{{ actInd }}:</b>
                <b>{{ action.action_title }}</b>
                <span class="tag tag-type"
                  title="Action Type: Referes to the scope of the action (course, course unit, activity type, individual activity, or next step).">{{
                    action.type }}</span>
                <span class="tag tag-category"
                  title="Category: Referes to the dimension of self-regulated learning support (e.g. timemanagement, learning progress, learning success, social interactions, ...).">{{
                    action.category }}</span>
              </div>
              <div class="row">
                <span class="col-2">Method:</span>
                <span class="col-10">{{ action.actor }} @ {{ action.target_context }}</span>
              </div>
              <div class="row">
                <span class="col-2">Text:</span>
                <span class="col-10">{{ action.action_text }}</span>
              </div>
            </li>
          </ol>
        </td>
        <td class="align-text-bottom">
          <button class="btn btn-light align-text-bottom"
            @click="$store.commit('moveExistingToNewRules', rule.id)">edit</button>
          <button hidden class="btn btn-light align-text-bottom"
            @click="$store.commit('deleteExistingRule', rule.id)">delete</button>
        </td>
      </tr>
      <tr class="edit-mode" v-for="rule in $store.getters.newRules" :key="rule.id">
        <th class="align-text-top">
          <input type="checkbox" v-model="rule.is_active">
        </th>
        <td class="align-text-top">
          <input v-model="rule.title" class="form-input-text"><br />(ID: {{ rule.id }})<br>Apply to each sections? <input type="checkbox" v-model="rule.isPerSectionRule" />
        </td>
        <td></td>
        <td class="align-text-top">
          <ol class="p-0 m-0">
            <li class="mb-2" v-for="(condition, condInd) in rule.Condition">
              <b hidden>{{ condInd }}:</b>
              <select 
                class="filter-select-edit w-100 form-select" 
                title="Select a key from the Learner Model" 
                name="condition_key"
                id="condition_key" 
                @change="$store.commit('splitContextAndKey', {event:$event, rule_id: rule.id, condition_id: condition.id})" 
                >
                <option v-for="condition_key in conditionsKeys" 
                  :value="condition_key"
                  :selected="'lm.'+condition.source_context+'.'+condition.key == condition_key ? 'selected' : ''"
                  >
                  {{ condition_key }}</option>
              </select><br>
              <select class="filter-select-edit w-25 form-select"
                title="Select an operator for comparing the Learner Model key with the value" name="condition_operator"
                id="condition_operator" v-model="condition.operator">
                <option v-for="operator in operators" :value="operator">{{ operator }}</option>
              </select>
              <input v-model="condition.value" class="w-50 form-input-text"
                title="Type in a value to compared with the Learniner Model key using the selected operator">
              <button class="btn btn-secondary right" title="Delete condition" @click="$store.commit('deleteConditionOfNewRule', rule.id, condition.id)">
                <i class="fa fa-trash"></i>
              </button>
            </li>
          </ol>
          <div v-if="rule.Condition.length == 0">
            <button class="btn btn-secondary" title="Add a condition to the rule"
            @click="$store.commit('createConditionOfNewRule', rule.id)"><i class="fa fa-plus"> Add condition</i>
            </button>
          </div>
          <button v-if="rule.Condition.length > 0" class="btn btn-secondary" title="Add a condition to the rule"
            @click="$store.commit('createConditionOfNewRule', rule.id)"><i class="fa fa-plus"></i>
          </button>
        </td>
        <td class="align-text-top">
          <ol class="p-0 m-0">
            <li class="mb-2" v-for="(action, actInd) in rule.Action">
              <b hidden>{{ actInd }}:</b>
              <span class="row mb-2">
                  <b class="col-2">Title:</b>
                  <input v-model="action.action_title" id="action_title"
                    name="action_title" class="form-input-text" />
                  <button class="btn btn-secondary right" title="Delete action" @click="$store.commit('deleteActionOfNewRule', rule.id, action.id)">
                  <i class="fa fa-trash"></i>
                </button>
                </span>
              <span class="row mb-2">
                <b class="col-2">Method:</b>
                <select class="filter-select-edit col-4 form-select" name="action_actor" id="action_actor" v-model="action.actor">
                  <option v-for="actor in action_actors" :value="actor">{{ actor }}</option>
                </select>
                @
                <select class="filter-select-edit col-4 form-select" name="action_context" id="action_context"
                  v-model="action.target_context">
                  <option v-for="context in action_target_context" :value="context">{{ context }}</option>
                </select>
              </span>
              <span class="row mb-2">
                <b class="col-2">Text:</b>
                <textarea class="col-8 action-text" v-model="action.action_text"></textarea>
              </span>
              <span class="row mb-2">
                <b class="col-2">Type:</b>
                <select class="filter-select-edit col-4 form-select" name="action_type" id="action_type" v-model="action.type">
                  <option v-for="atype in action_type" :value="atype">{{ atype }}</option>
                </select>
              </span>
              <span class="row mb-2">
                <b class="col-2">Category:</b>
                <select class="filter-select-edit col-4 form-select" name="action_category" id="action_category"
                  v-model="action.category">
                  <option v-for="acategory in action_category" :value="acategory">{{ acategory }}</option>
                </select>
              </span>
              <span hidden class="row mb-2">
                <b class="col-2">Augmentations:</b>
                <multiselect class="col-10" v-model="action.augmentations" :options="action_augmentation" :multiple="true"
                  label="" title="Pick augmentations to process the text"></multiselect>
              </span>
              <div class="mb-2" @click="show=!show">
                <b>
                  <span v-if="show"><i class="fa fa-caret-down pr-1"></i>Hide</span>
                  <span v-if="!show"><i class="fa fa-caret-right pr-1"></i>Show</span> advanced settings
                </b>
              </div>
              <div v-if="show">
                <span class="row mb-2">
                  <b class="col-2">DOM selector:</b>
                  <input v-model="action.dom_content_selector" id="action_dom_content_selector"
                    name="action_dom_content_selector" class="form-input-text"/>
                </span>
                <span class="row mb-2">
                  <b class="col-2">DOM indicator:</b>
                  <input v-model="action.dom_indicator_selector" id="action_dom_indicator_selector"
                    name="action_dom_indicator_selector" class="form-input-text"/>
                </span>
                <span class="row mb-2">
                  <b class="col-2">Viewport selector:</b>
                  <input v-model="action.viewport_selector" id="action_viewport_selector"
                    name="action_viewport_selector" class="form-input-text" />
                </span>
                <span class="row mb-2">
                  <b class="col-2">Timing:</b>
                  <select class="filter-select-edit col-4 form-control form-select" name="action_timing" id="action_timing"
                  v-model="action.timing">
                  <option v-for="timing in action_timing" :value="timing">{{ timing }}</option>
                </select>
                </span>
                <span class="row mb-2">
                  <b class="col-2">Delay:</b>
                  <input v-model="action.delay" id="action_delay" name="action_delay" class="form-input-text"/>
                </span>
                <span class="row mb-2">
                  <b class="col-2">Priority:</b>
                  <input v-model="action.priority" id="action_priority" name="action_priority" class="form-input-text"/>
                </span>
                <span class="row mb-2">
                  <b class="col-2">Repetitions:</b>
                  <input v-model="action.repetitions" id="action_repetitions" name="action_repetitions" class="form-input-text"/>
                </span>
              </div>
              <hr>
            </li>
          </ol>
          <div v-if="rule.Action.length == 0">
            <button class="btn btn-secondary" title="Add an action to the rule"
            @click="$store.commit('createActionOfNewRule', rule.id)"><i class="fa fa-plus"> Add action</i>
            </button>
          </div>
          <button v-if="rule.Action.length > 0" class="btn btn-secondary" title="Add an action to the rule"
            @click="$store.commit('createActionOfNewRule', rule.id)"><i class="fa fa-plus"></i>
          </button>
        </td>
        <td class="align-text-top">
          <button class="rule-controls right btn btn-primary"
            @click="$store.commit('moveNewRuleToExistingRules', rule.id)">save</button><br>
          <button class="rule-controls right btn btn-secondary"
            @click="$store.commit('restoreNewRuleToExistingRules', rule.id)">cancel</button><br>
          <button class="rule-controls right btn delete btn-link" @click="$store.commit('deleteNewRule', rule.id)">delete</button>
        </td>
      </tr>
    </table>
    <button class="btn btn-secondary" @click="$store.commit('addEmptyNewRule')">
      <i class="fa fa-plus"></i> add new rule</button>
  </div>
</template>

<script lang="ts" src="./AdaptationBoard.ts"></script>

<style>

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
  color: #222;
  background-color: lightblue;
}

.filter-select-edit {
  color: #222;
  background-color: lightblue;
  -webkit-appearance: menulist!important;
  -moz-appearance: menulist!important;
  -ms-appearance: menulist!important;
  -o-appearance: menulist!important;
  appearance: menulist!important;
}

input.form-input-text {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
}


.action-text {
  padding: 2px;
}

.tag {
  padding: 1px 2px 1px 2px;
  margin: 0 1px;
  border-radius: 5px;
  color: #fff;
  font-size: 0.8em;
}

.tag-type {
  background-color: blueviolet;
}

.tag-category {
  background-color: #336699;
}

.right {
  float: right;
}

button:hover {
  background-color: #555;
  color: lightblue;
}

button.rule-controls {
  width: 50px;
}

button.delete {
  background-color: #fff;
  border: solid lightpink 1px;
  color: red;
}

button.delete:hover {
  background-color: lightpink;
  color: #222;
}


.edit-mode {
  border-right: solid 8px lightblue;
}


.align-text-top {
  vertical-align: top;
}


.multiselect {
  display: inline;
  max-width: 80%;
  padding: 0;
  margin: 0;
}

.multiselect__option--disabled {
  background: purple;
  color: rgba(var(--vs-primary), 1);
  font-style: italic;
}

.multiselect__option--highlight {
  background-color: rgba(var(--vs-primary), 1);
  color: rgb(255, 255, 255);
  font-size: 1em;
  height: 1rem;
}

.multiselect__content {
  background: rgb(255, 255, 255);
  color: #444;
  font-size: 0.8em;
}

.multiselect__single {
  height: 0.9em;
  font-size: 1em;
  color: #444;
}

.multiselect__tags {
  display: inline-block;
  padding: 2px 2px 2px 2px;
  line-height: 0.8em;
  font-size: .9em;
  width: 100%;
  color: red;
}


.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background: #369a6e;

}

.multiselect__tag-icon .multiselect__tag {
  cursor: pointer;
  margin-left: 7px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 700;
  font-style: normal;
  width: 14px;
  text-align: center;
  line-height: 0.9px;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  border-radius: 5px;
}

.multiselect__tag {
  position: relative;
  display: inline-block;
  padding: 0px 25px 4px 0px;
  margin-right: 0.625rem;
  line-height: 0.9;
  margin-bottom: 0.6rem;
  font-size: .8em;
  background-color: #336699;
  color: #fff;
}
</style>