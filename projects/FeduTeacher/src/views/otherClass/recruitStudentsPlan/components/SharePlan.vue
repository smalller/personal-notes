<template>
  <div
    :class="['share-qr-box', arrows === 'bottom' ? 'bottom' : 'top']"
    :style="{ left: left + 'px', top: top + 'px' }"
  >
    微信扫码分享
    <canvas v-if="text" class="qr" ref="qrcodeEl"></canvas>
    <span v-else class="qr">暂无分享信息</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import QRCode from "qrcode"; //引入生成二维码插件

export default defineComponent({
  props: {
    top: {
      type: String,
      default: "-148",
    },
    left: {
      type: String,
      default: "-50",
    },
    arrows: {
      type: String,
      default: "bottom",
    },
    text: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const qrcodeEl = ref(null);

    function createQr() {
      const opts = {
        errorCorrectionLevel: "H", //容错级别
        type: "image/png", //生成的二维码类型
        quality: 0.3, //二维码质量
        margin: 0, //二维码留白边距
        width: 80, //宽
        height: 80, //高
        text: props.text, //二维码内容
        color: {
          dark: "#333333", //前景色
          light: "#fff", //背景色
        },
      };
      // 将获取到的数据（val）画到msg（canvas）上
      QRCode.toCanvas(
        qrcodeEl.value,
        props.text,
        opts,
        function (error: string) {
          return error;
        }
      );
    }

    onMounted(() => {
      createQr();
    });

    return {
      createQr,
      qrcodeEl,
    };
  },
});
</script>
<style lang="less" scoped>
.share-qr-box {
  z-index: 1000;
  position: absolute;
  // top: -148px;
  // left: -50px;
  width: 132px;
  height: 140px;
  font-size: 12px;
  border-radius: 4px;
  background-color: #fff;
  color: #666;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 18px 0 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .qr {
    width: 80px;
    height: 80px;
    margin-top: 5px;
    text-align: center;
    line-height: 80px;
  }
}

.bottom {
  &::after {
    display: block;
    content: "";
    width: 0;
    position: absolute;
    bottom: -20px;
    left: 64px;
    margin-left: -10px;
    border: 10px solid transparent;
    border-top: 10px solid #fff;
  }
}

.top {
  &::before {
    display: block;
    content: "";
    width: 0;
    position: absolute;
    top: -20px;
    left: 64px;
    margin-left: -10px;
    border: 10px solid transparent;
    border-bottom: 10px solid #fff;
  }
}
</style>
