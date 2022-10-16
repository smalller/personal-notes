<template>
  <div class="cameraInfo">
    <my-head title="证件照录入" @leftClick="clickBack"/>
    <div class="cameraInfoContent">
      <div class="infoContent">
        <div class="infoItem">
          <div class="title">学籍照（规范）</div>
          <div class="sizeInfo">
            <div>
              <div>
                <span>像素尺寸</span>
                <p>358x441px</p>
              </div>
              <div>
                <span>分辨率</span>
                <p>300DPI</p>
              </div>
              <div>
                <span>文件大小</span>
                <p>50k-200k</p>
              </div>
            </div>
            <div>
              <div class="colorName">背景颜色</div>
              <div class="colorList">
                <div v-for="item in colorList" :key="item.color">
                  <div :style="{ background: item.color }"></div>
                  <span>{{ item.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="infoItem">
          <div class="title">拍照指南</div>
          <div class="cameraHelp">
            <van-swipe ref="mySwiper" :show-indicators="false" :autoplay="2000"
                    @change="slideChange"
            >
              <van-swipe-item>
                <img src="../assets/bj1.png" alt="">

              </van-swipe-item>
              <van-swipe-item>
                <img src="../assets/bj2.png" alt="">
              </van-swipe-item>
              <van-swipe-item>
                <img src="../assets/bj3.png" alt="">
              </van-swipe-item>
            </van-swipe>
            <div class="help">
              <span>{{list[index]}}</span>
              <div>
                <div v-for="(item, i) in list" :key="item" :class="{active: i=== index}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btnBox">
        <div class="btn" @click="getFile">相册上传</div>
        <div class="btn" @click="toCamera">拍摄</div>
      </div>
    </div>
    <div class="appleBar"></div>
    <my-loading v-show="loading" />
  </div>
</template>
<!--:auto-update="true"-->
<!--:auto-destroy="true"-->
<!--:delete-instance-on-destroy="true"-->
<!--:cleanup-styles-on-destroy="true"-->
<script>
import MyHead from "@/views/userCamera/component/head";
import MyLoading from "@/views/userCamera/component/loading";


export default {
  name: "cameraInfo",
  components: {MyLoading, MyHead },
  data() {
    return {
      loading: false,
      isApple: micell.ua.isIPhone() || micell.ua.isIPad() || micell.ua.isIOS() || micell.ua.isMacOS(),
      colorList: [
        {
          title: "白色",
          color: "#ffffff",
        },
        {
          title: "红色",
          color: "#861A1D",
        },
        {
          title: "浅蓝色",
          color: "#93CDFC",
        },
        {
          title: "深蓝色",
          color: "#3856B4",
        },
      ],
      list: ['光线充足，曝光正常','姿势端正，五官无遮挡','画面清晰，免冠免饰'],
      swiperOptions: {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
      },
      index: 0
    };
  },
  computed: {
  },
  methods: {
    clickBack() {
      this.$router.back()
    },
    slideChange(e) {
      this.index = e
    },
    getFile() {
      const that = this
      const input = document.createElement("input");
      input.accept = ".png,.jpg";
      input.type = "file";
      input.name = "file";
       document.body.appendChild(input);
       input.style.opacity = 0;
        input.style.position = 'fixed';
        input.style.top = 0;
        input.style.left = 0;
      input.onchange = () => {
        // console.log(input.files[0]);
         if (input.files?.length > 0) {
            that.loading = true
            const reader = new FileReader()
            reader.readAsDataURL( input.files[0]);
            reader.onload =async e => {
              let blobs = input.files[0];
              let base64 = e.target.result;
              while (blobs.size / 1024 > 200) {
                base64 = await this.compress(blobs)
                 blobs =  this.dataURLtoBlob(base64)
              }
              sessionStorage.setItem('photo',URL.createObjectURL(this.dataURLtoBlob(base64)))
              document.body.removeChild(input)
              that.loading = false
              that.$router.push({
                name: 'imageView',
              });
            }
          }
      };
      input.click();
    },
    toCamera() {
      const that = this;
      if(!this.isApple) {
        this.$router.push({
          name: "photo",
        });
      } else {

        const input = document.createElement('input');
        document.body.appendChild(input);
         input.style.opacity = 0;
        input.style.position = 'fixed';
        input.style.top = 0;
        input.style.left = 0;
        input.type = 'file';
        input.accept = ".png,.jpg";
        input.name = "file";
        input.setAttribute('capture','camera')
        input.onchange = () => {
          if (input.files?.length > 0) {
            that.loading = true
            const reader = new FileReader()
            reader.readAsDataURL( input.files[0]);
            reader.onload =async e => {
              let blobs = input.files[0];
              let base64 = e.target.result;
              while (blobs.size / 1024 > 200) {
                base64 = await this.compress(blobs)
                 blobs =  this.dataURLtoBlob(base64)
              }
              sessionStorage.setItem('photo',URL.createObjectURL(this.dataURLtoBlob(base64)))
              document.body.removeChild(input)
              that.loading = false
              that.$router.push({
                name: 'imageView',
              });
            }
          } else {
            that.loading = false
          }
        };
        input.onerror = () => {
          that.loading = false
        }
        input.click();
      }
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
    compress(blob) {
      return new Promise((resolve) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.style.cssText = `
          position:absolute;
          top:-9999999px;
          left:-99999999;
          `;
          document.body.appendChild(img);
          img.onload = () => {
              canvas.width = img.width * 0.8;
              canvas.height = img.height * 0.8;
              document.body.removeChild(img);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL());
          };
          img.src = URL.createObjectURL(blob);
      });
       }
      },
};
</script>

<style scoped lang="less">
.cameraInfo {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  * {
    user-select: none;
  }
  .cameraInfoContent{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .infoItem {
    padding: 0 16px;
    margin-top: 22px;
    &:first-child {
      margin-top: 0;
    }
    .title {
      padding: 18px 0 16px;
      display: flex;
      align-items: center;
      color: #1c1c1c;
      font-size: 18px;
      font-weight: 500;
    }
    .sizeInfo {
      height: 143px;
      width: 100%;
      background: #f6f7fc;
      border-radius: 6px;
      padding: 22px 15px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        &:first-child {
          display: flex;
          justify-content: space-between;
          > div {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            span {
              color: #8a8a8a;
              font-size: 12px;
            }
            p {
              margin-top: 6px;
              color: #1c1c1c;
              font-size: 18px;
            }
          }
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .colorName {
            color: #8a8a8a;
            font-size: 12px;
          }
          .colorList {
            margin-left: 20px;
            flex: 1;
            display: flex;
            justify-content: space-between;
            div {
              display: flex;
              align-items: center;

              > div {
                margin-right: 4px;
                border-radius: 50%;
                width: 16px;
                height: 16px;
              }
              span {
                color: #1c1c1c;
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .cameraHelp{
      position: relative;
      img{
        width: 100%;
      }
      .help{
        width: 100%;
        position: absolute;
        bottom: 4px;
        left: 0;
        height: 37px;
        background: rgba(144, 239, 144, 0.39);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        box-sizing: border-box;
        span{
          color: #FFFFFF;
          font-size: 16px;
        }
        >div {
          width: 44px;
          display: flex;
          justify-content: space-between;
          >div {
            width: 9px;
            height: 9px;
            background: #ffffff;
            border-radius: 4px;
            transition: 0.5s;
            &.active{
              background: #FFBA53;
              width: 16px;
            }
          }
        }
      }
    }
  }
  .btnBox {
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    width: 100vw;
    z-index:20;
    margin-bottom:14px ;
    .btn {
      width: 165px;
      height: 50px;
      border-radius: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f6f7fc;
      color: #8a8a8a;
      font-size: 16px;
      &:last-child {
        background: #ffaa53;
        color: #ffffff;
      }
    }
  }
}
</style>
