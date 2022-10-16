<template>
  <div class="test">
    <button @click="changeText">按钮</button>
    <div>{{ text }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      text: "111",
    };
  },

  methods: {
    changeText() {
      this.text = "哈哈哈";
    },
  },
});
</script>

<style scoped>
.test {
  text-align: center;
}
</style>