<template>
  <div class="imageView">
    <my-head title="证件照预览" />
    <loading v-show="loading" />
    <div class="viewBox" :class="{filter: payShow}">
      <div class="view">
        <div>
          <img :src="imgUrl" alt="">
          <span>{{photoHeight}}px</span>
          <span>{{photoWidth}}px</span>
        </div>
        <div class="errInfo" v-show="!photoStatus">
          <img src="../assets/err.png" alt="">
          <span>{{errMsg}}</span>
        </div>
      </div>
      <div class="controlBox">
        <div class="controlTitle">
          <img src="../assets/colorSelect.png" alt="">
          <span>选择背景色</span>
        </div>
        <div class="selectBox">
          <div class="colorSelect">
            <div class="colorItem" @click="colorSelect(item.color)" :class="{active: item.color === color}" v-for="item in colorList" :key="item.color">
              <div :style="{background: item.color, boxShadow: item.color === '#ffffff'?'0 0 1px 1px #e8e8e8 inset':''}">
                <img v-show="item.color === color" src="../assets/select.png" alt="">
              </div>
              <span>
                {{item.title}}
              </span>
            </div>
          </div>
          <div class="saveBtn" v-show="photoStatus" @click="openPay">保存并使用照片</div>
          <div class="saveBtn" v-show="!photoStatus" @click="back">重新拍摄</div>
        </div>
      </div>
    </div>
    <div class="appleBar" v-show="isApple"></div>
    <van-action-sheet class="payBox"  duration="0.1" v-model="payShow" title="提交订单">
      <div class="payInfo">
        <div class="payTitle">一寸照</div>
<!--        <div class="payText">-->
<!--          <p>电子版一寸照</p>-->
<!--           <p>-->
<!--             <span>¥19.9</span>-->
<!--           </p>-->
<!--        </div>-->
        <div class="payText">
          <p>电子版高清一寸照</p>
          <p>
            ¥{{orderInfo.originalAmout}}
            <span>¥{{orderInfo.amount}}</span>
          </p>
        </div>
      </div>
      <div class="payInfo paySelect">
        <div class="payTitle">支付方式</div>
        <van-radio-group v-model="payType">
          <van-cell-group>
            <van-cell :title="item.title" v-for="item in payTypeList" :key="item.type" clickable @click="payTypeChange(item.type)">
             <template #title>
               <div class="payItem">
                 <img :src="item.icon" alt="">
                 <span>{{item.title}}</span>
               </div>
             </template>
              <template #right-icon>
                <van-radio :name="item.type" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="payNumBtn">
        <div>
          <p>应付款:</p>
          <span>¥{{orderInfo.amount}}</span>
        </div>
        <div>确认支付</div>
      </div>
      <div class="appleBar" v-show="isApple"></div>
    </van-action-sheet>
  </div>
</template>

<script>
import MyHead from "@/views/userCamera/component/head";
import Loading from "@/views/userCamera/component/loading";
import axios from "axios";
import errConfig from "@/views/userCamera/views/errConfig";

