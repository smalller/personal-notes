<template>
  <div class="mp4">
    <div
      class="videoBox"
      ref="videoBox"
      @click="showControl"
      @touchEnd="showControl"
    >
      <video
        ref="video"
        @play="isPlay = true"
        @pause="isPlay = false"
        @timeupdate="loaddata"
        @canplay="loaddata"
        :src="src"
      ></video>

      <div class="barBox" v-show="controlShow && !isLive">
        <div class="btnBox">
          <img
            v-show="!isPlay"
            @click="play"
            src="../images/mediaDetails/videoPlay.png"
            alt=""
          />
          <img
            v-show="isPlay"
            @click="pause"
            src="../images/mediaDetails/videoPause.png"
            alt=""
          />
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
          @touchend="touchUp"
          @touchleave="touchUp"
          @touchmove="move($event)"
        >
          <!--      <input value="20" type="range">-->
          <div :style="{ width: loadLength + '%' }"></div>
          <div :style="{ width: readLength + '%' }"></div>
          <div :style="{ left: readLength + '%' }"></div>
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
            src="../images/mediaDetails/fullScreen.png"
            alt=""
          />
          <img
            v-show="isFullScreen"
            @click="exitFullScreen"
            src="../images/mediaDetails/fullExit.png"
            alt=""
          />
        </div>
      </div>
      <div class="barBox" v-show="controlShow && isLive">
        <div class="btnBox">
          <img
            v-show="!isPlay"
            @click="play"
            src="../images/mediaDetails/videoPlay.png"
            alt=""
          />
          <img
            v-show="isPlay"
            @click="pause"
            src="../images/mediaDetails/videoPause.png"
            alt=""
          />
        </div>
        <div class="time">
          <span>LIVE</span>
        </div>
        <div class="fullBtnBox">
          <img
            v-show="!isFullScreen"
            @click="fullScreen"
            src="../images/mediaDetails/fullScreen.png"
            alt=""
          />
          <img
            v-show="isFullScreen"
            @click="exitFullScreen"
            src="../images/mediaDetails/fullExit.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FLV from "flv.js";
