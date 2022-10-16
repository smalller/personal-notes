<template>
  <div class="addUser_warpper">
    <h3>{{ type === 0 ? '新增视频' : '修改视频' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width: 600px"
    >
      <!-- :rules="filterRules({ required: true, msg: '请输入昵称' })" -->
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col>
          <el-form-item
            label="标题"
            prop="title"
            :rules="filterRules({ required: true, msg: '请输入标题' })"
          >
            <el-input v-model="ruleForm.title" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="上线时间" prop="time">
            <el-date-picker
              v-model="ruleForm.time"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="关键字"
        prop="keyWord"
        :rules="filterRules({ required: true, msg: '请输入关键字' })"
      >
        <el-input
          v-model="ruleForm.keyWord"
          autocomplete="off"
          placeholder="关键词以逗号间隔"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="origin">
        <el-input v-model="ruleForm.origin" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item
        label="封面图片"
        prop="pic"
        :rules="filterRules({ required: true, msg: '请选择封面图片' })"
      >
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :before-upload="beforeUploadVideo"
          :file-list="ruleForm.pic || []"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col>
          <el-form-item label="热度" prop="hot">
            <el-input v-model="ruleForm.hot" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="作者" prop="author">
            <el-input v-model="ruleForm.author" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col>
          <el-form-item label="点赞数" prop="thumb">
            <el-input v-model="ruleForm.thumb" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="浏览数" prop="lookNum">
            <el-input v-model="ruleForm.lookNum" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="origin" class="video_origin">
        <choose-video></choose-video>
      </el-form-item>
      <el-form-item prop="describe" label="视频描述">
        <vab-quill
          v-model="ruleForm.content"
          :min-height="400"
          :options="options"
        ></vab-quill>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { limitFileWH } from '@/cms/utils'
  import ChooseVideo from './ChooseVideo'
  import vabQuill from '@/extra/vabQuill'
  export default {
    components: {
      ChooseVideo,
      vabQuill,
    },
    data() {
      return {
        ruleForm: {
          system: '',
          visionNum: '',
          updataContent: '',
          status: '',
          forceUpdata: '',
          pic: [],
        },
        type: 0, //0新增 1修改
        isShowVisionPage: true, //是否需要安装包
        options: {
          theme: 'snow',
          bounds: document.body,
          debug: 'warn',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              // [{ header: [1, 2, 3, 4, 5, 6, false] }],
              // [{ size: ['small', false, 'large', 'huge'] }],
              [{ color: [] }, { background: [] }],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }],
              [{ direction: 'rtl' }],
              [{ font: [] }],
              ['clean'],
              ['link', 'image'],
            ],
          },
          placeholder: '内容...',
          readOnly: false,
        },
      }
    },
    watch: {
      'ruleForm.pic': {
        handler(val) {
          console.log(val, '--')
        },
        deep: true,
      },
    },
    methods: {
      submitForm() {},
      resetForm() {
        this.$refs.ruleForm.resetFields()
      },
      cancel() {
        this.$emit('cancel')
      },
      init(row) {
        //父组件调用
        this.type = 1
        this.ruleForm = row
      },
      async beforeUploadVideo(file) {
        let res = await limitFileWH(190, 132, file)
        return res
      },
      async handleChange(file, fileList) {
        // this.ruleForm.visionPage = [fileList[fileList.length - 1]]
        let res = await limitFileWH(190, 132, file)
        if (!res) {
          this.$set(this.ruleForm, 'pic', [])
          return
        }
        console.log(132132)
        this.$set(this.ruleForm, 'pic', [fileList[fileList.length - 1]])
      },
      systemChange(val) {
        console.log(val)
        this.isShowVisionPage = val !== 'ios'
      },
    },
  }
</script>

<style lang="scss">
  .addUser_warpper {
    .el-list-enter-active,
    .el-list-leave-active {
      transition: none;
    }

    .el-list-enter,
    .el-list-leave-active {
      opacity: 0;
    }
    .el-upload-list {
      position: absolute;
      top: -5px;
      left: 80px;
      height: 40px;
    }
  }
  .video_origin {
    .el-form-item__content {
      margin-left: 20px !important;
    }
  }
</style>

<style lang="scss" scoped>
  .addUser_warpper {
    padding: 20px;
    h3 {
      margin-bottom: 20px;
    }
    .upload-demo {
      position: relative;
      display: flex;
    }
  }
</style>
