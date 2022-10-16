<template>
  <div class="add_video">
    <div v-if="+isAriticle !== 1" class="form_item">
      <span>视频来源</span>
      <el-radio-group v-model="origin">
        <el-radio
          v-for="(item, index) in VEDIO_ORIGIN"
          :key="index"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
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
    <!-- 本地 -->
    <div style="display: flex">
      <el-upload
        v-if="origin == 1 || +isAriticle === 1"
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
          icon="el-icon-upload2"
          :loading="isLoding"
        >
          添加视频
        </el-button>

        <!-- <el-progress
        v-if="videoFlag == true"
        :percentage="videoUploadPercent"
        style="margin-top: 50px"
      ></el-progress> -->
      </el-upload>
      <el-button
        v-if="showVideoPath !== ''"
        size="small"
        type="danger"
        icon="el-icon-delete"
        @click="delVideo"
      >
        删除视频
      </el-button>
    </div>

    <!-- 外部链接 -->
    <!-- <div v-show="origin == 2 && outUrl" style="margin-left: 10px">
      <div class="avatar">
        <div id="myVideo"></div>
      </div>
    </div>
    <div v-if="+origin == 2 && +isAriticle !== 1" style="margin-left: 10px">
      <div class="form_item">
        <span>外部链接</span>
        <el-input v-model="outUrl" />
      </div>
      <div class="form_footer">
        <el-button type="primary" @click="setOutLink()">确定</el-button>
        <el-button @click="delOutLink()">取消</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
  import { VEDIO_ORIGIN } from '@/cms/constants'
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
      videoType: {
        type: Number,
        default: () => {
          return 0
        },
      },
      isAriticle: {
        type: Number,
        default: () => {
          return 0
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
      //获取视频链接
      videoLink: {
        handler(newValue, oldValue) {
          this.origin = this.videoType.toString()
          if (+this.videoType === 1) {
            // this.getVideo(newValue)
            this.showVideoPath = newValue ? newValue : ''
          } else {
            this.outUrl = decodeURIComponent(window.atob(newValue))
            if (this.outUrl !== '') {
              document.getElementById('myVideo').innerHTML = this.outUrl
            }
          }
        },
        immediate: true,
        deep: true,
      },
    },
    mounted() {},
    methods: {
      handleChange() {},
      delOutLink() {
        this.outUrl = ''
        document.getElementById('myVideo').innerHTML = this.outUrl
      },
      //添加第三方链接
      setOutLink() {
        if (this.outUrl !== '') {
          // this.showVideoPath = this.outUrl
          document.getElementById('myVideo').innerHTML = this.outUrl
          this.$emit('sendVideo', {
            video: window.btoa(encodeURIComponent(this.outUrl)),
            orgin: +this.origin,
          })
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
        if (await this.beforeUploadVideo) {
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
              console.log(res, '视频返回数据')
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
        }
      },
      //获取视频信息
      async beforeUploadVideo(file) {
        if (file && limitedVideo(file)) {
          this.videoData = file
          this.fileName = file.name
          this.fileDataList = await this.createFileChunk(file)
        } else {
          return false
        }
      },
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = Number(file.percentage.toFixed(0))
      },
      //视频信息上传成功
      async handleVideoSuccess() {
        this.videoFlag = false
        this.videoUploadPercent = 0
        if (this.videoUrl) {
          //获取上传视频地址
          await this.getVideo(this.videoUrl)
          this.$emit('sendVideo', {
            video: this.videoUrl,
            orgin: this.origin,
            isAriticle: +this.isAriticle,
          })
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
      delVideo() {
        this.showVideoPath = ''
        this.$emit('sendVideo', {
          video: '',
          orgin: '',
          isAriticle: +this.isAriticle,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .upload-localtion {
    .el-upload {
      width: 100%;
      text-align: left;
      margin-top: 10px;
    }
    width: calc(100% - 80px);
    margin-left: 80px;
  }
  .form_item {
    display: flex;
    align-items: center;
    span {
      width: 70px;
      margin-right: 10px;
      text-align: right;
    }
  }
  .form_footer {
    width: 150px;
    margin: 10px auto;
  }
  .avatar {
    width: calc(100% - 80px);
    margin-left: 80px;
    height: 200px;
  }
  .del {
    margin-left: 50px;
  }
</style>
