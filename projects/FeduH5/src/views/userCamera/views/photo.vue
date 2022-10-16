<template>
  <div class="photoBox">
    <div class="canvasBox">
      <img class="showImg" v-show="imgUrl" :src="imgUrl" alt="" />
      <img v-show="!imgUrl" src="../assets/cameraBox.png" alt="" />
      <video ref="video" src=""
      :width="width"
      :height="height"
        autoplay
        preload
        webkit-playsinline
        playsinline
        x5-playsinline></video>
      <!-- <canvas ref="canvas"></canvas> -->
    </div>
    <div class="controlBox">
      <div @click="close" v-if="!imgUrl">取消</div>
      <div @click="getCamera" v-else>重拍</div>
      <div @click="cameraPhoto" v-show="!imgUrl">
        <div></div>
      </div>
      <div @click="changeCamera" v-if="!imgUrl">
        <img src="../assets/cameraChange.png" alt="" />
      </div>
      <div v-else>
        <span @click="save">使用照片</span>
      </div>
    </div>
  </div>
</template>

<script>

// import wx from 'weixin-js-sdk'
import {mapGetters} from 'vuex';
export default {
  name: "photo",
  data() {
    return {
      ctx: null,
      front: false,
      timer: null,
      cameraStream: null,
      video: null,
      width: 0,
      height: 0,
      imgUrl: "",
      blob: null,
      pix: 358/441,
      isApple: micell.ua.isIPhone() || micell.ua.isIPad() || micell.ua.isIOS() || micell.ua.isMacOS(),
    };
  },
  computed: {
    ...mapGetters(['userId','token'])
  },
  methods: {
    getCamera() {
      const that = this;
      that.cameraStop();
      window.URL = window.URL || window.webkitURL ;

      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }


      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: that.front ? "user" : "environment",
          },
        })
        .then((stream) => {
          let width = 0
          let height =0
          let x = 0
          let y = 0
          that.cameraStream = stream;
          that.$refs.video.srcObject = stream
          that.$refs.video.play()
          // that.video = document.createElement("video");
          // that.video.srcObject = that.cameraStream;
          // that.video.setAttribute("webkit-playsinline", true);
          // that.video.setAttribute("playsinline", true);
          // that.video.setAttribute("x5-playsinline", true);
          // that.video.oncanplay = function () {
          //   console.log(that.video.videoWidth, that.video.videoHeight);
          //   that.video.play();
          //   const n = that.video.videoWidth / that.video.videoHeight>that.pix;
          //   if(n) {
          //     y = 0
          //     height = that.height
          //     const j = that.video.videoHeight/that.height
          //     width = that.video.videoWidth/j
          //     x = (that.width-width)/2
          //   } else {
          //     x = 0
          //     width = that.width
          //     const j = that.video.videoWidth/that.width
          //     height = that.video.videoHeight/j
          //     y = (that.height-height)/2
          //   }
          // console.log(n, width, height, '2222')
          // };

          // that.timer = setInterval(() => {
          //   // that.ctx.translate(canvas.width, 0);
          //   // that.ctx.scale(-1, 1);
          //   that.ctx.drawImage(that.video, x, y, width, height);
          //   // that.ctx.translate(width, 0);
          //   // that.ctx.scale(-1,1)
          // }, 10);
        });
    },
    openWeChatCamera() {
      fetch(`${process.env['VUE_APP_BASE_API']}/pays/paycert/unAccess/getWXJsSDK?url=${location.href}`, {
        method: 'get',
        headers: {
          userId: this.userId,
          token: this.token,
          version: '1.4.0',
          firmId: 'zdyjb'
        },
      }).then(res => res.json()).then(res => {
        console.log(res.data)
         const params = {
          "appId": res.data.appId,
          "timeStamp": res.data.timestamp,
          "nonceStr": res.data.nonceStr,
          "signature": res.data.signature,
        }

        console.log(wx)

        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: params.appId, // 必填，公众号的唯一标识
          timestamp: params.timeStamp, // 必填，生成签名的时间戳
          nonceStr: params.nonceStr, // 必填，生成签名的随机串
          signature: params.signature,// 必填，签名
          jsApiList: ['chooseImage','getLocalImgData'] // 必填，需要使用的JS接口列表
        });

        wx.ready(function () {
          // wx.checkJsApi({
          //   jsApiList: ['chooseImage'],
          //   success(response) {
          //     console.log(response);
          //   },
          //   fail(res) {
          //     console.log(res);
          //   }
          // })
          wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          wx.getLocalImgData({
            localId: res.localIds[0], // 图片的localID
            success: function (res) {
              console.log(res)
              var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            }
          });

          }
        });
        })
      })
    },
    cameraPhoto() {
      const video = this.$refs.video
      // this.$refs.canvas.toBlob((blob) => {
      //   this.blob = blob;
      //   this.imgUrl = URL.createObjectURL(blob);
      // });
      let width = 0
      let height =0
      let x = 0
      let y = 0
      const n = video.videoWidth / video.videoHeight>this.pix;
          if(n) {
            y = 0
            height = this.height
            const j = video.videoHeight/this.height
            width = video.videoWidth/j
            x = (this.width-width)/2
          } else {
            x = 0
            width = this.width
            const j = video.videoWidth/this.width
            height = video.videoHeight/j
            y = (height-height)/2
          }
          console.log( width, height)
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext("2d")
      ctx.drawImage(video, x, y, width, height);

      var imgData = ctx.getImageData(0, 0,  canvas.width, canvas.height);
      var newImgData = ctx.getImageData(0, 0,  canvas.width, canvas.height);
      ctx.putImageData(this.imageDataHRevert(newImgData, imgData), 0, 0);
       canvas.toBlob((blob) => {
        this.blob = blob;
        this.imgUrl = URL.createObjectURL(blob);
      });
    },
    imageDataHRevert(sourceData, newData) {
      for (let i = 0, h = sourceData.height; i < h; i++) {
        for (let j = 0, w = sourceData.width; j < w; j++) {
          newData.data[i * w * 4 + j * 4 + 0] =
            sourceData.data[i * w * 4 + (w - j) * 4 + 0];
          newData.data[i * w * 4 + j * 4 + 1] =
            sourceData.data[i * w * 4 + (w - j) * 4 + 1];
          newData.data[i * w * 4 + j * 4 + 2] =
            sourceData.data[i * w * 4 + (w - j) * 4 + 2];
          newData.data[i * w * 4 + j * 4 + 3] =
            sourceData.data[i * w * 4 + (w - j) * 4 + 3];
        }
      }
      return newData;
    },
    cameraStop() {
      const that = this;
      if (that.cameraStream) {
        that.cameraStream.getTracks()[0].stop();
        window.mediaStreamTrack && window.mediaStreamTrack.stop();
        that.cameraStream = null;
      }
      if (that.video) {
        that.video.pause();
        that.video = null;
      }
      if (that.timer) {
        clearInterval(that.timer);
        that.timer = null;
      }
      this.blob = null;
      this.imgUrl = "";
    },
    close() {
      this.cameraStop();
      this.$router.back();
    },
    changeCamera() {
      this.front = !this.front;
      this.getCamera();
    },
    save() {
      sessionStorage.setItem('photo', URL.createObjectURL(this.blob));
      this.$router.push({
        name: 'imageView',
      });
      this.cameraStop();

      // const reader = new FileReader()
      // reader.readAsDataURL( this.blob);
      // reader.onload = e => {
      //   sessionStorage.setItem('photo', e.target.result);
      //   this.$router.push({
      //     name: 'imageView',
      //   });
      // this.cameraStop();
      // }

    },
  },
  mounted() {
    this.width = document.body.clientWidth;
    this.height = Math.floor(this.width / this.pix);
    console.log(this.height)
    if(micell.ua.isWeChat()&&this.isApple) {
      this.openWeChatCamera()
    } else {
      this.getCamera();
    }
  },
};
</script>

<style scoped lang="less">
.photoBox {
  * {
    user-select: none;
  }
  background: #1c1c1c;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  .canvasBox {
    margin-top: 24vw;
    position: relative;
    img {
      position: absolute;
      top: 10vw;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      z-index:1;
    }
    .showImg{
      top: 0;
    }
    video{
      transform: rotateY(-180deg);
      object-fit: cover;
    }
  }
  .controlBox {
    position: absolute;
    bottom: 0;
    width: 100vw;
    height: 41vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px;
    z-index: 1;
    > div {
      &:nth-child(1) {
        color: #e5e5e5;
        font-size: 16px;
      }
      &:nth-child(2) {
        width: 59px;
        height: 59px;
        border: 4px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        > div {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #ffffff;
        }
      }
      &:nth-child(3) {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        img {
          width: 100%;
          height: 100%;
        }
        span {
          color: #ffba53;
          font-size: 16px;
        }
      }
    }
  }

}
</style>
