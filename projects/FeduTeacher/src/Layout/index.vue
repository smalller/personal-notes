<template>
  <div class="main scroll">
    <el-config-provider :locale="locale">
      <Head></Head>
      <div class="main-content">
        <Nav></Nav>
        <div class="main-view scroll">
          <router-view />
        </div>
      </div>
      <main-footer></main-footer>
    </el-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

import Head from "@/Layout/Head.vue";
import Nav from "@/Layout/Nav.vue";
import MainFooter from "@/Layout/Footer.vue";

export default defineComponent({
  name: "layout",
  components: {
    MainFooter,
    [ElConfigProvider.name]: ElConfigProvider,
    Head,
    Nav,
  },
  data() {
    return {
      locale: zhCn,
    };
  },
});
</script>
<style scoped lang="less">
.main {
  position: relative;
  width: 100vw;
  //height: calc(100vh + 167px);
  flex-direction: column;
  padding-top: 60px;
  .main-content {
    display: flex;
    flex: 1;
    .main-view {
      //height: calc(100vh - 40px);
      flex: 1;
      background: #f8f8f8;
      overflow-y: auto;
    }
  }
}
</style>
