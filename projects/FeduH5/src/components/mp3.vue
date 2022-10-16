<template>
<div class="mp3">
  <div class="imgBox">
    <img :src="imgUrl" alt="">
  </div>
  <div class="barBox">
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
      <span>{{timeText2}}</span>
    </div>
  </div>
  <div class="controlBox">
    <div @click="audioChange('pre')">
      <img src="../assets/image/mediaDetails/pre.png" alt="">
    </div>
    <div >
      <img v-show="!isPlay" @click="play" src="../assets/image/mediaDetails/plays.png" alt="">
      <img v-show="isPlay" @click="pause" src="../assets/image/mediaDetails/pause.png" alt="">
    </div>
    <div @click="audioChange('next')">
      <img src="../assets/image/mediaDetails/next.png" alt="">
    </div>
  </div>
  <audio v-show="false"
         ref="audio"
         preload
         @play="isPlay = true"
         @pause="isPlay = false"
         controls
         @timeupdate="loaddata"
         @canplay="loaddata"
         :src="src"></audio>
</div>
</template>

<script>
export default {
  name: "mp3",
  data() {
    return {
      imgUrl: '',
      loadLength: 0,
      readLength: 0,
      isTouch: false,
      isPlay: false,
      timeText: '--:--',
      timeText2: '--:--',
      duration: 0,
      currentTime: 0,
      src: ''
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
        this.$refs.audio.currentTime =  (x)/width*this.duration
      }
    },
    touchUp() {
      this.isTouch = false
    },
    loaddata() {
      const myAudio =this.$refs.audio
      let buffered = myAudio.buffered,
          loaded;

      if (buffered.length) {
        this.duration = myAudio.duration
        this.currentTime = myAudio.currentTime
        // 获取当前缓冲进度
      loaded =  buffered.end(buffered.length - 1)
        this.loadLength = loaded/myAudio.duration*100
        this.readLength = myAudio.currentTime/myAudio.duration*100
        this.timeText = this.getTime(myAudio.currentTime)
        this.timeText2 = this.getTime(myAudio.duration)
      }
    },
    play() {
      this.$refs.audio.play()
      this.isPlay = true
    },
    pause() {
      this.$refs.audio.pause()
      this.isPlay = false
    },
    audioChange(type){
      console.log(type)
      this.$emit(type)
    },
    setPlay(src, info) {
      if (this.isPlay) {
        this.pause()
      }
      if (info?.cover) {
        this.imgUrl = info.cover
      }
      this.src = src
      this.$refs.audio.load()
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
.mp3{
  .imgBox{
    padding: 42px 0;
    display: flex;
    justify-content: center;
    img{
      width: 50.67vw;
      height: 50.67vw;
      border-radius: 10px;
      overflow: hidden;
    }
  }
  .barBox{
    padding: 0 16px;
    .bar{
      width: 100%;
      height: 2px;
      background: #f0f0f0;
      position: relative;
      >div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        &:nth-child(1){
          background: #d8d8d8;
        }
        &:nth-child(2){
          background: #ffaa53;
        }
        &:nth-child(3){
          width: 14px;
          height: 14px;
          box-sizing: border-box;
          border: 4px solid #ffaa53;
          border-radius:50%;
          background: #FFFFFF;
          top: 50%;
          transform: translate(-7px,-50%);
          cursor: pointer;
        }
      }
      input{
        -webkit-appearance: none!important;
        width: 100%;
        border-radius: 10px;
        background: #ffaa53;
        &:focus{
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
          border: solid 4px #FF9F01; /*设置边框*/
          //box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/
        }
        &::-ms-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          margin-top: -6px; /*使滑块超出轨道部分的偏移量相等*/
          background: #ffffff;
          border-radius: 50%; /*外观设置为圆形*/
          border: solid 4px #FF9F01; /*设置边框*/
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
    .time{
      margin-top:6px;
      display: flex;
      justify-content: space-between;
      white-space: nowrap;
      span{
        font-size: 12px;
        &:nth-child(1) {
          color: #1c1c1c;
        }
        &:nth-child(2) {
          color: #6b6b6b;
        }
      }
    }
  }
  .controlBox{
    padding-top: 24px;
    padding-bottom: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    >div {
      img{
        width: 100%;
        height: 100%;
      }
      &:nth-child(1){
        width: 34px;
        height: 34px;
      }
      &:nth-child(2){
        margin: 0 24px;
        width: 96px;
        height: 96px;
      }
      &:nth-child(3){
        width: 34px;
        height: 34px;
      }
    }
  }
}
</style>
