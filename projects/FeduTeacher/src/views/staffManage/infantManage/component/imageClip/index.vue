<template>
  <ui-modal v-model:visible="visible" title="上传照片" width="646">
    <div class="ui-clip-box">
      <div class="ui-clip-canvas-box" ref="canvasBox"></div>
    </div>

    <template v-slot:footer>
      <div class="footerBoxs">
        <ui-button class="ui-modal-btn" type="primary" @click="getImg">
          选择文件
        </ui-button>
        <ui-button
          class="ui-modal-btn"
          style="margin-left: 16px"
          @click="close"
        >
          取消
        </ui-button>
        <ui-button
          @click="save"
          style="margin-left: 16px"
          type="primary"
          class="ui-modal-btn"
          :disabled="loading"
          >{{ btnText }}</ui-button
        >
      </div>
    </template>
  </ui-modal>
  <face-upload ref="cmsUpload" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
// import ClipImg from "./canvas";
import ClipImg from "@zhuxiaozy/clipimg";
import { GetUserFaceStatus, SaveFaceFeature } from "@/api/common";
import Message from "@/themes/message/index";
import CmsUpload from "@/base/cmsUpload.vue";
import FaceUpload from "@/base/faceUpload.vue";

export default defineComponent({
  name: "image-clip",
  components: { FaceUpload },
  emits: {
    close: null,
  },
  setup(props, ctx) {
    const imgSrc = ref("");
    const visible = ref(false);
    const canvasBox = ref<HTMLDivElement | null>(null);
    const width = ref(1920);
    const height = ref(1080);
    const isFile = ref(false);

    const cmsUpload = ref(null);
    const btnText = ref("确认");
    const loading = ref(false);

    interface ActiveUser {
      id: string;
      name: string;
      clazzName: string;
      clazzId: string;
    }
    let activeUser: ActiveUser;

    let clipData: ClipImg;
    onMounted(() => {
      if (canvasBox.value) {
        clipData = new ClipImg({
          el: canvasBox.value,
          reviewCall: (src: string) => {
            imgSrc.value = src;
          },
        });
        clipData.setSize(320, 180);
      }
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
    }
    const userIdentity = ref(-1);
    const init = (
      config: Config,
      userInfo: ActiveUser,
      identity: number
    ): Promise<void> =>
      new Promise((resolve) => {
        userIdentity.value = identity;
        activeUser = userInfo;
        isFile.value = false;
        visible.value = true;
        width.value = config?.width || 1920;
        height.value = config?.height || 1080;
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
          resolve();
        }, 100);
      });

    const save = () => {
      getClip();
    };
    const getClip = () => {
      clipData.getClipData(128).then((res: ImgResponse) => {
        // console.log(res);
        uploadImg(res);
        loading.value = true;
        btnText.value = "检测中";
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

    //上传
    const uploadImg = (res: ImgResponse): void => {
      const file = new File([res.blob], "123.png", {
        type: res.blob.type,
      });
      (cmsUpload.value as any)
        .uploadImageFile(file, activeUser.id)
        .then((res: any) => {
          SaveFaceFeature({
            images: [res.data],
            identity: userIdentity.value.toString(),
            studentId: activeUser.id,
            studentName: activeUser.name,
            clazzName: activeUser.clazzName,
            clazzId: activeUser.clazzId,
          }).then((res) => {
            if (+res.code === 0) {
              queryUserFaceStatus(res.data.id, res.data.studentName);
            } else {
              Message.warning(res.msg);
            }
          });
        });
    };

    const queryUserFaceStatus = (id: string, studentName: string) => {
      let i = 10;
      const timer = setInterval(() => {
        GetUserFaceStatus(id).then((res) => {
          if (typeof res.data.cardStatus === "boolean") {
            clearInterval(timer);
            if (res.data.cardStatus) {
              Message.success("人脸信息上传成功");
              setTimeout(() => {
                close();
              }, 2000);
            } else {
              Message.error(`${studentName}照片不合规，请重新上传照片`);
              loading.value = false;
              btnText.value = "确认";
            }
          } else {
            if (i <= 0) {
              clearInterval(timer);
              Message.error(`${studentName}照片不合规，请重新上传照片`);
              loading.value = false;
              btnText.value = "确认";
            }
            i--;
          }
        });
      }, 1000);
    };

    const close = () => {
      visible.value = false;
      loading.value = false;
      btnText.value = "确认";
      ctx.emit("close");
    };
    return {
      canvasBox,
      imgSrc,
      visible,
      cmsUpload,
      btnText,
      loading,
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
</style>
