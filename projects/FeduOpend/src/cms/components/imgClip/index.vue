<template>
  <el-dialog
    :visible.sync="visible"
    title="上传封面"
    width="646px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <div class="ui-clip-box">
      <div ref="canvasBox" class="ui-clip-canvas-box"></div>
      <!--      <button @click="getImg">选择文件</button>-->
      <!--      <button @click="getClip">获取截图</button>-->
      <!--      <img :src="imgSrc" alt="" width="320" height="180" />-->
    </div>
    <template #footer class="div">
      <div class="ui-clip-footer">
        <div>
          <span>
            建议分辨率不低于 {{ width }}*{{ height }}（大小不超过 10M）
          </span>
        </div>
        <div>
          <el-button style="margin-right: 20px" @click="getImg">
            {{ isFile ? '重新上传' : '上传图片' }}
          </el-button>
          <el-button :loading="loading" type="primary" @click="save">
            保存
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  // import ClipImg from "./canvas";
  import ClipImg from '@zhuxiaozy/clipimg'
  import Axios from 'axios'
  import axios from 'axios'

  export default {
    name: 'ImgClip',
    emits: {
      getImg: null,
    },
    data() {
      return {
        visible: false,
        imgSrc: '',
        width: 1920,
        height: 1080,
        isFile: false,
        clipData: null,
        source: null,
        loading: false,
        size: 4096,
      }
    },
    methods: {
      getImg() {
        const input = document.createElement('input')
        input.type = 'file'
        input.onchange = (e) => {
          this.isFile = true
          const target = e.target
          const fileList = target.files
          if (fileList && fileList.length > 0) {
            this.clipData.setImg(fileList[0])
          }
        }
        input.click()
      },
      init(config, file) {
        this.isFile = false
        this.visible = true
        this.width = config.width || 1920
        this.height = config.height || 1080
        this.size = config.size || 4096
        setTimeout(() => {
          if (this.$refs.canvasBox) {
            this.clipData = new ClipImg({
              el: this.$refs.canvasBox,
              reviewCall: (src) => {
                this.imgSrc = src
              },
            })
            this.clipData.setSize(this.width / 4, this.height / 4)
            if (file) {
              this.isFile = true
              this.clipData.setImg(file)
            }
          }
        }, 100)
      },

      save() {
        this.loading = true
        this.clipData.getClipData(this.size).then(async (res) => {
          const result = await this.upload(res.blob)
          this.visible = false
          this.loading = false
          this.$emit('getimg', {
            url: res.url,
            blob: res.blob,
            id: result.data.data,
          })
        })
      },

      upload(blob) {
        return new Promise((resolve, reject) => {
          const that = this
          let data = new FormData()
          const file = new File([blob], 'clip.jpg', {
            type: blob.type,
          })
          data.append('file', file)
          data.append('type', 'course')
          data.append('bizType', 'Header')
          this.source = axios.CancelToken.source()
          axios({
            // url: `${process.env.VUE_APP_BASE_API}/mamserver/api/file/uploadAndUserType?bizType=article&userType=300409`,
            url: process.env.VUE_APP_BASE_API + '/mamserver/api/file/upload',
            method: 'post',
            data,
            cancelToken: that.source.token,
            headers: {
              firmId: firmId,
              token: that.$cookie.get(`token_${firmId}`),
              userId: that.$cookie.get(`${firmId}_user_id`),
            },
            //原生获取上传进度的事件
            onUploadProgress: function (progressEvent) {
              let complete =
                ((progressEvent.loaded / progressEvent.total) * 100) | 0
              console.log('上传 ' + complete)
            },
          })
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
    },
  }
</script>

<style lang="scss">
  .ui-clip-box {
    .ui-clip-canvas-box {
      position: relative;
      width: 586px;
      height: 360px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      &::after {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        pointer-events: none;
        content: '';
        background: rgba(0, 0, 0, 1);
        filter: alpha(Opacity=60);
        -moz-opacity: 0.6;
        opacity: 0.6;
      }
      > div {
        z-index: 2;
        border-color: #ff9900 !important;
        > div {
          box-sizing: border-box;
          width: 15px !important;
          height: 15px !important;
          background: rgba(255, 255, 255, 0) !important;
          border: 4px solid #ff9900;

          &:nth-child(1) {
            border-right-style: hidden;
            border-bottom-style: hidden;
          }
          &:nth-child(2) {
            border-bottom-style: hidden;
            border-left-style: hidden;
          }
          &:nth-child(3) {
            border-top-style: hidden;
            border-right-style: hidden;
          }
          &:nth-child(4) {
            border-top-style: hidden;
            border-left-style: hidden;
          }
        }
      }
    }
  }
  .ui-clip-footer {
    display: flex;
    justify-content: space-between;
    text-align: left;
    > div {
      &:first-child {
        span {
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
</style>
