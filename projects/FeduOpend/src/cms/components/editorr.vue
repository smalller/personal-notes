<template>
  <div class="myEditor" style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="vHtml"
      style="height: 500px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
    <cms-upload ref="cmsUpload" />
  </div>
</template>

<script>
  import CmsUpload from '@/cms/common/cmsUpload'
  // import Vue from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import '@wangeditor/editor/dist/css/style.css'
  import { getFileUrl } from '@/cms/api/common'
  export default {
    name: 'MyEditor',
    components: { CmsUpload, Editor, Toolbar },
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
        toolbarConfig: {
          excludeKeys: [
            'todo',
            'insertImage',
            'insertVideo',
            'insertTable',
            'fullScreen',
          ],
        },
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {},
        },
        mode: 'default',
      }
    },
    watch: {
      html: function (val) {
        if (this.editor) {
          if (this.vHtml !== val) {
            // this.editor.txt.html(val)
            // this.editor.setHtml(val)
            this.vHtml = val
          }
        }
      },
      vHtml: function (val) {
        if (this.html !== val) {
          this.$emit('htmlChange', val)
        }
      },
    },
    created() {
      const self = this

      //上传图片
      this.editorConfig.MENU_CONF['uploadImage'] = {
        async customUpload(file, insertFn) {
          const res = await self.$refs.cmsUpload.uploadFile(file)
          const { data } = await getFileUrl(res.data)
          console.log(file.name)
          insertFn(data, file.name, data)
          return Promise.resolve('ok')
        },
      }
      //上传视频
      this.editorConfig.MENU_CONF['uploadVideo'] = {
        async customUpload(file, insertFn) {
          // file 即选中的文件
          // 自己实现上传，并得到视频 url poster
          // 最后插入视频
          self.$refs.cmsUpload.splitUpload(file).then((res) => {
            console.log(res)
            getFileUrl(res.data).then((res) => {
              insertFn(res.data)
            })
          })
        },
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      const editor = this.editor
      if (editor == null) return
      editor.destroy()
      this.editor = null
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
      init() {
        const self = this
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
