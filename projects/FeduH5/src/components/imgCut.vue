<template>
  <div
      id="imgClip"
      v-loading="loading"
      :style="{zIndex:cropShow?1:-1}"
      loading-text="正在上传..."
  >
    <!-- 用于唤起图片选择 -->
    <input
        v-show="false"
        ref="input"
        type="file"
        accept="image/*"
        @change="inputImgChange($event)"
    >
    <!-- 裁剪页 -->
    <transition name="slim-fade">
      <div
          v-show="cropShow"
          class="crop-wrap"
      >
        <SlimCropper
            ref="cropper"
            :aspectRatio="5/7"
            :src="inputImgUrl"
        ></SlimCropper>
        <div class="btn-box">
          <button @click="hideCrop">取消</button>
          <button @click="submitCrop">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// 将 blob 对象转化为 url
const getObjectURL = (file) => {
  let url
  if (window.createObjectURL) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

import SlimCropper from 'vue-slim-cropper'
import axios from "axios";

export default {
  name: 'imgCut',
  data() {
    return {
      imgList: [],
      cropShow: false, // 裁剪弹窗显示
      inputImgUrl: '', // input 选中的图片 url
      imgUrl: {}, // 图片信息
      imgInfo: {},
      getObjectURL,
      loading: false,
    }
  },
  components: {
    SlimCropper
  },
  props: {
    token: {
      type: String,
      default: () => {
        return ''
      }
    },
    id: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  methods: {
    // 选择图片
    async inputImg() {
      this.$refs.input.click()
    },
    // 选择图片变化时显示裁减框
    inputImgChange(e) {
      console.log(e)
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.inputImgUrl = getObjectURL(files[0])
      this.showCrop()
    },
    // 显示裁剪页
    showCrop() {
      this.cropShow = true
    },
    // 隐藏裁剪页
    hideCrop() {
      this.cropShow = false
      this.$refs.input.value = ''
    },
    // 裁剪页确认
    async submitCrop() {
      const that = this;
      this.hideCrop()
      const img = await this.$refs.cropper.getCroppedBlob('image/jpeg')
      this.imgInfo = await this.$refs.cropper.getCroppedBlob('image/jpeg')
      this.imgList.push(img)
      if (this.imgInfo) {
        try {
          console.log(1233333)
          that.loading = vant.Toast.loading({
            message: '上传中',
            duration: 0,
            overlay: true,
            forbidClick: true
          })
          while (this.imgInfo.size / 1024 > 1024) {
            this.imgInfo = await this.compress(this.imgInfo);
          }


          await that.upload()
          console.log(222222)
          if (that.loading) {
            that.loading.clear()
            that.loading = null
          }
          return Promise.resolve(true)
        } catch (e) {
          console.error(e)
          console.log(21111111)
          if (that.loading) {
            that.loading.clear()
            that.loading = null
          }
          return Promise.reject(false)
        }
      }
    },
    // 上传
    async upload() {
      const that = this
      if (this.loading) {
        this.loading.clear()
        this.loading = null
      }

      if (this.imgInfo) {
        console.log(this.imgInfo, that.id)
        return new Promise((resolve, reject) => {
          let data = new FormData();
          let source = null
          data.append("file", this.imgInfo, 'header.jpg');
          data.append('bizType', 'header')
          source = axios.CancelToken.source();
          axios({
            url: `${process.env["VUE_APP_BASE_API"]}/mamserver/api/file/upload?bizType=header`,
            method: "post",
            data,
            cancelToken: source.token,
            headers: {
              token: that.token,
              userId: that.id,
            },
          }).then((res) => {
            if (+res.data.code === 0) {

              that.$emit('getImgData', res.data)
              that.$message.success("上传成功");
              resolve(res.data)
            } else {
              that.$message.warning(res.data.msg);
              reject(res.data)
            }
          }).finally(() => {
          }).catch(() => {
            reject()
          })
        })
      }
    },
    //图片压缩
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
          canvas.width = img.width * 0.9;
          canvas.height = img.height * 0.9;
          document.body.removeChild(img);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blobs) => {
            resolve(blobs);
          }, "image/jpeg");
        };
        img.src = URL.createObjectURL(blob);
      });
    }
  },
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  box-sizing: border-box;
  background: transparent;
}

html,
body {
  width: 100%;
  height: 100%;
}

#imgClip {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  > h1 {
    font-size: 24px;
    padding: 0 15px;
    padding-top: 40px;
    padding-bottom: 20px;
    color: #409eff;
  }

  .img-box {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 0 20px;
    margin-top: 40px;

    .img-item,
    .add-btn {
      width: 150px;
      height: 150px;
      background: #f5f5f5;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      > img {
        width: 100%;
      }
    }

    .add-btn {
      > img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .submit-btn {
    margin: 60px auto;
    display: block;
    width: 70%;
    height: 60px;
    background: #409eff;
    border-radius: 60px;
    font-size: 20px;
    color: #fff;
    font-weight: 500;

    &:disabled {
      background: #ededed;
      color: #cccccc;
    }
  }

  .crop-wrap {
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #000;
    padding: 20px;
    box-sizing: border-box;

    .btn-box {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 999;
      width: 100%;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;

      > button {
        width: 60px;
        height: 100%;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
      }
    }
  }

  .slim-fade-enter-active,
  .slim-fade-leave-active {
    transition: all 0.4s ease;
  }

  .slim-fade-enter,
  .slim-fade-leave-to {
    opacity: 0;
    transform-origin: top;
    transform: translateY(100%);
  }
}
</style>
