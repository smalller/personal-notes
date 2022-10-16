<template>
  <div v-show="show" class="uploadMock">
    <el-card class="upload">
      <div class="uploadBox">
        <div class="fileName">{{ fileTitle }}</div>
        <div class="fileInfo">
          <div :style="{ width: schedule }"></div>
        </div>
        <div class="uploadInfo">
          <span>{{ uploadText }}</span>
          <span>{{ schedule }}</span>
        </div>
        <div class="close">
          <i class="el-icon-close" @click="close"></i>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import request from '@/utils/request'
  import Vue from 'vue'
  import { SendAllVideo } from '@/api/article'

  export default {
    name: 'CmsUpload',
    data() {
      return {
        uploader: null,
        show: false,
        fileTitle: '13',
        imageFileAction:
          process.env.VUE_APP_BASE_API + '/mamserver/api/file/upload',
        fileAction: `${process.env.VUE_APP_BASE_API}/mamserver/file/upload`,
        wareFileAction: `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadware`,
        videoUploadUrl: `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadPart`,
        schedule: '0%', // 上传进度
        uploadText: '正在上传',
        userId: '1295766962568535',
        region: 'cn-shanghai',
        statusText: '',
        retryDuration: '',
        retryCount: '',
        parallel: '',
        partSize: '',
        timeout: '',
        source: null,
        uploadType: null,
        chunkSize: 5 * 1024 * 1024,
      }
    },
    methods: {
      upload(
        accept = '',
        type,
        opt = {
          section: false,
        }
      ) {
        const that = this
        this.uploadText = '上传中'
        return new Promise((resolve) => {
          const input = document.createElement('input')
          let file = null
          that.uploadType = type
          input.type = 'file'
          input.accept = accept
          input.onchange = async (e) => {
            that.show = opt.show || true
            file = e.target.files[0]
            that.fileTitle = file.name
            if (type === 'ali') {
              const result = await that.fileChange(file)
              this.uploadText = '上传完成'
              that.schedule = '100%'
              setTimeout(() => {
                result.file = file
                that.show = false
                that.schedule = '0%'
                resolve(result)
              }, 500)
            } else {
              let result = null
              if (opt.section) {
                result = await that.splitUpload(file)
              } else {
                result = await that.uploadFile(file)
              }
              this.uploadText = '上传完成'
              that.schedule = '100%'
              setTimeout(() => {
                result.file = file
                that.show = false
                that.schedule = '0%'
                resolve(result)
              }, 500)
            }
          }
          input.click()
        })
      },
      // 获取阿里云oss
      fileChange(file) {
        return new Promise((resolve, reject) => {
          let self = this
          this.file = file
          const url = URL.createObjectURL(file)
          const audioEl = new Audio(url)
          let duration = 0
          audioEl.addEventListener('loadedmetadata', () => {
            duration = Math.floor(audioEl.duration)
          })
          if (!this.file) {
            self.$message.error('请先选择需要上传的文件!')
            return
          }
          self.fileTitle = this.file.name
          const userData = '{"Vod":{}}'
          if (!!this.uploader) {
            this.uploader.stopUpload()
            this.authProgress = 0
          }
          this.uploader = this.createUploader((call) => {
            resolve({
              data: {
                videoId: call,
                wareRemark: duration,
              },
              url: URL.createObjectURL(file),
            })
          })
          this.uploader.addFile(this.file, null, null, null, userData)
          if (this.uploader !== null) {
            this.uploader.startUpload()
          }
        })
      },
      createUploader(call) {
        let self = this
        let videoId = ''
        let uploader = new AliyunUpload.Vod({
          timeout: self.timeout || 60000,
          partSize: self.partSize || 1048576,
          parallel: self.parallel || 5,
          retryCount: self.retryCount || 3,
          retryDuration: self.retryDuration || 2,
          region: self.region,
          userId: self.userId,
          // 添加文件成功
          // addFileSuccess: function (uploadInfo) {
          //   self.uploadDisabled = false
          //   self.resumeDisabled = false
          //   self.statusText = '添加文件成功, 等待上传...'
          //   console.log('addFileSuccess: ' + uploadInfo.file.name)
          // },
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            self.showUploadVideo = true
            if (!uploadInfo.videoId) {
              request({
                method: 'POST',
                url: '/home/courseware/getUploadAuth',
              }).then(({ data }) => {
                console.log(data)
                let uploadAuth = data.UploadAuth
                let uploadAddress = data.UploadAddress
                videoId = data.VideoId
                self.VideoId = data.VideoId
                console.log(uploader)
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                )
              })
              console.log(
                'onUploadStarted:' +
                  uploadInfo.file.name +
                  ', endpoint:' +
                  uploadInfo.endpoint +
                  ', bucket:' +
                  uploadInfo.bucket +
                  ', object:' +
                  uploadInfo.object
              )
            } else {
              // 如果videoId有值，根据videoId刷新上传凭证
              // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
              request({
                method: 'POST',
                url: '/home/courseware/getUploadAuth',
              }).then(({ data }) => {
                let uploadAuth = data.UploadAuth
                let uploadAddress = data.UploadAddress
                videoId = data.VideoId
                self.VideoId = data.VideoId
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                )
              })
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            console.log(
              'onUploadSucceed: ' +
                uploadInfo.file.name +
                ', endpoint:' +
                uploadInfo.endpoint +
                ', bucket:' +
                uploadInfo.bucket +
                ', object:' +
                uploadInfo.object
            )
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            console.log(
              'onUploadFailed: file:' +
                uploadInfo.file.name +
                ',code:' +
                code +
                ', message:' +
                message
            )
            self.statusText = '文件上传失败!'
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo, code, message) {
            console.log(
              'Canceled file: ' +
                uploadInfo.file.name +
                ', code: ' +
                code +
                ', message:' +
                message
            )
            self.statusText = '文件已暂停上传'
          },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            // console.log(
            //   'onUploadProgress:file:' +
            //     uploadInfo.file.name +
            //     ', fileSize:' +
            //     totalSize +
            //     ', percent:' +
            //     Math.ceil(progress * 100) +
            //     '%'
            // )
            self.schedule =
              (Math.ceil(progress * 100) === 100
                ? 99
                : Math.ceil(progress * 100)) + '%'
          },
          // 上传凭证超时
          onUploadTokenExpired: function () {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
            request({
              method: 'POST',
              url: '/home/courseware/getUploadAuth',
            }).then(({ data }) => {
              let uploadAuth = data.UploadAuth
              uploader.resumeUploadWithAuth(uploadAuth)
            })
            // self.$message.error('上传文件超时,请重新上传')
          },
          // 全部文件上传结束
          onUploadEnd: function () {
            self.showUploadVideo = false
            call(videoId)
            // self.$message.success('文件上传完毕')
          },
        })
        return uploader
      },
      // 上传到文件服务器
      uploadFile(file) {
        const that = this
        return new Promise((resolve, reject) => {
          let data = new FormData()
          data.append('file', file)
          data.append('type', 'course')
          if (file.type.indexOf('image/') > -1) {
            data.append('bizType', 'Header')
          }
          that.source = axios.CancelToken.source()
          axios({
            url:
              file.type.indexOf('image/') !== -1
                ? that.fileAction
                : that.wareFileAction,
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
              that.schedule = (+complete === 100 ? 99 : complete) + '%'
            },
          })
            .then((res) => {
              if (+res.data.code === 0) {
                resolve({
                  url: URL.createObjectURL(file),
                  data: res.data.data,
                  attach: res.data.attach,
                })
              } else {
                this.$message.error(res.data.msg)
                reject(res.data)
              }
            })
            .catch((err) => {
              this.$message.error(err.msg)
              reject(err)
            })
        })
      },
      // 文件切片上传
      splitUpload(file) {
        return new Promise(async (resolve, reject) => {
          if (file && this.limitedVideo(file)) {
            const fileDataList = this.createFileChunk(file)
            let size = 0
            let isComplete = false
            let index = 0
            let partId = ''
            let fileTempName = file.name
            console.log(fileTempName)
            if (+fileDataList.length > 1) {
              for (let item of fileDataList) {
                index++
                if (index === fileDataList.length) {
                  isComplete = true
                }
                const res = await this.splitUploadOpen(
                  item.file,
                  {
                    fileName: fileTempName,
                    isComplete,
                    partId,
                  },
                  (prog) => {
                    console.log(prog)
                  }
                )
                if (+res.code === 0) {
                  size += item.file.size
                  partId = res.data.uploadId
                  fileTempName = res.data.fileName

                  let complete = ((size / file.size) * 100) | 0
                  this.schedule = (+complete === 100 ? 99 : complete) + '%'
                  if (fileDataList.length === index) {
                    resolve({
                      url: URL.createObjectURL(file),
                      data: res.data,
                    })
                  }
                } else {
                  this.$message.error(err.msg)
                }
              }
            } else {
              const res = await this.splitUploadOpen(
                file,
                {
                  fileName: fileTempName,
                  isComplete: true,
                  partId,
                },
                (progressEvent) => {
                  let complete =
                    ((progressEvent.loaded / progressEvent.total) * 100) | 0
                  this.schedule = (+complete === 100 ? 99 : complete) + '%'
                }
              )
              if (+res.code === 0) {
                resolve({
                  url: URL.createObjectURL(file),
                  data: res.data,
                })
              } else {
                this.$message.error(err.msg)
              }
            }
          }
        })
      },
      splitUploadOpen(file, params, call) {
        const that = this
        return new Promise((resolve, reject) => {
          let data = new FormData()
          data.append('file', file)
          data.append('bizType', 'Video')
          for (let paramsKey in params) {
            data.append(paramsKey, params[paramsKey])
          }
          axios({
            url: that.videoUploadUrl,
            method: 'post',
            data,
            headers: {
              firmId: firmId,
              token: that.$cookie.get(`token_${firmId}`),
              userId: that.$cookie.get(`${firmId}_user_id`),
            },
            //原生获取上传进度的事件
            onUploadProgress: function (progressEvent) {
              if (call) {
                call(progressEvent)
              }
            },
          })
            .then((res) => {
              resolve(res.data)
            })
            .catch((err) => {
              console.log(err)
              reject(err)
            })
        })
      },
      //视频分割
      createFileChunk(file, size = this.chunkSize) {
        this.isLoding = true
        this.fileChunkList = []
        let count = 0
        let num = 1
        while (count < file.size) {
          this.fileChunkList.push({
            file: file.slice(count, count + size),
          })
          count += size
          num++
        }
        return this.fileChunkList
      },
      //视频上传验证
      limitedVideo(file) {
        console.log(file.type)
        let _this = Vue.prototype
        const isLt500M = file.size / 1024 / 1024 < 2048
        if (
          [
            'video/mp4',
            'audio/mpeg',
            'audio/mp3',
            // 'video/ogg',
            // 'video/flv',
            // 'video/avi',
            // 'video/wmv',
            // 'video/rmvb',
          ].indexOf(file.type) === -1
        ) {
          _this.$message.error('请上传正确的音视频格式')
          return false
        }
        if (!isLt500M) {
          _this.$message.error('上传视频大小不能超过2GB哦!')
          return false
        }
        return true
      },

      close() {
        if (!!this.uploader) {
          this.uploader.stopUpload()
          this.uploader = null
        }
        if (!!this.source) {
          this.source.cancel()
          this.source = null
        }
        this.show = false
        this.schedule = '0%'
      },
    },
  }
</script>

<style lang="scss">
  .uploadMock {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9000;
    width: 100vw;
    height: 100vh;
  }
  .upload {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 470px;
    height: 100px;
    background: #ffffff;
    transform: translate(-50%, -50%);
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      top: 4px;
      right: 4px;
      i {
        cursor: pointer;
      }
    }
    .uploadBox {
      width: 90%;
      height: 100%;
      .uploadInfo {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 12px;
        color: rgba(0, 0, 0, 1);
      }
    }
    .fileName {
      font-size: 14px;
      color: rgba(0, 0, 0, 1);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fileInfo {
      position: relative;
      width: 100%;
      height: 10px;
      margin-top: 14px;
      font-size: 18px;
      color: #1890ff;
      background: #dcdfe6;
      border-radius: 5px;
      span {
        position: absolute;
        top: -38px;
        right: 0;
      }
      > div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #1890ff;
        border-radius: 5px;
        transition: 0.5s;
      }
    }
  }
</style>
