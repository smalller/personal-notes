<template>
  <div class="phoneShow">
    <div class="phone-title">
      <span>页面预览</span>
      <ui-icon icon="icon-a-zu238" class="icon" @click="closed"></ui-icon>
    </div>
    <div class="phone-box">
      <div class="phone-view">
        <img src="../../../../assets/phone-header.png" class="phone-header" />
        <div>
          <iframe
            class="iframe"
            :src="previewUrl"
            frameborder="0"
            scrolling="auto"
          ></iframe>
        </div>
      </div>
      <!-- <div class="phone-code">
        <div class="code-img"></div>
        <span>扫码浏览和分享</span>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import "@/base/commonStyle.less";

interface ListItem {
  name: string;
  value?: string;
}

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    highLight: Boolean,
  },
  emits: {
    close: null,
  },
  setup(props, ctx) {
    console.log(props);
    const modelLabel = ref("");
    const previewUrl = ref(
      // `http://localhost:8081/school?schoolId=${props.school}&id=${props.id}`
      `https://h5.jinshuy.com/school?schoolId=${props.school}&id=${props.id}`
    );
    let icon = ref("icon-a-9");
    // 如果没有选择年份，就取消高亮
    watch(
      () => props.highLight,
      () => {
        if (!props.highLight) {
          modelLabel.value = "";
        }
      }
    );
    const closed = () => {
      console.log("0000000000000000");
      ctx.emit("close");
    };
    return {
      modelLabel,
      icon,
      previewUrl,
      closed,
    };
  },
});
</script>
<style lang="less" scoped>
.phoneShow {
  width: 100%;
  height: 100%;
  .phone-title {
    margin: auto;
    padding-top: 30px;
    padding-left: 40px;
    .icon {
      float: right;
      margin-right: 20px;
      margin-top: -10px;
      font-size: 15px;
      color: #d9d9d9;
      cursor: pointer;
    }
    span {
      width: 80px;
      height: 28px;
      font-size: 20px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
    }
  }
  .phone-box {
    display: flex;
    margin-left: 210px;
    margin-top: 15px;
    .phone-view {
      width: 400px;
      height: 835px;
      background: url("../../../../assets/phone-demo.png") no-repeat;
      background-size: 95% auto;
      .phone-header {
        margin-top: 20px;
      }
      .iframe {
        width: 360px;
        height: 735px;
        margin-left: 10px;
      }
    }
    .phone-code {
      margin-left: 80px;
      margin-top: 20px;
      width: 120px;
      height: 140px;
      background: #ffffff;
      border-radius: 3px;
      .code-img {
        width: 80px;
        height: 80px;
        margin-left: 20px;
        margin-top: 20px;
      }
      span {
        margin-left: 20px;
        width: 84px;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        text-align: left;
        color: #666666;
      }
    }
  }
}
</style>