import CryptoJS from 'crypto-js'
import pay from "@/pay";
export default {
  name: "imageView",
  mixins: [pay],
  data() {
    return {
      viewUrl: 'https://idphotohq-open.segapi.com/preview',
      viewUrl2: 'https://alidphoto.aisegment.com/idphoto/make',
      colorList: [
        {
          title: "白色",
          color: "#ffffff",
        },
        {
          title: "红色",
          color: "#861a1d",
        },
        {
          title: "浅蓝色",
          color: "#93cdfc",
        },
        {
          title: "深蓝色",
          color: "#3856b4",
        },
      ],
      color: '#ffffff',
      spec: '67',
      beauty_degree: 1.5,
      dataUrl: '',
      loading: false,
      filter: false,
      imgUrl: '',
      photoWidth: 358,
      photoHeight: 441,
      photoStatus: true,
      errMsg: '',
      payShow: false,

      isApple: micell.ua.isIPhone() || micell.ua.isIPad() || micell.ua.isIOS() || micell.ua.isMacOS(),
      photo_key: ''
    }
  },
  components: {Loading, MyHead },
  methods: {
    payTypeChange(type) {
      this.payType = type
    },
    back() {
      this.$router.back()
    },
    openPay() {
      this.payShow = true
      this.filter = true
      this.createOrder()
    },
    colorSelect(color) {
      this.color = color;
      this.getViewImg()
    },
    stringToUint8Array(str){
      str = unescape(encodeURIComponent(str))
      const arr = [];
      const arrb = [];
      let i = 0, j = str.length;
      for (; i < j; ++i) {
        arr[i >>> 2] |= (str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
        arrb.push(str.charCodeAt(i));
      }
      return  {
        words: arr,
        sigBytes: new Uint8Array(arrb).byteLength
      };
    },
    encodeUtf8(text) {
      const code = encodeURIComponent(text);
      const bytes = [];
      for (let i = 0; i <code.length; i++) {
        const c = code.charAt(i);
        if (c === '%') {
          const hex = code.charAt(i + 1) + code.charAt(i + 2);
          const hexVal = parseInt(hex, 16);
          bytes.push(hexVal);
          i += 2;
        } else bytes.push(c.charCodeAt(0));
      }
      return bytes;
    },
    getView() {
      const data = {
        type: 'png',
        photo: this.dataUrl.split('data:image/png;base64,')[1],
        spec: this.spec,
        bk: this.color,
        beauty_degree: this.beauty_degree,
      }
      // console.log(this.encodeUtf8(JSON.stringify(data)))

      axios.post(this.viewUrl2, data, {
        headers: {
          Authorization: 'APPCODE 58708a00553044b6a4f91e585b00e0dc',
          'Content-Type': 'application/json',
        }
      }).then(res => {
        console.log(res.data)
        this.imgUrl = res.data.data.result
      }).catch(err => {
        console.log(err.response.request)
        if(err.response.request.response) {
          const errData = JSON.parse(err.response.request.response)
          console.error(1222,errData)
          const errInfo = errConfig.find(item => +item.code ===+errData.status)
          console.error(errInfo)
          this.errMsg = errInfo.msg
          this.photoStatus =false
        }
      })
    },
    getViewImg() {
      const fileType = this.dataUrl.indexOf('data:image/jpeg')>-1?'jpeg':'png'
      const data = {
        photo: this.dataUrl.split(`data:image/${fileType};base64,`)[1],
        spec: this.spec,
        bk_list: [this.color],
        beauty_degree: this.beauty_degree,
      }
      // if(this.photo_key){
      //   delete data.photo
      //   data.photo_key = this.photo_key
      // }
      axios.post(this.viewUrl, data, {
        headers: {
          Authorization: 'APPCODE 58708a00553044b6a4f91e585b00e0dc',
          'Content-Type': 'application/json',
          'Content-MD5': CryptoJS.enc.Base64.stringify(CryptoJS.MD5(CryptoJS.enc.Utf8.parse(JSON.stringify(data)))),
        }
      }).then(res => {
        this.photo_key = res.data.data.photo_key
        for (const previewUrlsKey in res.data.data.preview_urls) {
          this.imgUrl =res.data.data.preview_urls[previewUrlsKey]
        }

        this.photoWidth = res.data.data.size[0]
        this.photoHeight = res.data.data.size[1]
        this.photoStatus = true
      }).catch(err => {
        this.photo_key = ''
        if(err.response.request.response) {
          const errData = JSON.parse(err.response.request.response)
          console.error(1222,errData)
          const errInfo = errConfig.find(item => +item.code ===+errData.status)
          console.error(errInfo)
          this.errMsg = errInfo.msg
          this.photoStatus =false
        }
      })
    }
  },
  mounted() {
    this.photo_key = ''
    if(sessionStorage.getItem('photo')) {
      this.dataUrl = sessionStorage.getItem('photo')
      this.imgUrl = this.dataUrl
      this.getViewImg()
    }
  },
};
</script>

<style  lang="less">
.imageView{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  *{
    user-select: none;
  }
  .viewBox{
    &.filter{
      -webkit-filter: blur(14px);
      filter: blur(14px);
    }
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fffaff;
    .view{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      >div {
        position: relative;
        width: 159px;
        img{
          width: 100%;
          //height: 223px;
        }
        span{
          position: absolute;
          color: #1C1C1C;
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
        &.errInfo{
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 10px;
          width: auto;
          img{
            width: 16px;
            height: 16px;
          }
          span{
            margin-left: 4px;
            color: #1C1C1C;
            font-size: 14px;
          }
        }
      }
    }
    .controlBox {
      width: 100vw;
      height: 82vw;
      background: rgba(255, 255, 255, 0.39);
      box-shadow: 0px -1px 2px rgba(0, 0, 0, 0.06);
      border-radius: 4px 4px 0 0;
      display: flex;
      flex-direction: column;
      .controlTitle{
        height: 52px;
        border-bottom: 1px solid #F5F5F5;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 34px;
          height: 34px;
        }
        span{
          color: #6A6A6A;
          font-size: 16px;
          margin-left: 5px;
        }

      }
      .selectBox{
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .colorSelect{
          padding-top: 46px;
          width: 100%;
          display: flex;
          justify-content: space-around;
          .colorItem{
            display: flex;
            flex-direction: column;
            align-items: center;
            div{
              width: 41px;
              height: 41px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              img{
                width: 20px;
                height: 20px;
                border: 1px solid transparent;
              }
            }
            span{
              margin-top: 4px;
              color: #1C1C1C;
              font-size: 12px;
            }
            &.active{
              div{
                border: 3px solid #DFDFDF;
              }
            }
          }

        }
          .saveBtn{
            width: 343px;
            height: 50px;
            border-radius: 25px;
            background: #FFAA53;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 16px;
            margin-bottom: 16px;
          }

      }
    }
  }
  .payBox{

    display: flex;
    flex-direction: column;

    background: #F6F7FC;
    .payInfo{
      margin: 0 16px;
      padding:15px 16px;
      background: #FFFFFF;
      .payTitle{
        color: #1C1C1C;
        font-size: 18px;
        font-weight: 600;
      }
      .payText{
        margin-top: 8px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        p{
          font-size: 14px;
          color: #8A8A8A;
          span{
            color: #1C1C1C;
            font-weight: 600;
            margin-left: 4px;
          }
        }
      }
    }
    .paySelect{
      margin-top: 10px;
      .payTitle{
        margin-bottom: 8px;
      }
      .van-cell {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-bottom: 2px;
        &::after {
          display: none;
        }
      }
      .van-radio__icon--checked .van-icon{
        background-color: #FFAA53;
        border-color: #FFAA53;
      }
      .payItem{
        display: flex;
        align-items: center;
        span{
          color: #8A8A8A;
          font-size: 14px;
        }
        img{
          width: 24px;
          height: 24px;
          margin-right: 9px;
        }
      }
    }
    .payNumBtn{
      margin-top: 35px;
      height: 59px;
      width: 100vw;
      display: flex;
      justify-content:  space-between;
      align-items: center;
      background: #ffffff;
      padding: 0 16px;
      >div {
        &:first-child{
          display: flex;
          p{
            color: #8A8A8A;
            font-size: 14px;
          }
          span{
            margin-left: 6px;
            color: #FFBA53;
            font-weight: bold;
            font-size: 21px;
          }
        }
        &:last-child{
          width: 140px;
          height: 43px;
          background: #FFAA53;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 16px;
          border-radius: 25px;
        }
      }
    }

  }

}
</style>
