<template>
  <div class="cameraInfo">
    <my-head title="证件照检测"  @leftClick="back"/>
    <div class="view">
      <div class="imgBox">
        <img :src="imgUrl" mode=""></img>
        <!-- 	<text>{{ photoHeight }}px</text>
        <text>{{ photoWidth }}px</text> -->
      </div>
      <div class="errInfo" v-if="!photoStatus">
        <div>
          <img src="../assets/err.png" alt="">
          {{ errMsg }}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="colorBtn">
        <button type="default" v-if="photoStatus" @click="uploadFile">使用照片</button>
        <button class="saveBtn" v-if="!photoStatus" @click="openSelectPhoto">重新拍摄</button>
      </div>
    </div>
  </div>
</template>

<script>
// import { reviewImg } from '../../api/camera.js';
// import { uploadFile } from '../../base/common.js';
import MyHead from "@/views/userCamera/component/head";
import {mapGetters} from  'vuex'
export default {
  data() {
    return {
      base64: '',
      src: '',
      imgUrl: '',
      photoStatus: true,
      spec: '67',
      photoKey: '',
      errMsg: '',
      eventChannel: null
    };
  },
  components: {
    MyHead
  },
  computed: {
    ...mapGetters(['userId', 'token',])
  },
  created() {

    // console.log(sessionStorage.getItem('photo'))
    this.getImgBase64(sessionStorage.getItem('photo'));

  },
  beforeCreated() {
    this.imgUrl = '';
  },
  methods: {
    back() {
      this.$router.back()
    },
    getImgBase64(src) {
      const that = this;

      // const img = new Image()
      // img.onload = () => {
      //   const canvas = document.createElement('canvas');
      //   const ctx = canvas.getContext("2d");
      //   canvas.width = img.width;
      //   canvas.height = img.height;
      //   ctx.drawImage(img, 0,0,img.width,img.height);
      //   console.log(canvas.toDataURL())
      //   this.imgUrl = canvas.toDataURL();
      //   this.base64 = canvas.toDataURL();
      //   this.src = src;
      //   this.getReviewImg()
      // }
      // img.src = src;

      fetch(src,{
        method: 'get',
        responseType: 'blob'
      }).then(e => e.blob()).then(blob => {
        // console.log(blob)
        const reader = new FileReader()
        reader.readAsDataURL( blob);
        reader.onload = e => {
          // sessionStorage.setItem('photo', e.target.result);
            this.imgUrl = e.target.result;
            this.base64 =e.target.result;
            this.src = src;
            this.getReviewImg()
        }
      })

    },
    getReviewImg() {
      const loading =vant.Toast.loading({
        mask: true,
        title: '检测照片中'
      });
      this.$request('/mamserver/api/idPhoto/unAccess/getPreview',{
        method: 'post',
        params: {
          bk: '#ffffff',
          spec: this.spec
        },
        headers: {
          'Content-Type': 'application/json'
        },
        data: this.base64.split(`;base64,`)[1]
      }).then(res => {
        console.log(res);
        if (+res.code === 0) {

          this.photoStatus = !!res.data.pass;
          this.errMsg = res.data.reasons;
        }
        loading.clear()
      });
    },
    //重新选择
    openSelectPhoto() {
      const that = this;
      this.$router.back()
    },
    dataURLtoBlob(base64) {
      var arr = base64.split(',');
      var _arr = arr[1].substring(0,arr[1].length-2);
      var mime = arr[0].match(/:(.*?);/)[1],
          bstr =atob(_arr),
          n = bstr.length,
          u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime
      });
    },
    //上传图片
    uploadFile() {
      const that = this;
      let data = new FormData();
      let source = null
      const blob = this.dataURLtoBlob(this.imgUrl)
      data.append("file", blob, 'header.jpg');
      data.append('bizType', 'header')
      source = axios.CancelToken.source();
      axios({
        url: `${process.env["VUE_APP_BASE_API"]}/mamserver/api/file/upload?bizType=header`,
        method: "post",
        data,
        cancelToken: source.token,
        headers: {
          token: that.token,
          userId: that.userId,
        },
      }).then((res) => {
        if (+res.data.code === 0) {
          this.$router.push({
            name: 'studentFile',
            query: {
              upload: res.data.data,
              isEdit: true
            }
          })
          // that.$emit('getImgData', res.data)
          that.$message.success("上传成功");
          resolve(res.data)
        } else {
          that.$message.warning(res.data.msg);
        }
      }).finally(() => {
      }).catch((e) => {
      })
    }
  }
};
</script>

<style lang="less">
.cameraInfo {
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f6f7f9;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .view {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .errInfo {
      margin-top: 40px;
      //position: absolute;
      //left: 50%;
      //transform: translateX(-50%);
      bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80vw;
      img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
        transform: translateY(3px);
      }
      div {
        margin-left: 4px;
        color: #1c1c1c;
        font-size: 14px;
        word-break: break-all;
      }
    }
  }
  .imgBox {
    margin-top: 58px;
    position: relative;
    width: 179px;
    img {
      width: 100%;
      height: 221px;
    }
    span {
      position: absolute;
      color: #1c1c1c;
      font-size: 18px;
      font-weight: 500;
      &:nth-child(2) {
        left: -40px;
        top: 50%;
        transform: rotate(-90deg);
      }
      &:nth-child(3) {
        left: 50%;
        transform: translateX(-50%);
        bottom: -30px;
      }
    }
  }
  .content {
    margin-top: 40px;
    width: 100%;
    // background: #ffffff;
    // box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.06);
    border-radius: 14px 14px 0px 0px;
    .colorHead {
      height: 52px;
      border-bottom: 1px solid #f5f5f5;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      span {
        font-size: 16px;
        font-weight: 500;
        color: #6a6a6a;
      }
    }
    .colorBox {
      margin-top: 40px;
      display: flex;
      justify-content: space-around;
      .colorItem {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .color {
          border-radius: 50%;
          width: 42px;
          height: 42px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          div {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 20px;
              height: 20px;
            }
          }
        }
        span {
          margin-top: 6px;
          text-align: center;
          font-weight: 400;
          color: #1c1c1c;
          font-size: 12px;
        }

        &:first-child {
          .color {
            div {
              border: 1px solid #e8e8e8;
            }
          }
        }
        &.active {
          .color {
            background: #dfdfdf;
          }
        }
      }
    }
    .colorBtn {
      padding: 50px 16px 20px;
      button {
        width: 100%;
        height: 50px;
        border-radius: 25px;
        background: #ffaa53;
        border: none;
        color: #ffffff;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        &::after {
          border: none;
        }
      }
    }
  }
  .payInfoBox {
    box-sizing: border-box;
    padding: 0 16px;
    .payInfo {
      box-sizing: border-box;
      padding: 0 16px;
      background: #ffffff;
      .payTitle {
        padding-top: 15px;
        display: flex;
        justify-content: flex-start;
        span {
          font-size: 18px;
          font-weight: 500;
          color: #1c1c1c;
        }
      }
      .payText {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;
        div {
          margin-top: 8px;

          &:first-child {
            span {
              font-size: 14px;
              font-weight: 500;
              color: #8a8a8a;
            }
          }
          &:last-child {
            span {
              font-size: 14px;
              &:first-child {
                color: #8a8a8a;
                font-weight: 400;
                text-decoration: line-through;
              }
              &:last-child {
                font-weight: bold;
                color: #1c1c1c;
              }
            }
          }
        }
      }
    }
  }
  .u-popup__content {
    background-color: #f6f7fc !important;
    > div {
      // background: #F6F7FC !important;
    }
  }
}
</style>
