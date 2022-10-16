<template>
  <ui-modal
    v-model:visible="visible"
    title=""
    @close="reset"
    width="685"
    @ok="save"
  >
    <div class="ui-camera-box">
      <div class="cameraBox">
        <div class="titleBox">
          <span>拍摄照片</span>
        </div>
        <div class="deviceBox">
          <span>切换设备:</span>
          <ui-select v-model="deviceId" @change="deviceChanged">
            <ui-select-option
              v-for="item in deviceList"
              :key="item.deviceId"
              :value="item.deviceId"
              :label="item.label"
            ></ui-select-option>
          </ui-select>
        </div>
        <canvas
          ref="canvas"
          :style="{ filter: `brightness(${filter.brightness * 2}%)` }"
        ></canvas>
        <video src="" ref="video" style="display: none"></video>
        <div class="filterBox">
          <span>亮度调节: </span>
          <input type="range" v-model="filter.brightness" />
        </div>
        <ui-button type="primary" @click="getPhoto">拍照</ui-button>
      </div>
      <div class="imgList">
        <div class="titleBox">
          <span>选择照片</span>
        </div>
        <div class="imgListBox scroll">
          <div
            class="imgItem"
            v-for="item in imgList"
            :key="item.uuid"
            @click="selectUserImg(item.uuid)"
          >
            <div class="active" v-show="imageIndex === item.uuid">
              <div class="iconBox">
                <ui-icon icon="icon-a-63"></ui-icon>
              </div>
            </div>
            <img :src="item.url" alt="" />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="footerBoxs">
        <ui-button class="ui-modal-btn" @click="close"> 取消 </ui-button>
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
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import Message from "@/themes/message/index";
import micell from "micell";
import { GetUserFaceStatus, SaveFaceFeature } from "@/api/common";
import CmsUpload from "@/base/cmsUpload.vue";
import FaceUpload from "@/base/faceUpload.vue";
// import domtoimage from "dom-to-image";

