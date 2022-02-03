<template>
  <div>
    <h3>Tests</h3>
    <div v-for="test in tests" v-bind:key="test">
      {{ test.id }} : 
      {{ test.name }}
    </div>
  </div>
</template>
<script>
import Test from "../models/Test";

export default {
  data: function () {
    return {};
  },
  methods: {},
  created: function(){
    const sample = [
      {
        id: 1,
        name: "Hello, world!",
        task: "Some awesome body...",
        score: 22,
      },
    ];

    Test.insert({ data: sample });
    console.log(22)
    console.log(this.tests)
    console.log(this.tests.name)
  },

  computed: {
    tests() {
      // Fetch all post records.
      return Test.all();
    },
  },
};
</script>
