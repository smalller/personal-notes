<template>
  <el-dialog
    :close-on-click-modal="false"
    title="图片裁剪"
    :visible.sync="dialogVisible"
    width="800px"
  >
    <el-row>
      <el-col>
        <!-- <cms-upload></cms-upload> -->
        <div style="height: 500px; width: 100%">
          <vue-cropper
            ref="vabCropper"
            :options="options"
            :img="options.image"
            :auto-crop="options.autoCrop"
            :fixed-box="options.fixedBox"
            auto-crop-width="686px"
            auto-crop-height="420px"
            output-type="jpeg"
          />
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <div>
        <el-button type="primary" @click="upload">上传并保存</el-button>
        <el-upload
          action="#"
          :auto-upload="false"
          list-type="picture-card"
          :on-change="onChange"
        >
          <template #default>
            <el-button type="primary">选择图片</el-button>
          </template>
        </el-upload>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import { VueCropper } from 'vue-cropper'
  import VueCookie from 'vue-cookie'
  import { SendPicture } from '@/api/article'

  export default {
    name: 'VabCropper',
    components: { VueCropper },
    data() {
      return {
        dialogVisible: false,
        value: '',
        fileName: '',
        options: {
          width: 100,
          height: 100,
          image: '',
          autoCrop: true,
          fixedBox: true,
          autoCropWidth: '648px',
          autoCropHeight: '420px',
        },
        timer: null,
        userType: VueCookie.get(`${firmId}_user_type`),
      }
    },
    methods: {
      onChange(file) {
        if (
          file.raw.type !== 'image/jpeg' &&
          file.raw.type !== 'image/jpg' &&
          file.raw.type !== 'image/png'
        ) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
          return
        } else {
          this.options.image = file.url
          this.fileName = file.name
        }
      },
      upload() {
        this.$refs.vabCropper.getCropBlob((data) => {
          console.log(data, '上传数据')
          if (data.size / 1024 / 1024 > 2) {
            this.$message.info('图片上传不能超过2M')
            return false
          }
          let files = new window.File([data], this.fileName, {
            type: 'image/jpeg',
          })
          SendPicture(this.userType, files).then((res) => {
            if (+res.code === 0) {
              this.$emit('sendPhoto', res.data)
              this.options.image = ''
            }
          })
          console.log(files)
        })
        this.dialogVisible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    @media only screen and (max-width: 767px) {
      .vab-cropper-canvas {
        display: block;
        float: none;
        margin: 0 auto;
      }
      .vab-cropper-preview {
        display: none;
      }
    }

    .el-textarea {
      margin-top: 20px;
    }

    .el-dialog__footer {
      height: 72px;

      &:before {
        display: block;
        clear: both;
        content: '';
      }
      > div {
        > div {
          display: inline;

          .el-upload-list {
            display: none;
          }

          .el-upload--picture-card {
            float: right;
            width: auto;
            height: 32px;
            line-height: 32px;
            vertical-align: middle;
            background-color: transparent;
            border: 0;
            border-radius: 0;
          }
        }

        .el-button {
          float: right;
          margin-left: 10px;
        }
      }
    }
  }
</style>
