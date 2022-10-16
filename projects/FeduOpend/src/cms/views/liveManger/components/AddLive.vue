<template>
  <div>
    <el-form ref="addLiveForm" :model="ruleForm" label-width="100px">
      <el-form-item
        label="发布范围"
        prop="releaseScope"
        :rules="filterRules({ required: true, msg: '请选择发布范围' })"
      >
        <el-select
          v-model="ruleForm.releaseScope"
          style="width: 400px"
          placeholder="请选择发布范围"
          @change="setReleaseType"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.releaseScope === 1"
        label="指定区域"
        prop="areaId"
        :rules="filterRules({ required: true, msg: '请选择指定区域' })"
      >
        <el-cascader
          v-model="ruleForm.areaId"
          style="width: 400px"
          placeholder="请选择"
          :options="addressOptions"
          @change="setArea"
        ></el-cascader>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.releaseScope === 2"
        label="幼儿园"
        prop="schoolName"
        :rules="filterRules({ required: true, msg: '请选择幼儿园' })"
      >
        <el-input
          v-model="ruleForm.schoolName"
          type="text"
          maxlength="40"
          style="width: 400px"
          placeholder="请选择幼儿园"
          @click.native="showGarden"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="直播名称"
        prop="name"
        :rules="filterRules({ required: true, msg: '请输入直播名称' })"
      >
        <el-input v-model="ruleForm.name" style="width: 400px"></el-input>
      </el-form-item>
      <!--      <el-form-item-->
      <!--        label="直播封面"-->
      <!--        prop="imgUrl"-->
      <!--        :rules="filterRules({ required: true, msg: '请选择直播封面' })"-->
      <!--      >-->
      <!--        &lt;!&ndash;        <div class="uploadBtn" @click="openUpload">&ndash;&gt;-->
      <!--        &lt;!&ndash;          <img v-if="imgUrlFlag" :src="ruleForm.imgUrl" class="avatar" alt="" />&ndash;&gt;-->
      <!--        &lt;!&ndash;          <vab-remix-icon v-else icon="add-fill" />&ndash;&gt;-->
      <!--        &lt;!&ndash;        </div>&ndash;&gt;-->
      <!--        <vab-cropper ref="vabCropper" @sendPhoto="getArticlePhoto" />-->
      <!--      </el-form-item>-->
      <el-form-item
        label="图片封面"
        prop="picturePath"
        :rules="filterRules({ required: true, msg: '请选择封面图片' })"
      >
        <el-image
          v-if="imgUrlFlag"
          style="width: 300px; height: 150px"
          :src="ruleForm.imgUrl"
          :preview-src-list="[ruleForm.imgUrl]"
        ></el-image>
        <el-button
          style="width: 115px; margin-top: 5px"
          size="small"
          :type="imgUrlFlag ? 'warning' : 'primary'"
          icon="el-icon-upload2"
          @click="openCropper"
        >
          {{ imgUrlFlag ? '删除封面' : '点击上传' }}
        </el-button>
        <vab-cropper ref="vabCropper" @sendPhoto="getArticlePhoto" />
      </el-form-item>
      <el-form-item
        label="直播时间"
        prop="liveTime"
        :rules="filterRules({ required: true, msg: '请输入直播时间' })"
      >
        <el-date-picker
          v-model="ruleForm.liveTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="推流地址"
        prop="pushStreamAddress"
        :rules="filterRules({ required: true, msg: '请输入推流地址' })"
      >
        <el-input
          v-model="ruleForm.pushStreamAddress"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="课程详情"
        prop="content"
        :rules="filterRules({ required: true, msg: '请输入课程详情' })"
      >
        <!--        <vab-quill-->
        <!--          ref="vabQuill"-->
        <!--          v-model="ruleForm.content"-->
        <!--          :height="400"-->
        <!--          :options="options"-->
        <!--        ></vab-quill>-->
        <!--        <wang-editor v-model="ruleForm.content" />-->
        <my-editor v-model="ruleForm.content" />
      </el-form-item>
      <el-form-item
        label="上线时间"
        prop="onlineTime"
        :rules="filterRules({ required: true, msg: '请输入上线时间' })"
      >
        <el-date-picker
          v-model="ruleForm.onlineTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择上线时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存并退出</el-button>
        <!--        <el-button v-if="!isUpdate" type="primary" @click="submitFormDraft()">-->
        <!--          保存为草稿-->
        <!--        </el-button>-->
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
    <cms-upload ref="cmsUpload"></cms-upload>
    <el-dialog
      title="幼儿园列表"
      :visible.sync="showGardenList"
      width="60%"
      top="40px"
      height="600"
    >
      <div>
        <garden
          :school-data="ruleForm.schoolIds"
          @setSchool="getSchool"
        ></garden>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="setSchool">确 定</el-button>
        <el-button @click="showGardenList = false">取 消</el-button>
      </span>
    </el-dialog>
    <vab-upload
      ref="vabUpload"
      :limit="50"
      name="file"
      :size="2"
      @sendPhoto="getList"
    />
  </div>
