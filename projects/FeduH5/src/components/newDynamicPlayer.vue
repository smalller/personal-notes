<template>
  <div
    class="mp4"
    @click="isPlay?pause():play()"
  >
    <div
      class="videoBox"
      :class="{ fullScreen: isFullScreen && isIphone }"
      ref="videoBox"
      @click="showControl"
    >
      <video
        ref="video"
        preload
        :autoplay="autoPlay"
        @play="player()"
        @pause="pauses()"
        @timeupdate="loaddata"
        @canplay="loaddata"
        :src="src"
        :muted="muted"
        webkit-playsinline
        playsinline
        x5-playsinline
        loop
      ></video>
      <div
        class="barBox"
        v-show="controlShow&&!isLive&&controls"
      >
        <div class="btnBox">
          <img
            v-show="!isPlay"
            @click="play"
            src="../assets/image/mediaDetails/videoPlay.png"
            alt=""
          >
          <img
            v-show="isPlay"
            @click="pause"
            src="../assets/image/mediaDetails/videoPause.png"
            alt=""
          >
        </div>
        <div
          class="bar"
          ref="bar"
          @mousedown="touchEnd"
          @mouseout="touchUp"
          @mouseup="touchUp"
          @mouseleave="touchUp"
          @mousemove="move($event)"
          @touchstart="touchEnd"
          @click="touchUp"
          @touchleave="touchUp"
          @touchmove="move($event)"
        >
          <!--      <input value="20" type="range">-->
          <div :style="{width: loadLength+'%'}"></div>
          <div :style="{width: readLength+'%'}"></div>
          <div :style="{left: readLength+'%'}"></div>
        </div>
        <div class="time">
          <span>{{ timeText }}</span>
          <span>/</span>
          <span>{{ timeText2 }}</span>
        </div>
        <div class="fullBtnBox">
          <img
            v-show="!isFullScreen"
            @click="fullScreen"
            src="../assets/image/mediaDetails/fullScreen.png"
            alt=""
          >
          <img
            v-show="isFullScreen"
            @click="exitFullScreen"
            src="../assets/image/mediaDetails/fullExit.png"
            alt=""
          >
        </div>
      </div>
      <div
        class="barBox"
        v-show="controlShow&isLive&&controls"
      >
        <div class="btnBox">
          <img
            v-show="!isPlay"
            @click="play"
            src="../assets/image/mediaDetails/videoPlay.png"
            alt=""
          >
          <img
            v-show="isPlay"
            @click="pause"
            src="../assets/image/mediaDetails/videoPause.png"
            alt=""
          >
        </div>
        <div class="time">
          <span>LIVE</span>
        </div>
        <div class="fullBtnBox">
          <img
            v-show="!isFullScreen"
            @click="fullScreen"
            src="../assets/image/mediaDetails/fullScreen.png"
            alt=""
          >
          <img
            v-show="isFullScreen"
            @click="exitFullScreen"
            src="../assets/image/mediaDetails/fullExit.png"
            alt=""
          >
        </div>
      </div>
      <!-- {{controlShow}}{{isPlay}} -->

      <div class="img-box">
        <img
          v-if="controlShow && isPlay"
          src="../assets/dynamic-share/pause.png"
          alt=""
        >
        <img
          v-if="controlShow && !isPlay"
          src="../assets/dynamic-share/play.png"
          alt=""
        >
      </div>
    </div>

  </div>
</template>

<script>
import FLV from 'flv.js'
import HLS from 'hls.js'


