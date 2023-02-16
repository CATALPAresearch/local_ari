
<script lang="ts">
import { defineComponent } from 'vue';
//import { EConditionCount, EConditionDate, EMoodleContext, EOperators, ERuleActor, IRule, IRuleCondition, Rules } from '@/tsc/rules';
//import Communication from '../../../scripts/communication';

export default defineComponent({
    name: "PromptPanel",
    data() {
        return {
            hello: 2
        }
    },
    mounted: function () {
        
    },
    methods: {} 
});
</script>

<style>
.opener {
  position: absolute;
  z-index: 111999;
  top: 100;
  right: 0;
  width: 20px;
  height: 50px;
  background-color: red;
}
</style>

<template>
    <div id="PromptPanel">
        <div hidden class="opener">EE</div>
        <div class="promptList"></div>
    </div>
</template>