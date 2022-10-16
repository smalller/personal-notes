<template>
  <div id="app" @click="close">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    close() {
      this.$store.commit("change", 2);
    },
  },
  computed: {},
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
$def-color: #000;
$line-bg-color: #409eff;
.column {
  display: flex;
  margin: 10px 0 20px 0;
  height: 30px;
}
.line {
  width: 5px;
  background: $line-bg-color;
  margin-right: 10px;
  display: inline-block;
}
.lw1 {
  height: 30px;
}
.lw2 {
  height: 20px;
}
.self_inp {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  border: 1px solid #e4e7ed;
  outline: none;
  color: #606266;
  width: 150px;
  border-radius: 4px;
  margin-right: 10px;
}
.self_inp::-webkit-input-placeholder {
  color: #c0c4cc;
}

body,
p,
ul,
li,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  font-family: "微软雅黑";
}

ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
  color: #333;
}
</style>
