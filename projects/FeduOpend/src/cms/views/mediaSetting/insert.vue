<template>
  <el-dialog
    class="media-insert"
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="700px"
    @close="close"
  >
    <el-form ref="form" label-position="right" :model="form" label-width="80px">
      <el-form-item
        label="小节名称"
        prop="name"
        :rules="filterRules({ required: true, msg: '请输入小节名称' })"
      >
        <el-input
          v-model="form.name"
          maxlength="40"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="小节作者"
        prop="author"
        :rules="filterRules({ required: true, msg: '请输入小节作者' })"
      >
        <el-input
          v-model="form.author"
          maxlength="40"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="小节封面" prop="cover">
        <div class="uploadBtn" @click="openUpload">
          <img v-if="imgUrlFlag" :src="form.imgUrl" class="avatar" alt="" />
          <vab-remix-icon v-else icon="add-fill" />
        </div>
      </el-form-item>
      <el-form-item label="上传方式">
        <el-select
          v-model="fileUploadType"
          placeholder="请选择"
          @change="typeSelect"
        >
          <el-option label="本地上传" :value="1"></el-option>
          <el-option label="外部链接" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="排序"
        prop="sort"
        :rules="filterRules({ required: true, msg: '请输入序号' })"
      >
        <el-input
          v-model="form.sort"
          style="width: 400px"
          maxlength="40"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="免费试看">
        <el-checkbox v-model="form.isFree"></el-checkbox>
      </el-form-item>
      <el-form-item
        v-if="fileUploadType === 1"
        prop="mediaPath"
        :rules="
          filterRules({
            required: true,
            msg: '请上传视频或音频',
            trigger: 'input',
          })
        "
      >
        <el-button type="primary" @click="videoUpload">
          上传{{ +form.type === 1 ? '视频' : '音频' }}
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="fileUploadType === 2"
        label="外部链接"
        prop="mediaPath"
      >
        <el-input v-model="videoUrl"></el-input>
      </el-form-item>
      <el-form-item v-if="videoShow">
        <!--        <vab-player-mp4-->
        <!--          v-if="form.type === 1"-->
        <!--          :config="{-->
        <!--            id: 'mse1',-->
        <!--            url: videoUrl,-->
        <!--            volume: 1,-->
        <!--            autoplay: false,-->
        <!--            screenShot: false,-->
        <!--            pip: false,-->
        <!--          }"-->
        <!--          @player="Player1 = $event"-->
        <!--        />-->
        <!--        <div v-if="form.type === 1" preload controls :src="videoUrl"></div>-->
        <video v-if="form.type === 1" preload controls :src="videoUrl"></video>
        <audio
          v-if="form.type === 2"
          controls
          :src="videoUrl"
          @play="Player1 = $event"
        ></audio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <cms-upload ref="cmsUpload"></cms-upload>
  </el-dialog>
</template>

<script>
  import CmsUpload from '@/cms/common/cmsUpload'
  import { VabPlayerMp4 } from '@/extra/vabPlayer.js'
  import { AddMediaAlbumItem, EditMediaAlbumItem } from '@/cms/api/mediaSetting'
  import micell from 'micell'
  export default {
    name: 'MediaInsert',
    components: { CmsUpload },
    data() {
      return {
        Player1: null,
        title: '',
        dialogFormVisible: false,
        type: 1,
        form: {
          author: '',
          cover: '',
          hasDraft: false,
          isFree: false,
          length: '',
          mediaAlbumId: '',
          mediaPath: '',
          name: '',
          sort: '',
          uploadType: 1,
        },
        imgUrlFlag: false,
        fileUploadType: 1,
        videoShow: false,
        videoUrl: '',
        isImgChange: false,
        isVideoChange: false,
      }
    },
    watch: {
      videoUrl: function () {
        this.pause()
        if (this.videoUrl) {
          this.videoShow = true
        }
      },
    },
    methods: {
      typeSelect() {
        this.videoUrl = ''
        this.videoShow = false
        this.form.uploadType = this.fileUploadType
      },
      onSubmit() {
        console.log(this.fileUploadType === 2)
        if (this.fileUploadType === 2) {
          this.$set(this.form, 'mediaPath', this.videoUrl)
        }
        this.form.uploadType = this.fileUploadType
        const e = this.title === '添加' ? AddMediaAlbumItem : EditMediaAlbumItem

        this.$refs['form'].validate((volid) => {
          if (volid) {
            console.log(this.isImgChange, this.isVideoChange)
            if (!this.isImgChange) {
              delete this.form.cover
            }
            if (!this.isVideoChange && this.fileUploadType !== 2) {
              delete this.form.mediaPath
            }
            console.log(this.form)
            e(this.form).then((res) => {
              this.close()
            })
          }
        })
      },
      pause() {
        if (this.Player1) {
          if (!!this.Player1.target) {
            this.Player1.target.pause()
          } else {
            this.Player1.pause()
          }
        }
      },
      showEdit(row, type) {
        row.isFree = false
        this.form = Object.assign({}, row)
        if (type === 'add') {
          this.title = '添加'
        } else {
          console.log(row)
          this.title = '编辑'

          this.form.imgUrl = row.cover
          this.videoUrl = row.mediaPath
          this.fileUploadType = row.uploadType
          this.imgUrlFlag = true
          this.videoShow = true
        }
        this.isImgChange = false
        this.isVideoChange = false
        this.form.type = +this.form.type
        this.dialogFormVisible = true
      },
      close() {
        this.form = {
          author: '',
          cover: '',
          hasDraft: false,
          isFree: false,
          length: '',
          mediaAlbumId: '',
          mediaPath: '',
          name: '',
          sort: '',
          uploadType: 1,
          length: false,
        }
        this.pause()
        this.Player1 = null
        this.videoShow = false
        this.imgUrlFlag = false
        this.videoUrl = ''
        this.dialogFormVisible = false
        this.$emit('close')
      },
      openUpload() {
        this.$refs['cmsUpload'].upload('.jpeg,.jpg').then((res) => {
          this.imgUrlFlag = true
          this.isImgChange = true
          this.$set(this.form, 'imgUrl', res.url)
          this.$set(this.form, 'cover', res.data)
          this.$refs['form'].validate()
          this.$forceUpdate()
        })
      },
      videoUpload() {
        this.videoShow = false
        this.$refs['cmsUpload']
          .upload(+this.form.type === 1 ? '.mp4' : '.mp3', '', {
            section: true,
          })
          .then(async (res) => {
            this.isVideoChange = true
            this.form.length = await this.getVideoLength(res.url)
            this.videoShow = true
            this.videoUrl = res.url
            this.$set(this.form, 'mediaPath', res.data)
            await this.$refs['form'].validate()
            this.$forceUpdate()
          })
      },
      getVideoLength(url) {
        return new Promise((resolve) => {
          const video = document.createElement('video')
          video.addEventListener('loadeddata', () => {
            resolve(video.duration)
          })
          video.src = url
          video.load()
        })
      },
    },
  }
</script>

<style lang="scss">
  .media-insert {
    #mse1 {
      width: 320px !important;
      height: 180px !important;
      padding-top: 0 !important;
    }
    audio {
      display: inline-block !important;
    }
    video {
      width: 320px !important;
      height: 180px !important;
    }
  }
</style>