import HLS from "hls.js";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "player",
  setup() {
    const isFullScreen = ref(false);
    const controlShow = ref(true);
    const loadLength = ref(0);
    const readLength = ref(0);
    let isTouch = false;
    const isPlay = ref(false);
    const timeText = ref("--:--");
    const timeText2 = ref("--:--");
    let duration = 0;
    const src = ref("");
    let timer = 0;
    const isLive = ref(false);
    let videoData: any;
    let url = "";
    let autoPlay = true;

    const bar = ref(null);
    const video = ref(null);
    const videoBox = ref(null);

    /**
     *检测视频链接格式
     */
    const isFlv = (src: string) => src.indexOf(".flv") > -1;
    const isHls = (src: string) => src.indexOf(".m3u8") > -1;
    const touchEnd = (e: TouchEvent | MouseEvent) => {
      isTouch = true;
      move(e);
    };
    const move = (e: any) => {
      if (isTouch) {
        const barEl: HTMLElement = bar.value as unknown as HTMLElement;
        const width: number = barEl.offsetWidth;
        const nx: number = barEl.offsetLeft;
        let x =
          e?.targetTouches?.length > 0
            ? e.targetTouches[0].pageX - nx
            : e.x - nx;
        (video.value as unknown as HTMLVideoElement).currentTime =
          (x / width) * duration;
      }
    };
    const touchUp = () => {
      isTouch = false;
    };

    const showControl = () => {
      controlShow.value = true;
      hideControl();
    };

    const hideControl = () => {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
      timer = setTimeout(() => {
        controlShow.value = !isPlay.value;
      }, 5000);
    };

    const loaddata = () => {
      const myVideo = video.value as unknown as HTMLVideoElement;
      let buffered = myVideo.buffered,
        loaded;

      if (buffered.length) {
        duration = myVideo.duration;
        // 获取当前缓冲进度
        loaded = buffered.end(buffered.length - 1);
        loadLength.value = (loaded / myVideo.duration) * 100;
        readLength.value = (myVideo.currentTime / myVideo.duration) * 100;
        timeText.value = getTime(myVideo.currentTime);
        timeText2.value = getTime(myVideo.duration);
      }
    };

    const play = () => {
      if (autoPlay) {
        (video.value as unknown as HTMLVideoElement).play();
      }
      isPlay.value = true;
      hideControl();
    };

    const pause = () => {
      (video.value as unknown as HTMLVideoElement).pause();
      isPlay.value = false;
    };

    const fullScreen = () => {
      const full = videoBox.value as any;
      if (full?.RequestFullScreen) {
        full.RequestFullScreen();
        //兼容Firefox
      } else if (full?.mozRequestFullScreen) {
        full.mozRequestFullScreen();
        //兼容Chrome, Safari and Opera等
      } else if (full?.webkitRequestFullScreen) {
        full.webkitRequestFullScreen();
        //兼容IE/Edge
      } else if (full?.msRequestFullscreen) {
        full.msRequestFullscreen();
      }
      isFullScreen.value = true;
    };

    const getTime = (num: number) => {
      // num = num / 1000
      let day = Math.floor(num / (24 * 3600));
      let hour: number | string = Math.floor((num % (24 * 3600)) / 3600);
      let minuts: number | string = Math.floor((num % 3600) / 60);
      let second: number | string = Math.floor(num % 60);
      if (second.toString().length < 2) {
        second = "0" + second.toString();
      }
      if (minuts.toString().length < 2) {
        minuts = "0" + minuts.toString();
      }
      if (hour.toString().length < 2) {
        hour = "0" + hour.toString();
      }
      return day > 0
        ? `${day}天 ${hour}:${minuts}:${second}`
        : hour > 0
        ? `${hour}:${minuts}:${second}`
        : `${minuts}:${second}`;
      // return `${day}天 ${hour}:${minuts}:${second}`
    };

    const exitFullScreen = () => {
      const el = document as any;
      if (el?.exitFullScreen) {
        el.exitFullScreen();
        //兼容Firefox
      } else if (el?.mozCancelFullScreen) {
        el.mozCancelFullScreen();
        //兼容Chrome, Safari and Opera等
      } else if (el?.webkitExitFullscreen) {
        el.webkitExitFullscreen();
        //兼容IE/Edge
      }
      // else if (document.element?.msExitFullscreen) {
      //   element.msExitFullscreen();
      // }
      isFullScreen.value = false;
    };

    interface VideoConfig {
      live: boolean;
      autoPlay: boolean;
    }
    const setPlay = (src: string, info: VideoConfig) => {
      url = src;
      close();
      if (isPlay.value) {
        pause();
      }
      if (info) {
        isLive.value = info.live || false;
        autoPlay = info.autoPlay || true;
      }
      // console.log(video.value);
      (video.value as unknown as HTMLVideoElement).muted = true;
      if (isFlv(src)) {
        flvPlay(src);
      } else if (isHls(src)) {
        hlsPlay(src);
      } else {
        (video.value as unknown as HTMLVideoElement).load();
      }
      controlShow.value = true;
    };

    const flvPlay = (src: string) => {
      if (FLV.isSupported()) {
        const flvPlayer = FLV.createPlayer({
          type: "flv",
          url: src,
        });
        flvPlayer.attachMediaElement(
          video.value as unknown as HTMLVideoElement
        );
        flvPlayer.load();
        if (autoPlay) {
          flvPlayer.play();
        }
        videoData = flvPlayer;
      }
    };

    const hlsPlay = (src: string) => {
      if (HLS.isSupported()) {
        const videoEl = video.value as unknown as HTMLVideoElement;
        const hlsPlay = new HLS();
        hlsPlay.loadSource(src);
        hlsPlay.attachMedia(videoEl);
        hlsPlay.on(HLS.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            videoEl.play();
          }
        });
        videoData = hlsPlay;
      }
    };

    const close = () => {
      if (videoData) {
        if (isHls(url)) {
          videoData.stopLoad();
        }
        if (isFlv(url)) {
          videoData.unload();
          videoData.detachMediaElement();
          videoData.destroy();
        }
      }
    };

    document.addEventListener("webkitfullscreenchange", function (e: any) {
      if (!e.currentTarget.webkitIsFullScreen) {
        isFullScreen.value = false;
      }
    });
    window.onresize = function () {
      if (!checkFull()) {
        //要执行的动作
        console.log(222);
        isFullScreen.value = false;
      }
    };
    function checkFull() {
      let isFull =
        document.fullscreenEnabled ||
        (window as any)?.fullScreen ||
        (document as any)?.webkitIsFullScreen ||
        (document as any)?.msFullscreenEnabled;
      //to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    }

    return {
      video,
      videoBox,
      isPlay,
      src,
      controlShow,
      isLive,
      loadLength,
      timeText,
      timeText2,
      readLength,
      isFullScreen,
      exitFullScreen,
      fullScreen,
      touchEnd,
      move,
      showControl,
      play,
      pause,
      loaddata,
      touchUp,
      setPlay,
    };
  },
});
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
    video {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #1c1c1c;
    }
  }

  .barBox {
    padding: 0 16px;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    // height: 10.67vw;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    .btnBox {
      width: 4.8vw;
      height: 4.8vw;
      display: none;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .bar {
      display: none;
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
      display: none;
      span {
        font-size: 9px;
        color: #ffffff;
      }
    }

    .fullBtnBox {
      width: 0.29rem;
      height: 0.29rem;
      position: absolute;
      right: 0.05rem;
      bottom: 0.05rem;
      background: rgba(0, 0, 0, 0.5);
      align-items: center;
      justify-content: center;
      display: flex;
      cursor: pointer;
      border-radius: 0.04rem;
      img {
        width: 0.2rem;
        height: 0.2rem;
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
