<template>
  <div class="app-container">
    <vuedraggable v-model="list" class="wrapper">
      <transition-group>
        <div v-for="item in list" :key="item" class="detail">{{ item }}</div>
      </transition-group>
    </vuedraggable>
  </div>
  <!-- <div class="home">
    <h1>This is an home page</h1>
  </div> -->
</template>

<script>
import vuedraggable from "vuedraggable";
export default {
  components: {
    vuedraggable
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  updated() {
    console.log(this.list);
  }
};
</script>

<style scoped>
.app-container {
  width: 400px;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.detail {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #42b983;
  margin-bottom: 20px;
}
</style>
