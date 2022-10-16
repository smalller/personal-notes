<template>
  <ui-modal
    v-model:visible="visible"
    :title="titles"
    width="646"
    tips="建议分辨率不低于 1920*1080（大小不超过 10M）"
    cancelText="重新上传"
    @cancel="getImg"
  >
    <div class="ui-clip-box">
      <div class="ui-clip-canvas-box" ref="canvasBox"></div>
    </div>

    <template v-slot:footer>
      <div class="tipsBox">
        <div>建议分辨率不低于 1920*1080（大小不超过 10M）</div>
      </div>
      <div class="footerBoxs">
        <ui-button class="ui-modal-btn" @click="getImg"> 选择文件 </ui-button>
        <ui-button
          @click="save"
          style="margin-left: 16px"
          type="primary"
          class="ui-modal-btn"
          :disabled="loading"
          >确认</ui-button
        >
      </div>
    </template>
  </ui-modal>
  <cms-upload ref="cmsUpload" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
// import ClipImg from "./canvas";
import ClipImg from "@zhuxiaozy/clipimg";
import { GetUserFaceStatus, SaveFaceFeature } from "@/api/common";
import Message from "@/themes/message/index";
import CmsUpload from "@/base/cmsUpload.vue";

export default defineComponent({
  name: "ui-image-clip",
  components: { CmsUpload },
  emits: {
    close: null,
    getData: null,
  },
  props: {
    title: {
      type: String,
      default: "上传封面",
    },
  },
  setup(props, ctx) {
    const imgSrc = ref("");
    const visible = ref(false);
    const canvasBox = ref<HTMLDivElement | null>(null);
    const width = ref(1920);
    const height = ref(1080);
    const imgSize = ref(10240);
    const isFile = ref(false);

    const cmsUpload = ref(null);
    const loading = ref(false);

    const titles = computed(() => props.title);

    let clipData: ClipImg;
    onMounted(() => {
      // if (canvasBox.value) {
      //   clipData = new ClipImg({
      //     el: canvasBox.value,
      //     reviewCall: (src: string) => {
      //       imgSrc.value = src;
      //     },
      //   });
      //   clipData.setSize(200, 300);
      // }
    });
    const getImg = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (e: Event) => {
        isFile.value = true;
        const target = e.target;
        const fileList: FileList | null = (target as HTMLInputElement).files;
        if (fileList && fileList.length > 0) {
          clipData.setImg(fileList[0]);
        }
      };
      input.click();
    };
    interface Config {
      width?: number;
      height?: number;
      size?: number;
    }
    let resolves: any;
    const init = (config: Config): Promise<void> =>
      new Promise((resolve) => {
        resolves = resolve;
        isFile.value = false;
        visible.value = true;
        width.value = config?.width || 1920;
        height.value = config?.height || 1080;
        imgSize.value = config?.size || imgSize.value;
        setTimeout(() => {
          if (canvasBox.value) {
            clipData = new ClipImg({
              el: canvasBox.value,
              reviewCall: (src: string) => {
                imgSrc.value = src;
              },
            });
            clipData.setSize(width.value / 4, height.value / 4);
          }
        }, 100);
      });

    const save = () => {
      getClip();
    };
    const getClip = () => {
      clipData.getClipData(imgSize.value).then((res: ImgResponse) => {
        // console.log(res);
        ctx.emit("getData", res);
        if (resolves) {
          resolves(res);
        }
      });
    };

    /**
     * 图片裁剪写入图片
     * @param img
     */
    const setImg = (img: File) => {
      clipData.setImg(img);
    };

    interface ImgResponse {
      url: string;
      blob: Blob;
    }

    const close = () => {
      visible.value = false;
      loading.value = false;
      ctx.emit("close");
    };
    return {
      canvasBox,
      imgSrc,
      visible,
      cmsUpload,
      loading,
      titles,
      getImg,
      getClip,
      save,
      init,
      setImg,
      close,
    };
  },
});
</script>

<style lang="less">
.ui-clip-box {
  .ui-clip-canvas-box {
    width: 586px;
    height: 360px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      filter: alpha(Opacity=60);
      -moz-opacity: 0.6;
      opacity: 0.6;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 1);
      z-index: 1;
      pointer-events: none;
    }
    > div {
      border-color: #ff9900 !important;
      z-index: 2;
      > div {
        width: 15px !important;
        height: 15px !important;
        background: rgba(255, 255, 255, 0) !important;
        box-sizing: border-box;
        border: 4px solid #ff9900;

        &:nth-child(1) {
          border-right-style: hidden;
          border-bottom-style: hidden;
        }
        &:nth-child(2) {
          border-left-style: hidden;
          border-bottom-style: hidden;
        }
        &:nth-child(3) {
          border-right-style: hidden;
          border-top-style: hidden;
        }
        &:nth-child(4) {
          border-left-style: hidden;
          border-top-style: hidden;
        }
      }
    }
  }
}
.tipsBox {
  color: #999999;
  font-size: 12px;
}
</style>
