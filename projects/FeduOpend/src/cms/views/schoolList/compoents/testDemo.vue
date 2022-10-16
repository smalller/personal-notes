<template>
  <div>
    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
    />
    <vab-upload
      ref="vabUpload"
      :limit="50"
      name="file"
      :size="2"
      @sendPhoto="getList"
    />
    <el-dialog
      id="video_upload"
      width="50%"
      style="margin-top: 1px"
      title="视频上传"
      :visible.sync="videoUploadTag"
      append-to-body
    >
      <el-tabs value="first">
        <el-tab-pane label="本地上传" name="first">
          <div style="margin-left: -80px">
            <choose-video :is-ariticle="1" @sendVideo="getVideo"></choose-video>
          </div>
          <el-button
            type="primary"
            size="small"
            style="margin: 20px 30px 0px 50px; float: right"
            @click="addVideoLink()"
          >
            确定
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="添加视频链接" name="second">
          <el-input
            v-model="videoLinkInfo"
            placeholder="请输入视频链接"
            clearable
          ></el-input>
          <el-button
            type="primary"
            size="small"
            style="margin: 20px 30px 0px 50px; float: right"
            @click="addVideoLink()"
          >
            添加
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import '../compoents/editor.css'
  import vabUpload from '@/extra/VabUpload'
  import { quillEditor } from 'vue-quill-editor'
  import { GetFile } from '@/api/common'
  import Quill from 'quill'
  import ImageResize from 'quill-image-resize-module' // 引用
  import { ImageDrop } from 'quill-image-drop-module'
  import ChooseVideo from './ChooseVideo'

  import Video from './video'
  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize) // 注册
  Quill.register(Video, true) // 注册

  export default {
    components: { quillEditor, vabUpload, ChooseVideo },
    data() {
      return {
        content: '',
        videoUploadTag: false,
        //富文本编辑器配置
        editorOption: {
          theme: 'snow',
          debug: 'warn',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                [{ list: 'ordered' }, { list: 'bullet' }], //列表
                [{ header: [3, false] }], //几级标题
                [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                [{ align: [] }], //对齐方式
                ['link', 'image', 'video'], //上传图片、上传视频
              ],
              handlers: {
                image: () => {
                  this.$refs['vabUpload'].handleShow()
                },
                video: (value) => {
                  if (value) {
                    this.videoUploadTag = true
                  }
                },
              },
            },
            imageDrop: true,
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white',
              },
              modules: ['Resize', 'DisplaySize', 'Toolbar'],
            },
          },
          placeholder: '请输入文章内容...',
        },
        videoLinkInfo: '',
        ariticleVideo: '',
      }
    },
    mounted() {},
    created() {},
    methods: {
      addVideoLink() {
        console.log(this.ariticleVideo, '视频链接')
        if (this.videoLinkInfo == '' && this.ariticleVideo == '') {
          this.$message({
            message: '请检查视频链接',
            type: 'warning',
          })
        }
        this.videoUploadTag = false
        if (this.ariticleVideo) {
          this.$refs.myQuillEditor.quill.format('video', this.ariticleVideo)
          // this.$refs.myQuillEditor.quill.format('video', false)
          // let data = ' <iframe   src=' + this.ariticleVideo + '></iframe>'
          // this.ruleForm.content = data + this.ruleForm.content
          // // let url = this.ariticleVideo
          // // this.$refs.vabQuill.Quill.insertEmbed(0, 'video', url)
          // // this.$refs.vabQuill.Quill.insertEmbed(0, 'video', url)
        } else {
          this.$refs.myQuillEditor.quill.insertEmbed(
            0,
            'video',
            this.videoLinkInfo
          )
        }
        this.videoLinkInfo = ''
        this.ariticleVideo = ''
      },
      async getVideo(data) {
        console.log(data, '外部链接')
        this.ariticleVideo = ''
        if (data) {
          if (data.isAriticle) {
            await GetFile(data.video).then((res) => {
              if (res.code == 0) {
                this.ariticleVideo = res.data
              }
            })
          }
        }
      },
      async getList(data) {
        if (data) {
          await this.getPicture(data, 'content')
        }
      },
      //获取图片数据
      getPicture(data, type) {
        console.log('1111111111111111111111', data)
        console.log('22222222', this.$refs)

        if (data) {
          let quills = this.$refs.myQuillEditor.quill
          console.log(quills, '2456341354123')
          let length = quills.selection.savedRange.index
          let index = length ? length : 0
          GetFile(data).then((res) => {
            if (res.code == 0) {
              if (type === 'content') {
                if (res.data) {
                  quills.insertEmbed(index, 'image', res.data)
                }
                return res.data
              }
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-list {
    height: 600px;
    overflow: scroll;
  }
</style>