export default {
  name: "player",
  props: {
    controls: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isIphone: micell.ua.isIPhone(),
      isFullScreen: false,
      controlShow: true,
      loadLength: 0,
      readLength: 0,
      isTouch: false,
      isPlay: false,
      timeText: '--:--',
      timeText2: '--:--',
      duration: 0,
      currentTime: 0,
      src: '',
      timer: null,
      isLive: false,
      videoData: null,
      url: '',
      autoPlay: false,
      muted: false,
      isClickVideo: false
    }
  },
  methods: {
    player() {
      this.isPlay = true
      this.play()
    },
    pauses() {
      this.isPlay = false
    },
    /**
     *检测视频链接格式
     */
    isFlv: (src) => src.indexOf(".flv") > -1,
    isHls: (src) => src.indexOf(".m3u8") > -1,
    touchEnd(e) {
      this.isTouch = true
      this.move(e)
    },
    move(e) {
      if (this.isTouch) {
        const width = this.$refs.bar.offsetWidth
        const nx = this.$refs.bar.offsetLeft
        let x = e?.targetTouches?.length > 0 ? e.targetTouches[0].pageX - nx : e.x - nx
        this.$refs.video.currentTime = (x) / width * this.duration
      }
    },
    touchUp() {
      this.isTouch = false
    },
    showControl() {
      this.controlShow = true
      this.hideControl()
    },
    hideControl() {
      this.controlShow = true;
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }

      this.timer = setTimeout(() => {
        this.controlShow = !this.isPlay
      }, 1000)
    },
    loaddata() {
      const myVideo = this.$refs.video
      let buffered = myVideo.buffered,
        loaded;

      if (buffered.length) {
        this.duration = myVideo.duration
        this.currentTime = myVideo.currentTime
        // 获取当前缓冲进度
        loaded = buffered.end(buffered.length - 1)
        this.loadLength = loaded / myVideo.duration * 100
        this.readLength = myVideo.currentTime / myVideo.duration * 100
        this.timeText = this.getTime(myVideo.currentTime)
        this.timeText2 = this.getTime(myVideo.duration)
      }
    },
    play() {
      this.$refs.video.play()
      this.isPlay = true
      this.hideControl()
    },
    pause() {
      this.$refs.video.pause()
      this.isPlay = false
      this.hideControl()
    },
    fullScreen() {
      const full = this.$refs.videoBox
      if (full.requestFullscreen) {
        full.requestFullscreen();
      } else if (full.mozRequestFullScreen) {
        full.mozRequestFullScreen();
      } else if (full.webkitRequestFullscreen) {
        full.webkitRequestFullscreen();
      } else if (this.$refs.video.webkitSupportsFullscreen) {
        this.$refs.video.webkitEnterFullscreen();
      }
      this.isFullScreen = true
    },
    exitFullScreen() {
      if (document?.exitFullScreen) {
        document.exitFullScreen();
        //兼容Firefox
      } else if (document?.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        //兼容Chrome, Safari and Opera等
      } else if (document?.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        //兼容IE/Edge
      } else if (element?.msExitFullscreen) {
        element.msExitFullscreen();
      }
      this.isFullScreen = false
    },
    videoChange(type) {
      this.$emit(type)
    },
    setPlay(src, info) {
      this.close()
      if (this.isPlay) {
        this.pause()
      }
      this.url = src
      if (info) {
        this.isLive = info.live || false
        this.autoPlay = info.autoPlay || false
        console.log(info)
      }
      // this.$refs.video.muted = true
      if (this.isFlv(src)) {
        this.flvPlay(src)
      } else if (this.isHls(src)) {
        this.hlsPlay(src)
      } else {
        this.src = src
        if (this.autoPlay) {
          this.$refs.video.play().catch(() => {
            this.muted = true;
            this.$refs.video.play()
          })
          //
        }
      }
      this.controlShow = true
      return this.$refs.video
    },
    flvPlay(src) {
      if (FLV.isSupported()) {
        const flvPlayer = FLV.createPlayer({
          type: "flv",
          url: src,
          isLive: true,
          config: {
            autoCleanupSourceBuffer: true,
          },
        });
        flvPlayer.attachMediaElement(this.$refs.video);
        flvPlayer.load();
        if (this.autoPlay) {

          try {
            flvPlayer.play();
          } catch (error) {
            flvPlayer.muted = true;
            this.muted = true;
            flvPlayer.play();
          }

        }
        this.videoData = flvPlayer;
      }
    },
    hlsPlay(src) {
      const video = this.$refs.video;
      if (HLS.isSupported()) {
        console.log("HLS");
        const hlsPlay = new HLS();
        hlsPlay.loadSource(src);
        hlsPlay.attachMedia(video);
        hlsPlay.on(HLS.Events.MANIFEST_PARSED, () => {
          if (this.autoPlay) {
            console.log(video);
            video.play().catch((e) => {
              console.error(e);
              console.log("2222");
              this.muted = true;
              hlsPlay.muted = true;
              video.play();
            });
          }
        });
        hlsPlay.on(HLS.Events.ERROR, (event, data) => {
          console.log(event, data);
          // 监听出错事件
          console.log("加载失败");
        });
        this.videoData = hlsPlay;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    },
    close() {
      if (this.videoData) {
        if (this.isHls(this.url)) {
          this.videoData.stopLoad();
        }
        if (this.isFlv(this.url)) {
          this.videoData.unload();
          this.videoData.detachMediaElement();
          this.videoData.destroy();
        }
      }
    },
    getTime(num) {
      // num = num / 1000
      let day = Math.floor(num / (24 * 3600))
      let hour = Math.floor((num % (24 * 3600)) / 3600)
      let minuts = Math.floor((num % 3600) / 60)
      let second = Math.floor(num % 60)
      if (second.toString().length < 2) {
        second = '0' + second.toString()
      }
      if (minuts.toString().length < 2) {
        minuts = '0' + minuts.toString()
      }
      if (hour.toString().length < 2) {
        hour = '0' + hour.toString()
      }
      return day > 0
        ? `${day}天 ${hour}:${minuts}:${second}`
        : hour > 0 ? `${hour}:${minuts}:${second}` : `${minuts}:${second}`
      // return `${day}天 ${hour}:${minuts}:${second}`
    },
    getAutoPlayEvent() {
      this.muted = false
    }

  },
  mounted() {
    document.body.addEventListener('touchend', () => {
      this.getAutoPlayEvent()
    }, {
      once: true
    })
  }
}
</script>

