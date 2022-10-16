<template>
  <transition name="ui-video">
    <div
      class="ui-video"
      :style="{
        position: mask ? '' : 'relative',
        border: mask ? '1px solid #000000' : '',
      }"
      v-show="SHOW"
      :class="{ mask: mask }"
    >
      <div class="ui-video-mask" v-if="mask"></div>
      <div class="ui-video-box" :class="{ 'box-mask': mask }">
        <div ref="UI_VIDEO_BOX"></div>
        <div class="ui-video-closeBtn" @click="close" v-if="mask">
          <ui-icon icon="icon-a-zu238"></ui-icon>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import HLS from "hls.js";
import FLV from "flv.js";
import DPlayer from "dplayer";

interface options {
  live: boolean;
  autoPlay: boolean;
}

export default defineComponent({
  name: "ui-video",

  props: {
    mask: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    "update:visible": null,
  },
  setup(props, context) {
    const UI_VIDEO_BOX = ref(null);
    const videoData = ref<any>(null);
    const videoSrc = ref("");

    const SHOW = ref(false);
    onMounted(() => {
      //"https://yjbigfiles.oss-cn-shenzhen.aliyuncs.com/V1V/ib/V1VEzk0FtV419IrCs2kWAiba.mp4",
      // init(
      //   "http://stream.zhidiansaas.com/video/video.flv?auth_key=1630912014-0-0-62433b46e917beb5991b8919d58ed1f0",
      //   {
      //     live: true,
      //     autoPlay: true,
      //   }
      // );
    });

    if (!props.mask) {
      SHOW.value = true;
    }

    watch(
      () => props.visible,
      () => {
        SHOW.value = props.visible;
      }
    );

    let dp: DPlayer | null;

    /**
     * 视频播放器初始化
     */
    const init = (src: string, opt: options): DPlayer => {
      if (dp) {
        dp.destroy();
        dp = null;
      }
      SHOW.value = true;
      videoSrc.value = src;
      let type = "customHls";
      type = isFlv(src) ? "customFlv" : type;
      type = isHls(src) ? "customHls" : type;
      dp = new DPlayer({
        container: UI_VIDEO_BOX.value,
        live: opt.live,
        autoplay: opt.autoPlay,
        hotkey: true,
        volume: 0,
        mutex: false,
        video: {
          url: src,
          type: type,
          customType: getVideoType(src),
        },
      });
      return dp;
    };

    /**
     * 关闭播放器
     */
    const close = (): void => {
      if (dp) {
        // dp.video.pause();
        // dp.pause();
        dp.destroy();

        if (isHls(videoSrc.value)) {
          videoData.value.stopLoad();
        }
        if (isFlv(videoSrc.value)) {
          videoData.value.unload();
          videoData.value.detachMediaElement();
          videoData.value.destroy();
        }
        dp = null;
        videoData.value = null;
      }
      SHOW.value = false;
      context.emit("update:visible", false);
    };

    /**
     *检测视频链接格式
     */
    const isFlv = (src: string): boolean => src.indexOf(".flv") > -1;
    const isHls = (src: string): boolean => src.indexOf(".m3u8") > -1;

    /**
     * 根据src返回对应格式的播放配置参数
     * @param src
     */
    const getVideoType = (src: string) => {
      //判断是否是flv视频
      if (isFlv(src)) {
        return {
          customFlv: function (video: HTMLVideoElement) {
            const flvPlayer = FLV.createPlayer({
              type: "flv",
              url: video.src,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
            videoData.value = flvPlayer;
          },
        };
      }
      //判断是否是m3u8格式的视频
      if (isHls(src)) {
        return {
          customHls: function (video: HTMLVideoElement) {
            const hls = new HLS();
            hls.loadSource(video.src);
            hls.attachMedia(video);
            videoData.value = hls;
          },
        };
      } else {
        return {};
      }
    };

    return {
      UI_VIDEO_BOX,
      init,
      SHOW,
      close,
    };
  },
});
</script>

<style scoped lang="less">
.ui-video-enter-active,
.ui-video-leave-active {
  transition: all 0.3s;
  opacity: 1 !important;
}
.ui-video-enter,
.ui-video-leave-to {
  opacity: 0 !important;
}
.ui-video {
  z-index: 999;
  width: 100%;
  height: 100%;
  &.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .ui-video-mask {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }
  .ui-video-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      width: 100%;
      height: 100%;
    }
    .ui-video-closeBtn {
      position: absolute;
      z-index: 100001;
      right: 8px;
      top: 8px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        fill: #ffffff;
      }
    }
    &.box-mask {
      position: absolute;
      z-index: 2;
      left: 50%;
      top: 50%;
      width: 800px;
      height: 450px;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
