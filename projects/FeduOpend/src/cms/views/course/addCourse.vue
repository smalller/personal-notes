<template>
  <div class="addCourse">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item
        label="课程名称"
        prop="courseName"
        :rules="filterRules({ required: true, msg: '请输入课程名称' })"
      >
        <el-input
          v-model="form.courseName"
          maxlength="40"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="学科"
        prop="subjectId"
        :rules="filterRules({ required: true, msg: '请选择学科' })"
      >
        <el-select
          v-model="form.subjectId"
          placeholder="请选择学科"
          @change="subjectSelect"
        >
          <el-option
            v-for="item in subjectList"
            :key="item.id"
            :label="item.subjectName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="学科小类"
        prop="courseSubjectId"
        :rules="filterRules({ required: true, msg: '请选择学科小类' })"
      >
        <el-select
          v-model="form.courseSubjectId"
          placeholder="请选择学科小类"
          @change="subjectChildrenSelect"
        >
          <el-option
            v-for="item in subjectChildren"
            :key="item.id"
            :label="item.subjectName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="上传封面"
        :rules="filterRules({ required: true, msg: '请上传封面' })"
        prop="pic"
      >
        <div v-if="!imgUrl" class="img" @click="openImgClip">
          <i class="el-icon-plus"></i>
        </div>
        <img v-else class="img" :src="imgUrl" alt="" @click="openImgClip" />
      </el-form-item>
      <el-form-item
        label="教材价格"
        prop="coursePrice"
        :rules="filterRules({ required: true, msg: '请输入教材价格' })"
      >
        <el-input
          v-model="form.coursePrice"
          type="number"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="详情"
        prop="content"
        :rules="filterRules({ required: true, msg: '请输入详情' })"
      >
        <my-editor v-model="form.content" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addCourse">保存</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
    <img-clip ref="imgClip" @getimg="getImg"></img-clip>
  </div>
</template>

<script>
  import ImgClip from '@/cms/components/imgClip'
  import MyEditor from '@/cms/components/editor'
  import { addCourse, queryBySubjectId, querySubject } from '@/cms/api/course'
  import { getFileUrl } from '@/cms/api/common'
  export default {
    name: 'AddCourse',
    components: { MyEditor, ImgClip },
    data() {
      return {
        form: {
          content: '',
          courseName: '',
          coursePrice: '',
          courseSubjectId: '',
          pic: '',
          subjectId: '',
        },
        isEdit: false,
        config: {},
        imgUrl: '',
        imgBlob: null,
        html: '',
        subjectList: [],
        subjectChildren: [],
        isImgEdit: false,
      }
    },
    watch: {
      'form.coursePrice': function () {
        if (this.form.coursePrice.indexOf('.') > -1) {
          if (this.form.coursePrice.toString().split('.')[1].length > 2) {
            this.form.coursePrice = (+this.form.coursePrice).toFixed(2)
          }
        }
      },
    },
    created() {
      console.log(this.$route.query)
      this.isEdit = false
      this.isImgEdit = false
      if (!!this.$route.query.id) {
        this.isEdit = true
        this.form = this.$route.query
        this.imgUrl = this.$route.query.pic
        this.querySubjectChild()
      }
      this.querySubjectList()
    },
    methods: {
      back() {
        this.$router.back()
      },
      subjectSelect(id) {
        const subject = this.subjectList.find((item) => item.id === id)
        this.subjectChildren = subject.children
        this.form.courseSubjectId = ''
        this.$refs.form.validateField('subjectId')
      },
      subjectChildrenSelect() {
        this.$refs.form.validateField('courseSubjectId')
      },
      querySubjectChild() {
        queryBySubjectId({
          subjectId: this.form.subjectId,
          enableStatus: 1,
        }).then((res) => {
          if (+res.code === 0) {
            this.subjectChildren = res.data
          }
        })
      },
      addCourse() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.isEdit && !this.isImgEdit) {
              delete this.form.pic
            }
            this.form.courseType = 1
            addCourse(this.form).then((res) => {
              if (+res.code === 0) {
                this.$message.success('保存成功')
                this.back()
              }
            })
          }
        })
      },
      getImg(e) {
        this.imgUrl = e.url
        this.imgBlob = e.blob
        this.$set(this.form, 'pic', e.id)
        this.$refs.form.validateField('pic')
        this.isImgEdit = true
      },
      openImgClip() {
        let file = null
        if (this.imgBlob) {
          file = new File([this.imgBlob], 'clip.jpg', {
            type: this.imgBlob.type,
          })
        }
        this.$refs.imgClip.init(
          {
            width: this.config.width || 1920,
            height: this.config.height || 1080,
            size: 10240,
          },
          file
        )
      },
      querySubjectList() {
        querySubject({
          pageNo: 1,
          pageSize: 999,
          enableStatus: 1,
        }).then((res) => {
          if (+res.code === 0) {
            this.subjectList = res.data.list
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .addCourse {
    padding: 20px;
    box-sizing: border-box;
    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 320px;
      min-height: 180px;
      margin-top: 10px;
      cursor: pointer;
      border: 1px solid #999999;
      border-radius: 4px;
      i {
        font-size: 48px;
      }
    }
  }
</style>