</template>

<script>
  import VabCropper from '@/extra/VabCropper'
  import CmsUpload from '@/cms/common/cmsUpload'
  import { CATEGORY_LIST, PUBLISH_LIST } from '@/cms/constants'
  import { CodeToText, regionDataPlus } from 'element-china-area-data'
  import Garden from '@/cms/views/schoolActivityManage/compoents/garden'
  import { LiveVideoAdd, LiveVideoUpdate } from '@/cms/api/liveSetting'
  import { GetFile } from '@/api/common'
  import vabUpload from '@/extra/VabUpload'
  import MyEditor from '@/cms/components/editor'
  export default {
    components: {
      MyEditor,
      VabCropper,
      vabUpload,
      CmsUpload,
      Garden,
    },
    data() {
      return {
        imgUrlFlag: false,
        showGardenList: false,
        categoryList: CATEGORY_LIST,
        publishList: PUBLISH_LIST,
        addressOptions: regionDataPlus,
        picIsChanged: false,
        ruleForm: {
          releaseScope: '',
          name: '',
          picturePath: '',
          liveTime: '',
          pushStreamAddress: '',
          content: '',
          onlineTime: '',
        },
        options: {
          theme: 'snow',
          bounds: document.body,
          debug: 'warn',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                [{ list: 'ordered' }, { list: 'bullet' }], //列表
                [{ header: [3, false] }], //几级标题
                [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                [{ align: [] }], //对齐方式
                ['link', 'image'], //上传图片、上传视频
              ],
              handlers: {
                image: () => {
                  this.$refs['vabUpload'].handleShow()
                },
              },
            },
          },
          placeholder: '请输入文章内容...',
          readOnly: false,
        },
        isImgChange: false,
        isUpdate: false,
      }
    },
    methods: {
      update(item) {
        console.log(item)
        this.ruleForm = Object.assign({}, item)
        this.isUpdate = true
        if (+item.status !== 1) {
          this.imgUrlFlag = true
          this.$set(this.ruleForm, 'imgUrl', item.picturePath)
          this.$set(this.ruleForm, 'releaseScope', +item.releaseScope)
          if (+item.releaseScope === 1) {
            this.$set(this.ruleForm, 'areaId', [
              item.province,
              item.city,
              item.area,
            ])
          }
          if (+item.releaseScope === 2) {
            const text =
              item.schoolId.length === 0
                ? '请选择幼儿园'
                : `已选择${item.schoolId.length}所学校`
            this.$set(this.ruleForm, 'schoolName', text)
          }
        }
      },
      //获取图文上传数据
      async getList(data) {
        if (data) {
          await this.getPicture(data, 'content')
        }
      },
      //获取图片数据
      async getPicture(data, type) {
        if (data) {
          console.log(data)
          this.$set(this.ruleForm, 'picturePath', data)
          this.picIsChanged = true
          GetFile(data).then((res) => {
            console.log(res)
            if (+res.code === 0) {
              if (type === 'content') {
                if (res.data) {
                  let quill = this.$refs.vabQuill.Quill
                  let length = quill.selection.savedRange.index
                  let index = length ? length : 0
                  quill.insertEmbed(index, 'image', res.data)
                }
                return res.data
              } else {
                this.$set(this.ruleForm, 'imgUrl', res.data)
                this.imgUrlFlag = true
                this.$refs.addLiveForm.validate()
              }
            }
          })
        }
      },
      //获取封面图片
      async getArticlePhoto(data) {
        if (data) {
          await this.getPicture(data)
        }
      },
      //调用截图工具
      openCropper() {
        if (this.imgUrlFlag) {
          this.imgUrlFlag = false
          this.$set(this.ruleForm, 'imgUrl', '')
          this.$set(this.ruleForm, 'picturePath', '')
        } else {
          this.$refs['vabCropper'].dialogVisible = true
        }
      },
      //预览图片
      handlePreview() {
        this.tempNews = {}
        this.$refs.ruleForm.validate((valid) => {
          this.$refs.ruleForm.validateField('content', () => {})
          if (valid) {
            this.dialogTableVisible = true
            this.tempNews = { ...this.ruleForm }
          }
        })
      },
      //获取地区数据
      codeChange(value) {
        let dz
        if (value[1] != null && value[2] != null) {
          dz =
            CodeToText[value[0]] +
            '/' +
            CodeToText[value[1]] +
            '/' +
            CodeToText[value[2]]
        } else {
          if (value[1] != null) {
            dz = CodeToText[value[0]] + '/' + CodeToText[value[1]]
          } else {
            dz = CodeToText[value[0]]
          }
        }
        return dz
      },
      async setArea(data) {
        if (data.length > 0) {
          this.ruleForm.province = data[0] || ''
          this.ruleForm.city = data[1] || ''
          this.ruleForm.area = data[2] || ''
        } else {
          this.ruleForm.province = ''
          this.ruleForm.city = ''
          this.ruleForm.area = ''
        }
        delete this.ruleForm.schoolId
      },
      getSchool(data) {
        this.schoolData = [...data]
        this.ruleForm.schoolId = data
        delete this.ruleForm.province
        delete this.ruleForm.city
        delete this.ruleForm.area
      },
      showGarden() {
        this.showGardenList = true
      },
      setSchool() {
        const text =
          this.schoolData.length === 0
            ? '请选择幼儿园'
            : `已选择${this.schoolData.length}所学校`
        this.$set(this.ruleForm, 'schoolName', text)
        this.$message.success('添加成功')
        this.showGardenList = false
        this.$refs.addLiveForm.validate()
      },
      close() {
        this.isUpdate = false
        this.isImgChange = false
        this.showGardenList = false
        this.imgUrlFlag = false
        this.picIsChanged = false
        this.schoolData = []
        this.$emit('cancel')
        this.ruleForm = {
          releaseScope: '',
          name: '',
          picturePath: '',
          liveTime: '',
          pushStreamAddress: '',
          content: '',
          onlineTime: '',
        }
      },
      setReleaseType() {
        if (+this.ruleForm.releaseType !== 1) {
          delete this.ruleForm.areaId
          delete this.ruleForm.areaName
        }
        if (this.ruleForm.releaseType !== 2) {
          delete this.ruleForm.schoolIds
        }
      },
      openUpload() {
        this.$refs['cmsUpload'].upload('.jpeg,.jpg').then((res) => {
          this.imgUrlFlag = true
          this.isImgChange = true
          this.$set(this.ruleForm, 'imgUrl', res.url)
          this.$set(this.ruleForm, 'picturePath', res.data)
          this.$forceUpdate()
        })
      },
      submitForm() {
        this.$refs.addLiveForm.validate(async (valid) => {
          if (valid) {
            this.ruleForm.status =
              new Date().getTime() >= new Date(this.ruleForm.liveTime).getTime()
                ? 3
                : 2
            if (!this.picIsChanged) {
              delete this.ruleForm.picturePath
            }
            if (this.isUpdate) {
              await LiveVideoUpdate(this.ruleForm)
            } else {
              await LiveVideoAdd(this.ruleForm)
            }
            this.close()
          } else {
            console.log('error submit!!')
            return false
          }
        })
        console.log(this.ruleForm, '---')
      },
      //保存为草稿
      // async submitFormDraft() {
      //   if (this.ruleForm?.name) {
      //     this.ruleForm.status = 1
      //     await LiveVideoAdd(this.ruleForm)
      //     this.close()
      //   }
      // },
      resetForm() {
        this.close()
        this.$emit('cancel')
        this.$refs.addLiveForm.resetFields()
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      handleAvatarSuccess(res, file) {
        this.ruleForm.imgUrl = URL.createObjectURL(file.raw)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    // position: relative;
    // overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    line-height: 178px;
    color: #8c939d;
    text-align: center;
  }
  .avatar {
    display: block;
    width: 178px;
    height: 178px;
  }
</style>
