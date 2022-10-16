<template>
  <div id="vue-admin-beautiful-pro">
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import request from '@/utils/request'
  export default {
    name: 'App',
    computed: {
      ...mapGetters({
        accessToken: 'user/accessToken',
      }),
    },
    watch: {
      $route(news, old) {
        // if (old.path === '/login') {
        //   this.setCode()
        //   this.querySubjectManage()
        // }
      },
    },
    created() {
      if (!this.accessToken) return
      this.$store.dispatch('code_list/ac_getProvince') //获取中国省
      this.$store.dispatch('code_list/ac_getClassCode') // 获取年级码值
      this.$store.dispatch('code_list/ac_getTitleCode') // 获取称谓码值码值
      this.$store.dispatch('code_list/ac_getUserCode') // 获取称谓码值码值
      // request({
      //   url: `/home/unAccess/ad/list?type=300417`,
      //   method: 'post',
      //   data: {},
      // }).then((res) => {
      //   console.log(res)
      //   if (res.data) {
      //     document.getElementById('linkUrl').href = res.data.list[0].imgUrl
      //   }
      // })
    },
    methods: {
      ...mapActions({
        setCode: 'cms_code/setCode',
        querySubjectManage: 'cms_subject/querySubjectManage',
      }),
    },
  }
</script>
<style lang="scss">
  * {
    font-family: 'PingFang SC', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
  html {
    // overflow-y: scroll;
  }
  .el-popup-parent--hidden {
    padding-right: 0 !important;
  }
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
