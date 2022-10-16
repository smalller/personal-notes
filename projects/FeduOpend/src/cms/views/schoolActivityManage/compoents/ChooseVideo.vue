<template>
  <div class="add_video">
    <div class="form_item">
      <div style="display: inline-flex">
        <el-upload
          v-show="origin == 1"
          class="upload-localtion"
          :action="uploadUrl"
          :http-request="myFileUpload"
          :before-upload="beforeUploadVideo"
          :on-progress="uploadVideoProcess"
          :file-list="picList || []"
          :show-file-list="false"
        >
          <el-button
            size="small"
            type="primary"
            style="width: 100%"
            icon="el-icon-upload2"
            :loading="isLoding"
          >
            添加视频
          </el-button>
          <el-progress
            v-if="videoFlag == true"
            :percentage="videoUploadPercent"
            style="margin-top: 50px"
          ></el-progress>
        </el-upload>
      </div>
    </div>
    <video
      v-if="showVideoPath !== ''"
      ref="video"
      class="avatar"
      :autoplay="autoplay"
      :src="showVideoPath"
      :controls="controls"
    >
      您的浏览器不支持视频播放
    </video>
  </div>
</template>

<script>
  import { limitedVideo } from '@/cms/utils'
  import { SendAllVideo } from '@/api/article'
  import { GetFile } from '@/api/common'

  export default {
    props: {
      videoLink: {
        type: String,
        default: () => {
          return ''
        },
      },
    },
    data() {
      return {
        origin: '1', //1本地 2外部链接
        VEDIO_ORIGIN: [
          {
            label: '本地上传',
            value: '1',
          },
        ],
        picList: [],
        videoFlag: false, //视频
        videoUploadPercent: 0, //进度条
        showVideoPath: '',
        outUrl: '',
        uploadUrl: '',
        controls: true,
        autoplay: false,
        chunkSize: 5 * 1024 * 1024,
        fileIndex: 0,
        tempFilesArr: [],
        fileDataList: [],
        uploadId: '',
        fileName: '',
        fileTempName: '',
        partId: '',
        videoData: {},
        videoUrl: '',
        isLoding: false,
      }
    },
    watch: {
      videoLink: {
        handler(newValue, oldValue) {
          this.getVideo(newValue)
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {},
    methods: {
      handleChange() {},
      setOutLink() {
        if (this.outUrl !== '') {
          // this.showVideoPath = this.outUrl
          this.$emit('sendVideo', { video: this.outUrl, orgin: this.origin })
          this.$message.success('视频添加成功！')
        }
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
      //视频上传
      async myFileUpload() {
        let isComplete = false
        let index = 0
        this.partId = ''
        this.fileTempName = ''
        this.videoUrl = ''
        if (+this.fileDataList.length > 1) {
          for (let item of this.fileDataList) {
            index++
            if (index === this.fileDataList.length) {
              isComplete = true
            }
            const res = await SendAllVideo(
              this.fileTempName == '' ? this.fileName : this.fileTempName,
              isComplete,
              item.file,
              this.partId
            )
            if (+res.code === 0) {
              this.partId = res.data.uploadId
              this.fileTempName = res.data.fileName
              if (res.data && +index === this.fileDataList.length) {
                this.videoUrl = res.data
                this.handleVideoSuccess()
              }
            } else {
              this.isLoding = false
              this.$message.warning('上传失败，请重新上传！')
            }
          }
        } else {
          SendAllVideo(this.fileName, true, this.videoData).then((res) => {
            if (+res.code === 0) {
              this.videoUrl = res.data
              this.handleVideoSuccess()
            }
          })
        }
      },
      //获取视频信息
      async beforeUploadVideo(file) {
        if (file) {
          this.videoData = file
          this.fileName = file.name
          this.fileDataList = await this.createFileChunk(file)
        }
        return await limitedVideo(file)
      },
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = Number(file.percentage.toFixed(0))
      },
      //视频信息上传成功
      handleVideoSuccess() {
        this.videoFlag = false
        this.videoUploadPercent = 0
        if (this.videoUrl) {
          //获取上传视频地址
          this.getVideo(this.videoUrl)
          this.$emit('sendVideo', { video: this.videoUrl, orgin: this.origin })
          this.$message.success('视频添加成功！')
        } else {
          this.isLoding = false
          this.$message.error('视频上传失败，请重新上传！')
        }
      },
      //获取视频URL地址
      getVideo(data) {
        this.showVideoPath = ''
        if (data) {
          GetFile(data).then((res) => {
            if (+res.code === 0) {
              this.showVideoPath = res.data
              this.isLoding = false
            } else {
              this.$message.error('视频加载失败！')
              this.isLoding = false
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .upload-localtion {
    .el-upload {
      width: 100%;
      margin-top: 10px;
    }
  }
  .form_item {
    margin-top: -10px;
    span {
      width: 70px;
      margin-left: -15px;
      text-align: right;
    }
  }
  .form_footer {
    width: 150px;
    margin: 10px auto;
  }
  .avatar {
    width: calc(100% - 80px);
    // margin-left: 80px;
    margin-top: 10px;
  }
</style>
