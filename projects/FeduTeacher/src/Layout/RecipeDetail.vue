<template>
  <div class="main scroll">
    <el-config-provider :locale="locale">
      <div class="head">
        <div>
          <ui-icon
            icon="icon-a-zu1985"
            v-if="isDrawer"
            @click="openNav"
          ></ui-icon>
          <logo></logo>
          <sapn class="head-title">{{ menu_item.name }}</sapn>
          <!-- <school-select></school-select> -->
        </div>
        <div class="btn-box" v-if="menu_item.meta.type === 2">
          <ui-button
            style="color: #999999"
            type="text"
            @click="sendBusEvent('enrollmentBack')"
            >撤销编辑</ui-button
          >
          <ui-button @click="sendBusEvent('enrollmentSave')">保存</ui-button>
          <ui-button @click="sendBusEvent('enrollmentPreview')">预览</ui-button>
          <ui-button type="primary" @click="sendBusEvent('enrollmentPreSave')"
            >发布并关闭</ui-button
          >
        </div>

        <div class="btn-box" v-if="menu_item.meta.type === 3">
          <ui-button @click="sendBusEvent('previewLive')">预览</ui-button>
          <ui-button @click="sendBusEvent('previewIssueLive')" type="primary"
            >发布</ui-button
          >
        </div>
        <div class="btn-box" v-if="menu_item.meta.type === 4">
          <ui-button
            v-show="index !== 0"
            style="color: #999999"
            type="text"
            @click="sendBusEvent('noticeBack')"
            >撤销编辑</ui-button
          >
          <!-- <ui-button
            v-show="index !== 0"
            style="color: #999999"
            type="text"
            @click="sendBusEvent('noticeDraft')"
            >草稿箱</ui-button
          >
          <ui-button
            v-show="index !== 0"
            @click="sendBusEvent('noticeSaveDraft')"
            >存草稿</ui-button
          > -->
          <ui-button v-show="index !== 0" @click="sendBusEvent('noticePreview')"
            >预览</ui-button
          >
          <ui-button
            v-show="index !== 0"
            type="primary"
            @click="sendBusEvent('noticeSavePreview')"
            >发布并关闭</ui-button
          >
        </div>
        <div class="btn-box" v-if="menu_item.meta.type === 5">
          <ui-button @click="sendBusEvent('coursePre')">预览 </ui-button>
          <ui-button type="primary" @click="sendBusEvent('courseSave')"
            >保存</ui-button
          >
        </div>
      </div>
      <div class="main-contents" v-if="menu_item.meta.type === 2">
        <div class="main-views scroll">
          <router-view />
        </div>
      </div>
      <div class="main-content" v-else>
        <div class="main-view scroll">
          <router-view />
        </div>
      </div>
    </el-config-provider>
  </div>
</template>

<script lang="ts">
import { ElConfigProvider } from "element-plus";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
// import HeadOut from "@/Layout/HeadOut.vue";
import logo from "../components/logo.vue";
import { useRoute } from "vue-router";
// import { useStore } from "vuex";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "RecipeDetail",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    logo,
  },
  data() {
    return {
      locale: zhCn,
    };
  },
  emits: [
    "previewLive",
    "previewIssueLive",
    "enrollmentBack",
    "enrollmentSave",
    "enrollmentPreview",
    "enrollmentPreSave",
    "noticeSavePreview",
    "noticePreview",
    "noticeBack",
  ],
  setup() {
    // const $store = useStore();
    // const openNav = () => {
    //   $store.dispatch("changeDrawer", true);
    // };
    // const isDrawer = computed(() => $store.state.nav.isDrawer);
    // const drawers = computed(() => $store.state.nav.drawer);
    const menu_item = computed(() => {
      return useRoute();
    });
    console.log(useRoute());

    // 发布订阅
    function sendBusEvent(event: string) {
      switch (event) {
        case "previewLive":
          bus.$emit("previewLive");
          break;
        case "previewIssueLive":
          bus.$emit("previewIssueLive");
          break;
        case "enrollmentBack":
          bus.$emit("enrollmentBack");
          break;
        case "enrollmentSave":
          bus.$emit("enrollmentSave");
          break;
        case "enrollmentPreview":
          bus.$emit("enrollmentPreview");
          break;
        case "enrollmentPreSave":
          bus.$emit("enrollmentPreSave");
          break;
        case "noticeBack":
          bus.$emit("noticeBack");
          break;
        case "noticeDraft":
          bus.$emit("noticeDraft");
          break;
        case "noticeSaveDraft":
          bus.$emit("noticeSaveDraft");
          break;
        case "noticePreview":
          bus.$emit("noticePreview");
          break;
        case "noticeSavePreview":
          bus.$emit("noticeSavePreview");
          break;
        case "coursePre":
          bus.$emit("coursePre");
          break;
        case "courseSave":
          bus.$emit("courseSave");
          break;
      }
    }

    return {
      menu_item,
      sendBusEvent,
    };
  },
});
1;
</script>
<style scoped lang="less">
.main {
  position: relative;
  width: 100vw;
  //height: calc(100vh + 167px);
  flex-direction: column;
  padding-top: 60px;
  background: #eef2f8;

  .main-content {
    display: flex;
    flex: 1;

    .main-view {
      height: calc(100vh - 60px);
      flex: 1;
      background: #eef2f8;
      overflow-y: auto;
      padding: 20px;
      box-sizing: border-box;
    }
  }
  .main-contents {
    display: flex;
    flex: 1;
    .main-views {
      // height: calc(100vh - 60px);
      flex: 1;
      background: #eef2f8;
      overflow-y: auto;
      // padding: 20px;
      box-sizing: border-box;
    }
  }

  .head {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 40px;
    background: #ffffff;
    user-select: none;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    box-shadow: 0px 2px 4px 0px undefined;
    // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    .btn-box {
      > button {
        margin-left: 16px;
      }
    }
    > div {
      display: flex;
      align-items: center;
    }
    .icon {
      width: 18px;
      height: 18px;
      margin-right: 20px;
      fill: #707070;
      cursor: pointer;
    }
    .head-title {
      display: block;
      margin-left: 60px;
      width: 144px;
      height: 33px;
      font-size: 24px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #222222;
    }
  }
}
</style>
