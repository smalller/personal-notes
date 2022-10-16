<template>
  <div class="myEditor" style="border: 1px solid #ccc">
    <div ref="editor-toolbar" class="editor-toolbar"></div>
    <div
      ref="editor-text-area"
      style="height: 400px"
      class="editor-text-area"
    ></div>
    <cms-upload ref="cmsUpload" />
  </div>
</template>

<script>
  import CmsUpload from '@/cms/common/cmsUpload'
  // import Vue from 'vue'
  import * as E from '@wangeditor/editor'
  import '@wangeditor/editor/dist/css/style.css'
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
    created() {},
    mounted() {
      this.init()
    },
    html: function (val) {
      // if (this.editor) {
      //   if (this.vHtml !== val) {
      //     // this.editor.txt.html(val)
      //
      //     this.editor.setHtml(val)
      //   }
      // }
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy()
      this.editor = null
    },
    methods: {
      init() {
        const self = this
        // 切换语言
        const LANG = location.href.indexOf('lang=en') > 0 ? 'en' : 'zh-CN'
        E.i18nChangeLanguage(LANG)

        const editor = E.createEditor({
          selector: '.editor-text-area',
          html: '<p><br></p>',
          config: {
            placeholder: 'Type here...',
            MENU_CONF: {
              uploadImage: {
                fieldName: 'your-fileName',
                base64LimitSize: 10 * 1024 * 1024, // 10M 以下插入 base64
              },
              customUploadImg: (resultFiles, insertImgFn) => {
                console.log(resultFiles)
                self.$refs.cmsUpload.uploadFile(resultFiles[0]).then((res) => {
                  console.log(res)
                  getFileUrl(res.data).then((res) => {
                    insertImgFn(res.data)
                  })
                })
              },
              customUploadVideo: (resultFiles, insertVideo) => {
                self.$refs.cmsUpload.splitUpload(resultFiles[0]).then((res) => {
                  console.log(res)
                  getFileUrl(res.data).then((res) => {
                    insertVideo(res.data)
                  })
                })
                console.log(resultFiles)
              },
            },
            onChange(editor) {
              // console.log(editor.getHtml())
              self.vHtml = editor.getHtml()
              self.$emit('htmlChange', self.vHtml)
            },
          },
        })

        const toolbar = E.createToolbar({
          editor,
          selector: '.editor-toolbar',
          config: {
            excludeKeys: [
              'todo',
              'insertImage',
              'insertVideo',
              'insertTable',
              'fullScreen',
            ],
          },
        })

        this.editor = Object.seal(editor)
        setTimeout(() => {
          this.editor.setHtml(this.html)
        }, 300)
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
