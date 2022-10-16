<template>
  <el-card class="media-insert">
    <el-form
      ref="form"
      :rules="rules"
      label-position="right"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="专辑名称" prop="albumName">
        <el-input
          v-model="form.albumName"
          maxlength="40"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="栏目" prop="columnId">
        <el-select v-model="form.columnId" placeholder="请选择栏目">
          <el-option
            v-for="item in columns"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input
          v-model="form.source"
          maxlength="200"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="11">
          <el-form-item label="热度" prop="hot">
            <el-input v-model="form.hot" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple-light"></div>
        </el-col>
        <el-col :span="11">
          <el-form-item label="点赞数" prop="likes">
            <el-input v-model="form.likes" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple-light"></div>
        </el-col>
        <el-col :span="11">
          <el-form-item label="浏览数" prop="views">
            <el-input v-model="form.views" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="封面" prop="cover">
        <div class="uploadBtn" @click="openUpload">
          <img v-if="imgUrlFlag" :src="form.imgUrl" class="avatar" alt="" />
          <vab-remix-icon v-else icon="add-fill" />
        </div>
      </el-form-item>
      <el-form-item label="专辑简介" prop="introduce">
        <wang-editor v-model="form.introduce"></wang-editor>
      </el-form-item>
      <el-form-item label="上线时间" prop="publishTime">
        <el-date-picker
          v-model="form.publishTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          default-time="12:00:00"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="收费方式" prop="isFree">
        <el-radio v-model="form.isFree" :label="true">免费</el-radio>
        <el-radio v-model="form.isFree" :label="false">VIP</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="next">保存下一步</el-button>
        <el-button type="primary" @click="add">保存</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
    <cms-upload ref="cmsUpload"></cms-upload>
  </el-card>
</template>

<script>
  import {
    EditMediaAlbum,
    GetColumn,
    subMediaAlbum,
  } from '@/cms/api/mediaSetting'
  import CmsUpload from '@/cms/common/cmsUpload'
  import WangEditor from '@/cms/views/article/compoents/wangEditor'
  export default {
    name: 'AddAlbum',
    components: { WangEditor, CmsUpload },
    data() {
      return {
        isUpdate: false,
        imgUrlFlag: false,
        title: '',
        dialogFormVisible: false,
        columns: [],
        coverIsChanged: false,
        form: {
          albumName: '',
          author: '',
          cover: '',
          hasDraft: true,
          hot: 1,
          introduce: '',
          likes: 1,
          publishTime: '',
          source: '',
          column: '',
          type: 1,
          views: 10,
          isFree: true,
        },
        rules: {
          albumName: [
            { required: true, message: '请输入专辑名字', trigger: 'blur' },
          ],
          author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
          source: [{ required: true, message: '请输入来源', trigger: 'blur' }],
          columnId: [
            { required: true, message: '请选择栏目', trigger: 'change' },
          ],
          cover: [{ required: true, message: '请上传封面', trigger: 'onload' }],
          introduce: [
            { required: true, message: '请输入简介', trigger: 'blur' },
          ],
          publishTime: [
            { required: true, message: '请选择上线时间', trigger: 'change' },
          ],
          isFree: [
            { required: true, message: '请选择收费方式', trigger: 'change' },
          ],
        },
        options: {
          theme: 'snow',
          bounds: document.body,
          debug: 'warn',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ size: ['small', false, 'large', 'huge'] }],
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
        type: 1,
        status: '',
      }
    },
    created() {
      console.log(this.$route.query)
      if (!!this.$route.query.id) {
        this.update()
      }
      this.type = this.$route.query.type
      this.getColumns()
    },
    beforeDestroy() {
      // alert(this.status)
      if (this.status !== 'next') {
        this.back()
      }
    },
    methods: {
      update() {
        this.isUpdate = true
        this.form = Object.assign({}, this.$route.query)
        this.form.imgUrl = this.form.cover
        this.imgUrlFlag = true
      },
      close() {
        this.dialogFormVisible = false
      },
      back() {
        this.$router.push({
          name: this.type === 1 ? 'videoSettings' : 'audioSettings',
        })
      },
      onSubmit() {
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              const data = this.columns.find(
                (item) => item.id === this.form.columnId
              )
              this.form.columnName = data.name || ''
              this.form.type = this.type
              if (!this.isUpdate) {
                console.log(this.form)
                subMediaAlbum(this.form)
                  .then((res) => {
                    resolve(res)
                  })
                  .catch(() => {
                    reject()
                  })
              } else {
                if (!this.coverIsChanged) {
                  delete this.form.cover
                }
                this.form.dataType = this.form.dataType.name
                EditMediaAlbum(this.form)
                  .then((res) => {
                    resolve(res)
                  })
                  .catch(() => {
                    reject()
                  })
              }
            } else {
              reject()
            }
          })
        })
      },
      async add() {
        this.status = ''
        await this.onSubmit()
        this.back()
      },
      async next() {
        this.status = 'next'
        const res = await this.onSubmit()
        await this.$router.push({
          name: 'mediaSettingInsert',
          query: { id: res.data, type: this.$route.query.type },
        })
      },
      getColumns() {
        GetColumn().then((res) => {
          // console.log(res)
          this.columns = res.data.list
        })
      },
      openUpload() {
        this.$refs['cmsUpload'].upload('.jpeg,.jpg').then((res) => {
          this.imgUrlFlag = true
          this.$set(this.form, 'imgUrl', res.url)
          this.$set(this.form, 'cover', res.data)
          this.coverIsChanged = true
          this.$forceUpdate()
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .media-insert {
    textarea {
      width: 600px;
      min-height: 400px;
    }
  }
</style>
