<template>
  <div class="myEditor">
    <div ref="editorContent" class="editor-content"></div>
    <cms-upload ref="cmsUpload" />
  </div>
</template>

<script>
  import CmsUpload from '@/cms/common/cmsUpload'
  import E from 'wangeditor'
  import { getFileUrl } from '@/cms/api/common'
  export default {
    name: 'MyEditor',
    components: { CmsUpload },
    model: {
      prop: 'html',
      event: 'htmlChange',
    },
    props: {
      html: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        editor: null,
        vHtml: '',
      }
    },
    watch: {
      html: function (val) {
        if (this.editor) {
          if (this.vHtml !== val) {
            this.editor.txt.html(val)
            // this.editor.setHtml(val)
          }
        }
      },
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.editor.destroy()
      this.editor = null
    },
    methods: {
      init() {
        const self = this
        this.editor = new E(this.$refs.editorContent)
        this.editor.config.height = 400
        this.editor.config.zIndex = 1
        this.editor.config.uploadImgMaxLength = 1
        this.editor.config.showLinkImg = false
        this.editor.config.uploadImgShowBase64 = false
        this.editor.config.showLinkVideo = false
        this.editor.config.showFullScreen = false
        // this.editor.config.showMenuTooltips = false
        this.editor.config.menuTooltipPosition = 'up'
        this.editor.config.customUploadImg = (resultFiles, insertImgFn) => {
          console.log(resultFiles)
          self.$refs.cmsUpload.uploadFile(resultFiles[0]).then((res) => {
            console.log(res)
            getFileUrl(res.data).then((res) => {
              insertImgFn(res.data)
            })
          })
        }
        this.editor.config.customUploadVideo = (resultFiles, insertVideo) => {
          self.$refs.cmsUpload.splitUpload(resultFiles[0]).then((res) => {
            console.log(res)
            getFileUrl(res.data).then((res) => {
              insertVideo(res.data)
            })
          })
          console.log(resultFiles)
        }
        this.editor.config.onchange = (html) => {
          if (html) {
            this.vHtml = html
            self.$emit('htmlChange', html)
          }
        }
        this.editor.create()
        this.editor.txt.html(this.html)
      },
    },
  }
</script>

<style scoped lang="scss">
  .myEditor {
    width: 100%;
    height: 100%;
    .editor-content {
      width: 100%;
      height: 100%;
    }
  }
</style>
