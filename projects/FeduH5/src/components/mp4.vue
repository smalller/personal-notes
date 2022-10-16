<template>
  <div class="mp4">
    <div class="videoBox" ref="videoBox" @click="showControl" @touchEnd="showControl">
      <video ref="video"
             preload
             @play="isPlay = true"
             @pause="isPlay = false"
             @timeupdate="loaddata"
             @canplay="loaddata"
             playsinline
             webkit-playsinline
             x5-playsinline
             :autoplay="true"
             x-webkit-airplay="true"
             x5-video-player-type="h5"
             x5-video-orientation="h5"
             x5-video-player-fullscreen="true"
             preload="auto"
             :src="src"></video>

      <div class="barBox" v-show="controlShow">
        <div  class="btnBox">
          <img v-show="!isPlay" @click="play" src="../assets/image/mediaDetails/videoPlay.png" alt="">
          <img v-show="isPlay" @click="pause" src="../assets/image/mediaDetails/videoPause.png" alt="">
        </div>
        <div class="bar"
             ref="bar"
             @mousedown="touchEnd"
             @mouseout="touchUp"
             @mouseup="touchUp"
             @mouseleave="touchUp"
             @mousemove="move($event)"
             @touchstart="touchEnd"
             @touchend="touchUp"
             @touchleave="touchUp"
             @touchmove="move($event)">
          <!--      <input value="20" type="range">-->
          <div :style="{width: loadLength+'%'}"></div>
          <div :style="{width: readLength+'%'}"></div>
          <div :style="{left: readLength+'%'}"></div>
        </div>
        <div class="time">
          <span>{{timeText}}</span>
          <span>/</span>
          <span>{{timeText2}}</span>
        </div>
        <div  class="fullBtnBox">
          <img v-show="!isFullScreen" @click="fullScreen" src="../assets/image/mediaDetails/fullScreen.png" alt="">
          <img v-show="isFullScreen" @click="exitFullScreen" src="../assets/image/mediaDetails/fullExit.png" alt="">
        </div>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: "mp4",
  data() {
    return {

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
      timer: null
    }
  },
  methods: {
    touchEnd(e) {
      this.isTouch = true
      this.move(e)
    },
    move(e) {
      if (this.isTouch) {
        const width = this.$refs.bar.offsetWidth
        const nx =  this.$refs.bar.offsetLeft
        let x =  e?.targetTouches?.length>0?e.targetTouches[0].pageX-nx:e.x-nx
        this.$refs.video.currentTime =  (x)/width*this.duration
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
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.controlShow = !this.isPlay
      }, 5000)
    },
    loaddata() {
      const myVideo =this.$refs.video
      let buffered = myVideo.buffered,
          loaded;

      if (buffered.length) {
        this.duration = myVideo.duration
        this.currentTime = myVideo.currentTime
        // 获取当前缓冲进度
        loaded =  buffered.end(buffered.length - 1)
        this.loadLength = loaded/myVideo.duration*100
        this.readLength = myVideo.currentTime/myVideo.duration*100
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
    },
    fullScreen() {
      const full = this.$refs.videoBox
      if (full?.RequestFullScreen) {
        full.RequestFullScreen()
        //兼容Firefox
      } else if (full?.mozRequestFullScreen) {
        full.mozRequestFullScreen()
        //兼容Chrome, Safari and Opera等
      } else if (full?.webkitRequestFullScreen) {
        full.webkitRequestFullScreen()
        //兼容IE/Edge
      } else if (full?.msRequestFullscreen) {
        full.msRequestFullscreen()
      }
      this.isFullScreen = true
    },
    exitFullScreen() {
      if(document?.exitFullScreen) {
        document.exitFullScreen();
        //兼容Firefox
      } else if(document?.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        //兼容Chrome, Safari and Opera等
      } else if(document?.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        //兼容IE/Edge
      } else if(element?.msExitFullscreen) {
        element.msExitFullscreen();
      }
      this.isFullScreen = false
    },
    videoChange(type){
      this.$emit(type)
    },
    setPlay(src, info) {
      if (this.isPlay) {
        this.pause()
      }

      this.controlShow = true
      this.src = src
      // console.log(src)
      // console.log(this.$refs.video)
      // this.$refs.video.load()
      this.$refs.video.autoplay = true
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
          : hour>0?`${hour}:${minuts}:${second}`:`${minuts}:${second}`
      // return `${day}天 ${hour}:${minuts}:${second}`
    }

  }
}
</script>

<style scoped lang="less">
.mp4{
  .videoBox{
    display: flex;
    justify-content: center;
    position: relative;
    video{
      width: 100vw;
      height: 56.27vw;
      overflow: hidden;
      background: #1C1C1C;
    }
  }
  .barBox {
    padding: 0 16px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 36px;
    background: rgba(0, 0, 0, 0.49);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
    box-sizing: border-box;
    > div {
      display: flex;
      align-items: center;
      &:first-child {
        //flex: 1;
      }
    }
    .btnBox {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 18px;
        height: 18px;
      }
    }

    .bar {
      margin-left: 10px;
      //width: 50vw;
      flex: 1;
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
      margin: 0 10px;
      display: flex;
      align-items: center;
      span {
        font-size: 9px;
        color: #ffffff;
      }
    }

    .fullBtnBox {
      width: 36px;
      height: 36px;
      box-sizing: border-box;
      padding: 4px;
      img{
        width: 100%;
        height: 100%;
      }
      //margin-left: 10px;
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
