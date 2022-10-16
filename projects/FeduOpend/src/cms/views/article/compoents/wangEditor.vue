<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
    <vab-upload ref="vabUpload" :limit="50" name="file" :size="2" />
  </div>
</template>
<script>
  import E from 'wangeditor'
  import VueCookie from 'vue-cookie'
  import vabUpload from '@/extra/VabUpload'

  export default {
    components: {
      // vabQuill,
      vabUpload,
      // VabCropper,
      // phoneShow,
      // ChooseVideo,
      // editor,
    },
    model: {
      prop: 'data',
      event: 'setValue',
    },
    props: {
      data: {
        type: String,
        default: '',
      },
      height: {
        type: Number,
        default: 400,
      },
    },
    data() {
      return {
        editorContent: '',
        editor: null,
        info: null,
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
      }
    },
    watch: {
      info() {
        // this.$emit('getwang', this.info)
      },
      data() {
        console.log(this.data)
        this.editor.txt.html(this.data)
        // // 获取其中内容
        // this.editor.txt.html()
        // this.seteditor();
        // console.log(this.data, '新的值')
      },
      deep: true,
      immediate: true,
    },
    created() {
      // console.log('应该经过了')
    },
    mounted() {
      console.log(this.data)
      this.seteditor()
      if (this.data) {
        this.editor.txt.html(this.data)
      }
      // this.editor.txt.html(this.value);
    },
    methods: {
      getinfo() {
        // console.log(this.info, '里面的值')
      },
      pick() {
        //经过测试可以拿到输入的值this.editor.txt.html()
      },
      seteditor() {
        const that = this
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        // this.editor.config.onchange = function (html) {
        //   that.info = html
        // }
        this.editor.config.height = 800
        this.editor.config.uploadImgShowBase64 = false // base 64 存储图片
        this.editor.config.uploadImgServer = `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadAndUserType?bizType=article&userType=${this.userType}` // 配置服务器端地址
        this.editor.config.uploadImgHeaders = {
          token: this.token,
          userId: this.userId,
        } // 自定义 header
        this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
        this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
        this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        this.editor.config.menus = [
          'head',
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'link',
          'list',
          'foreColor',
          'justify',
          'image',
          // 'video',
        ]
        this.editor.config.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
            // console.log(result, '图片的数据')
          },
          success: (xhr, editor, result) => {
            // 图片上传成功回调
            // console.log(result, xhr, editor, '图片的数据')
          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
          },
          error: (xhr, editor) => {
            // 图片上传错误的回调
            // console.log(xhr, editor, '图片的数据')
          },
          customInsert: (insertImg, result, editor) => {
            if (result.attach) {
              // let id = result.data
              // // let a = result.data.fileName.split('.')[1]
              // // let str = id + '/' + a
              let url = result.attach
              insertImg(url)
            }
          },
        }
        // this.editor.config.menuFixed = false
        // this.editor.config.menuFixed = 50
        this.editor.create()
        // this.editor.txt.html(this.data)
        this.editor.config.onchange = function (newHtml) {
          that.$emit('setValue', newHtml)
        }
        // setInterval(() => {
        //   // console.log(this.editor.txt.html())
        // }, 1000)
        // $text1.val(this.editor.txt.html(this.data)) // 初始化 textarea 的值
      },
    },
  }
</script>

<style lang="scss">
  //.editor {
  //  margin-top: 20px;
  //  border: 1px solid #ccc;
  //  height: 300px;
  //  margin-bottom: 10px;
  //  // overflow-y: auto;
  //}
  .editor {
    width: 100%;
    margin: 0 auto;
    border: 1px solid #ccc;
    .toolbar {
      background-color: #f1f1f1;
    }
    .w-e-text-container {
      z-index: 2000 !important;
    }
    .w-e-menu {
      z-index: 2000 !important;
    }
    .text {
      height: 400px;
      background-color: #ffffff;
    }
    .w-e-text {
      &::-webkit-scrollbar {
        width: 10px;
        height: 0;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.11);
        background: rgba(255, 255, 255, 0.2);
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }
    }
  }
</style>