<style scoped lang="less">
.mp4 {
  width: 100%;
  height: 100%;
  //height: 56.27vw;
  .videoBox {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    &.fullScreen {
      position: fixed;
      height: 100%;
      z-index: 3;
    }
    video {
      width: 100%;
      // height: 100%;
      object-fit: contain;
      overflow: hidden;
      background: #1c1c1c;
    }

    .img-box {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -31px;
      margin-top: -31px;
      width: 62px;
      height: 62px;
      > img {
        width: 62px;
        height: 62px;
      }
    }
  }

  .barBox {
    padding: 0 16px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 10.67vw;
    background: rgba(0, 0, 0, 0.49);
    display: flex;
    align-items: center;

    display: none;

    .btnBox {
      width: 4.8vw;
      height: 4.8vw;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .bar {
      margin-left: 2.67vw;
      width: 58vw;
      height: 2px;
      background: #f0f0f0;
      position: relative;

      > div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        &:nth-child(1) {
          background: #d8d8d8;
        }

        &:nth-child(2) {
          background: #ffaa53;
        }

        &:nth-child(3) {
          width: 14px;
          height: 14px;
          box-sizing: border-box;
          border: 4px solid #ffaa53;
          border-radius: 50%;
          background: #ffffff;
          top: 50%;
          transform: translate(-7px, -50%);
          cursor: pointer;
        }
      }

      input {
        -webkit-appearance: none !important;
        width: 100%;
        border-radius: 10px;
        background: #ffaa53;

        &:focus {
          outline: none;
        }

        &:focus::-ms-fill-lower {
          background: #ffaa53;
        }

        &:focus::-ms-fill-upper {
          background: #d8d8d8;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        &::-webkit-slider-runnable-track {
          height: 2px;
          border-radius: 2px; /*将轨道设为圆角的*/
          background: #f0f0f0;
        }

        &::-ms-track {
          height: 2px;
          border-radius: 2px; /*将轨道设为圆角的*/
          background: #f0f0f0;
        }

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          margin-top: -6px; /*使滑块超出轨道部分的偏移量相等*/
          background: #ffffff;
          border-radius: 50%; /*外观设置为圆形*/
          border: solid 4px #ff9f01; /*设置边框*/
          //box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/
        }

        &::-ms-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          margin-top: -6px; /*使滑块超出轨道部分的偏移量相等*/
          background: #ffffff;
          border-radius: 50%; /*外观设置为圆形*/
          border: solid 4px #ff9f01; /*设置边框*/
          //box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/
        }

        &::-ms-fill-lower {
          /*进度条已填充的部分*/
          height: 2px;
          border-radius: 2px;
          background: #ffaa53;
        }

        ::-ms-fill-upper {
          /*进度条未填充的部分*/
          height: 2px;
          border-radius: 2px;
          background: #d8d8d8;
        }
      }
    }

    .time {
      margin: 0 3.2vw;

      span {
        font-size: 9px;
        color: #ffffff;
      }
    }

    .fullBtnBox {
      width: 6.4vw;
      height: 6.4vw;
      position: absolute;
      right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .controlBox {
    padding-top: 24px;
    padding-bottom: 18px;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      img {
        width: 100%;
        height: 100%;
      }

      &:nth-child(1) {
        width: 34px;
        height: 34px;
      }

      &:nth-child(2) {
        margin: 0 24px;
        width: 96px;
        height: 96px;
      }

      &:nth-child(3) {
        width: 34px;
        height: 34px;
      }
    }
  }
}
</style>
