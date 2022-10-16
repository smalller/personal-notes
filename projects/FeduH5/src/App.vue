<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "App",
  watch: {
    "$route.path": function () {
      window.scrollTo(0, 0);
    },
  },
  created() {
    this.$bus.$on('wechatLogin', (options) => {
      if (micell.ua.isWeChat()) {
        sessionStorage.setItem('routerPath', this.$route.path)
        sessionStorage.setItem('routerQuery', JSON.stringify(this.$route.query))
        if (typeof options === 'string') {
          sessionStorage.setItem('loginTitle', options)
          sessionStorage.setItem('isSelectStudent', '1')
          sessionStorage.setItem('isSelectTeacher', '1')
        } else {
          sessionStorage.setItem('loginTitle', options.title || '')
          sessionStorage.setItem('isSelectStudent', +options.isSelectStudent === 0 ? '0' : '1')
          sessionStorage.setItem('isSelectTeacher', +options.isSelectTeacher === 0 ? '0' : '1')
        }
        this.$router.push({
          name: 'weChatLogin'
        })
      } else {
        this.$router.push({
          name: 'weChatLogin'
        })
      }

    })

  }
};
</script>

<style>
html,
body {
  /* text-align: center; */
  /* margin-left: 10%; */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  user-select: none;
  -webkit-user-select: auto !important;
  -khtml-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  -o-user-select: auto !important;
  /* user-select: auto !important;  */
}
.van-overlay{
  background-color: rgba(0,0,0,0.2) !important;
}
</style>