export default defineComponent({
  name: "camera",
  components: { FaceUpload },
  emits: {
    close: null,
  },
  setup(props, ctx) {
    const visible = ref(false);
    const video = ref(null);
    const canvas = ref(null);
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
    let canvasEl: HTMLCanvasElement;
    let canvasCtx: CanvasRenderingContext2D;
    const deviceId = ref("");
    const deviceList = ref<MediaDeviceInfo[]>([]);
    const src = ref("");
    const imageIndex = ref("");
    interface ImageInfo {
      blob: Blob;
      url: string;
      uuid: string;
    }
    const imgList = reactive<ImageInfo[]>([]);
    let cameraStream: MediaStream;
    let imgBlob: Blob;
    let timer: number;
    let cameraTimer: number;
    interface CameraSize {
      width: number;
      height: number;
    }
    let cameraSize: CameraSize;

    //滤镜
    const filter = reactive({
      blur: 0, //高斯模糊
      brightness: 50, //亮度
      contrast: 1, //对比度
      grayscale: 1, // 灰度
      "hue-rotate": 0, //色相
      invert: 0, //反转
      opacity: 1, //透明度
      saturate: 1, //饱和度
    });

    const save = () => {
      const imgData = imgList.find((item) => item.uuid === imageIndex.value);
      if (imgData) {
        // ctx.emit("getImg", {
        //   url: URL.createObjectURL(imgData.blob),
        //   blob: imgData.blob,
        // });
        // visible.value = false;
        loading.value = true;
        btnText.value = "检测中";
        getImg(imgData);
      } else {
        Message.warning("请选择照片");
      }
    };

    const close = () => {
      visible.value = false;
      reset();
      ctx.emit("close");
    };

    const reset = () => {
      if (cameraTimer) {
        clearInterval(cameraTimer);
        cameraTimer = 0;
      }

      console.log(cameraStream);
      cameraStream && cameraStream.getTracks()[0].stop();
      console.log((window as any).mediaStreamTrack);
      (window as any).mediaStreamTrack &&
        (window as any).mediaStreamTrack.stop();
      loading.value = false;
      btnText.value = "确认";
      imgList.length = 0;
      imageIndex.value = "";
    };

    interface ImgResponse {
      url: string;
      blob: Blob;
    }

    //上传
    const getImg = (res: ImgResponse): void => {
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

    const createCanvas = () => {
      if (cameraTimer) {
        clearInterval(cameraTimer);
        cameraTimer = 0;
      }

      const n = cameraSize.width / cameraSize.height;
      const videoEl = video.value as unknown as HTMLVideoElement;

      const videoWidth = canvasEl.height * n || canvasEl.width;
      const x = -(videoWidth - canvasEl.width) / 2;

      // window.requestAnimationFrame(createCanvas);
      cameraTimer = setInterval(() => {
        canvasCtx.drawImage(videoEl, x, 0, videoWidth, canvasEl.height);
      }, 100);
    };
    const userIdentity = ref(-1);
    const init = (item: ActiveUser, identity: number) => {
      reset();
      userIdentity.value = identity;
      activeUser = item;
      visible.value = true;
      getVideoMedia();
    };

    const getVideoMedia = () => {
      // console.log(navigator.mediaCapabilities);
      if (navigator?.mediaDevices) {
        navigator.mediaDevices
          .enumerateDevices()
          .then((res) => res.filter((item) => item.kind === "videoinput"))
          .then((cameraList) => {
            if (cameraList.length > 0) {
              deviceId.value = cameraList[0].deviceId;
              deviceList.value = cameraList;
              createVideo();
            }
          });
      }
      navigator.mediaDevices.ondevicechange = (e) => {
        console.log(e, "设备切换");
        getVideoMedia();
      };
    };

    const deviceChanged = () => {
      createVideo();
    };

    const canvasInit = () => {
      canvasEl = canvas.value as unknown as HTMLCanvasElement;
      canvasEl.width = 296;
      canvasEl.height = 390;
      canvasCtx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
    };

    const createVideo = () => {
      canvasInit();
      cameraStream && cameraStream.getTracks()[0].stop();
      (window as any).mediaStreamTrack &&
        (window as any).mediaStreamTrack.stop();
      const videoEl = video.value as unknown as HTMLVideoElement;
      videoEl.srcObject = null;
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: deviceId.value,
          },
        })
        .then(async (stream) => {
          const track = stream.getVideoTracks()[0];
          let imageCapture = new ImageCapture(track);
          const capabilities = await imageCapture.getPhotoSettings();
          cameraSize = {
            width: capabilities.imageWidth as number,
            height: capabilities.imageHeight as number,
          };
          console.log(cameraSize);
          cameraStream = stream;
          videoEl.srcObject = stream;
          await videoEl.play();
          createCanvas();
          // window.requestAnimationFrame(createCanvas);
        });
    };

    const getPhoto = async () => {
      (window as any).domtoimage.toBlob(canvasEl).then((blob: Blob) => {
        if (blob) {
          imgList.unshift({
            blob: blob,
            uuid: micell.uuid(),
            url: URL.createObjectURL(blob),
          });
        }
      });
    };

    const selectUserImg = (uuid: string) => {
      imageIndex.value = uuid;
    };

    watch(
      () => visible.value,
      () => {
        src.value = "";
        imgBlob = new Blob();
      }
    );

    onMounted(() => {
      // init();
    });

    return {
      visible,
      video,
      canvas,
      src,
      deviceId,
      deviceList,
      imgList,
      imageIndex,
      filter,
      cmsUpload,
      btnText,
      loading,
      save,
      getPhoto,
      init,
      deviceChanged,
      selectUserImg,
      close,
      reset,
    };
  },
});
</script>
<style lang="less">
.ui-camera-box {
  display: flex;
  justify-content: space-between;
  .titleBox {
    width: 100%;
    padding-bottom: 20px;
    span {
      font-size: 16px;
      font-weight: 700;
      color: #222222;
    }
  }
  .cameraBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    canvas {
      //width: 296px;
      //height: 390px;
      border: 1px solid #ff9900;
      transform: rotateY(180deg);
      filter: brightness(400%);
    }
    video {
      width: 320px;
      height: 180px;
    }
    img {
      width: 160px;
    }

    .deviceBox {
      width: 100%;
      margin-bottom: 10px;
      > span {
        margin-right: 10px;
        font-size: 14px;
      }
    }
    .filterBox {
      width: 100%;
      margin: 10px 0;
      display: flex;
      //span {
      //  display: inline-block;
      //  width: 40px;
      //}
      input {
        flex: 1;
      }
    }
  }
  .imgList {
    .imgListBox {
      height: 390px;
      overflow-y: auto;
      display: grid;
      grid-template-rows: repeat(auto-fill, 120px);
      grid-template-columns: repeat(3, 90px);
      grid-row-gap: 10px;
      grid-column-gap: 10px;
    }
    .imgItem {
      height: 120px;
      border-radius: 4px;
      box-sizing: border-box;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .active {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2;
        .iconBox {
          margin-top: 4px;
          margin-left: 4px;
          width: 24px;
          height: 24px;
          background: #ff9900;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon {
            fill: #ffffff;
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }
}
.footerBoxs {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
