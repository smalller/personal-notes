<template>
  <div>
    <transition name="ui-video">
      <div
        v-show="SHOW"
        class="ui-video"
        :style="{
          position: mask ? '' : 'relative',
          border: mask ? '1px solid #000000' : '',
        }"
        :class="{ mask: mask }"
      >
        <div v-if="mask" class="ui-video-mask"></div>
        <div class="ui-video-box" :class="{ 'box-mask': mask }">
          <div ref="UI_VIDEO_BOX"></div>
          <div v-if="mask" class="ui-video-closeBtn" @click="close">
            <i class="iconfont icon-a-zu238"></i>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import HLS from 'hls.js'
  import FLV from 'flv.js'
  import DPlayer from 'dplayer'
  export default {
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
    data() {
      return {
        videoData: null,
        videoSrc: '',
        SHOW: false,
        dp: null,
      }
    },
    watch: {
      visible: {
        handler(newVal) {
          this.SHOW = newVal
        },
      },
    },
    mounted() {
      if (!this.mask) {
        this.SHOW = true
      }
    },
    methods: {
      isFlv(src) {
        return src.indexOf('.flv') > -1
      },

      isHls(src) {
        return src.indexOf('.m3u8') > -1
      },

      // 视频播放器初始化
      init(src, opt) {
        this.SHOW = true
        if (this.dp) {
          this.dp.destroy()
          this.dp = null
        }
        this.videoSrc = src
        let type = 'customHls'
        type = this.isFlv(src) ? 'customFlv' : type
        type = this.isHls(src) ? 'customHls' : type
        this.dp = new DPlayer({
          container: this.$refs.UI_VIDEO_BOX,
          live: opt.live,
          autoplay: opt.autoPlay,
          hotkey: true,
          volume: 0.5,
          mutex: false,
          video: {
            url: src,
            type: type,
            customType: this.getVideoType(src),
          },
        })
        return this.dp
      },

      // 关闭播放器
      close() {
        if (this.dp) {
          this.dp.destroy()
          if (this.isHls(this.videoSrc)) {
            this.videoData.stopLoad()
          }
          if (this.isFlv(this.videoSrc)) {
            this.videoData.unload()
            this.videoData.detachMediaElement()
            this.videoData.destroy()
          }
          this.dp = null
          this.videoData = null
        }
        this.SHOW = false
      },

      // 根据src返回对应格式的播放配置参数
      getVideoType(src) {
        //判断是否是flv视频
        if (this.isFlv(src)) {
          return {
            customFlv: (video) => {
              const flvPlayer = FLV.createPlayer({
                type: 'flv',
                url: video.src,
              })
              flvPlayer.attachMediaElement(video)
              flvPlayer.load()
              this.videoData = flvPlayer
            },
          }
        }
        //判断是否是m3u8格式的视频
        if (this.isHls(src)) {
          return {
            customHls: (video) => {
              const hls = new HLS()
              hls.loadSource(video.src)
              hls.attachMedia(video)
              this.videoData = hls
            },
          }
        } else {
          return {}
        }
      },
    },
  }
</script>

<style scoped lang="scss">
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
