<template>
  <div class="add_video">
    <h3>添加视频</h3>
    <div class="form_item">
      <span>视频来源</span>
      <el-radio-group v-model="origin">
        <el-radio
          v-for="item in VEDIO_ORIGIN"
          :key="item.value"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
    <!-- 本地 -->
    <el-upload
      v-show="origin == 1"
      class="upload-localtion"
      :action="uploadUrl"
      :on-change="handleChange"
      :before-upload="beforeUploadVideo"
      :on-progress="uploadVideoProcess"
      :on-success="handleVideoSuccess"
      :file-list="picList || []"
      :show-file-list="false"
    >
      <el-button size="small" type="primary" style="width: 100%">
        +添加视频
      </el-button>
      <el-progress
        v-if="videoFlag == true"
        :percentage="videoUploadPercent"
        style="margin-top: 30px"
      ></el-progress>
    </el-upload>
    <!-- 外部链接 -->
    <div v-show="origin == 2">
      <div class="form_item">
        <span>外部链接</span>
        <el-input v-model="outUrl" />
      </div>
      <div class="form_footer">
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
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
  import { GetVideo } from '@/api/videoNews'
  import { VEDIO_ORIGIN } from '@/cms/constants'
  import { limitedVideo } from '@/cms/utils'
  export default {
    data() {
      return {
        origin: '1', //1本地 2外部链接
        VEDIO_ORIGIN: VEDIO_ORIGIN,
        picList: [],
        videoFlag: false, //视频
        videoUploadPercent: 0, //进度条
        showVideoPath: '',
        outUrl: '',
        uploadUrl: '',
        controls: true,
        autoplay: true,
      }
    },
    methods: {
      handleChange() {},
      async beforeUploadVideo(file) {
        console.log(file, '文件信息')
        //视频数据上传地址
        this.uploadUrl = `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadPart?bizType=Video&fileName=${file.name}&isComplete=true`
        return await limitedVideo(file)
      },
      uploadVideoProcess(event, file, fileList) {
        this.videoFlag = true
        this.videoUploadPercent = Number(file.percentage.toFixed(0))
      },
      //视频信息上传成功
      async handleVideoSuccess(res, file) {
        console.log(res)
        //获取上传图片地址
        this.videoFlag = false
        this.videoUploadPercent = 0
        if (res.code == 0) {
          console.log(res)
          this.showVideoPath = await this.getVideo(res.data)
          let player = await this.$refs
          console.log(player.video, '播放器')
          // player.video.src = this.showVideoPath
          // await player.load()
          // await player.play()
          // this.videoForm.videoUploadId = res.data.uploadId
          // this.videoForm.Video = res.data.uploadUrl
        } else {
          this.$message.error('视频上传失败，请重新上传！')
        }
      },
      //获取视频URL地址
      getVideo(data) {
        if (data) {
          GetVideo(data).then((res) => {
            if (res.code == 0) {
              return res.data
            } else {
              this.$message.error('视频加载失败！')
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss">
  .upload-localtion {
    .el-upload {
      width: 100%;
    }
    width: calc(100% - 80px);
    margin-left: 80px;
  }
</style>

<style lang="scss" scoped>
  .form_item {
    display: flex;
    align-items: center;
    span {
      width: 70px;
      margin-right: 20px;
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
  }
</style>
