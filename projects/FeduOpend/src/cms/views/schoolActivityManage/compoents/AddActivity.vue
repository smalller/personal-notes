<template>
  <div>
    <h3>{{ type === 0 ? '新增运营动态' : '修改运营动态' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="120px"
      class="article_ruleForm"
    >
      <el-form-item
        label="发布范围"
        prop="releaseType"
        :rules="filterRules({ required: true, msg: '请选择发布范围' })"
      >
        <el-select
          v-model="ruleForm.releaseType"
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
        v-if="ruleForm.releaseType === 1"
        label="指定区域"
        prop="areaId"
        :rules="
          filterRules({
            required: true,
            msg: '请选择指定区域',
            trigger: 'change',
          })
        "
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
        v-if="ruleForm.releaseType === 2"
        label="幼儿园"
        prop="schoolName"
        :rules="
          filterRules({
            required: true,
            msg: '请选择幼儿园',
            trigger: 'change',
          })
        "
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
        label="内容"
        prop="content"
        :rules="filterRules({ required: true, msg: '请输入摘要' })"
      >
        <el-input
          v-model="ruleForm.content"
          style="width: 400px"
          type="textarea"
          placeholder="请输入内容"
          rows="10"
          resize="none"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="发布类型" prop="releaseType">
        <el-select
          v-model="ruleForm.dynamicType"
          style="width: 400px"
          placeholder="请选择发布类型"
          @change="setType"
        >
          <el-option
            v-for="item in publishList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="article_item">
        <el-form-item
          v-show="ruleForm.dynamicType == 1"
          v-if="ruleForm.dynamicType == 1"
          label="图片"
          prop="picturePath"
          :rules="filterRules({ required: true, msg: '请选择上传图片' })"
        >
          <div class="imgBox">
            <div
              v-for="(item, index) in picture"
              :key="index"
              style="width: 200px; margin-right: 5px"
            >
              <el-card
                style="width: 200px; height: 175px; border: 1px solid #eeeeee"
              >
                <el-image
                  style="width: 100%; height: 100px"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                ></el-image>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  style="margin-left: 20px"
                  @click="delPics(item)"
                >
                  删除图片
                </el-button>
              </el-card>
            </div>
          </div>
          <el-upload
            multiple
            class="upload-demo"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleChange"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" icon="el-icon-upload2" type="primary">
              点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">图片尺寸686*420</div>
          </el-upload>
          <vab-cropper ref="vabCropper" @sendPhoto="getArticlePhoto" />
        </el-form-item>

        <el-form-item
          v-if="ruleForm.dynamicType == 2"
          prop="videoPath"
          label="上传视频"
          :rules="filterRules({ required: true, msg: '请选择上传视频' })"
        >
          <choose-video
            v-if="type == 0 || ruleForm.videoPath || ruleForm.dynamicType == 2"
            :video-link="ruleForm.videoPath"
            @sendVideo="getVideo"
          ></choose-video>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.dynamicType == 2"
          label="视频封面"
          prop="videoCover"
          :rules="filterRules({ required: true, msg: '请选择封面图片' })"
        >
          <div class="imgBox">
            <div
              v-for="(item, index) in pictureList"
              :key="index"
              style="width: 200px; margin-right: 5px"
            >
              <el-card
                style="width: 200px; height: 175px; border: 1px solid #eeeeee"
              >
                <el-image
                  style="width: 100%; height: 100px"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                ></el-image>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  style="margin-left: 20px"
                  @click="delPic(item)"
                >
                  删除封面
                </el-button>
              </el-card>
            </div>
          </div>
          <el-button
            v-if="!pictureList.length"
            style="margin-top: 5px; width: 115px"
            size="small"
            :type="pictureList.length ? 'warning' : 'primary'"
            @click="openCropper"
          >
            {{ pictureList.length ? '删除封面' : '点击上传' }}
          </el-button>
          <vab-cropper ref="vabCropper" @sendPhoto="getArticlePhoto" />
        </el-form-item>
        <el-form-item label="阅读量" prop="views">
          <el-input
            v-model="ruleForm.views"
            style="width: 400px"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
            maxlength="9"
            type="text"
            placeholder="请输入文章浏览数"
          ></el-input>
        </el-form-item>
        <el-form-item label="点赞数" prop="click">
          <el-input
            v-model="ruleForm.click"
            style="width: 400px"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
            maxlength="9"
            type="text"
            placeholder="请输入文章点赞数"
          ></el-input>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="publish">发布</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>

    <vab-upload
      ref="vabUpload"
      :limit="50"
      name="file"
      :size="2"
      @sendPhoto="getList"
    />
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
  </div>
</template>

<script>
  import { GetFile } from '@/api/common'
  import { AddActivity, EditActivity } from '@/api/activity'
  import ChooseVideo from './ChooseVideo'
  import vabUpload from '@/extra/VabUpload'
  import VabCropper from '@/extra/VabCropper'
  import moment from 'moment'
  import { limitFileWH } from '@/cms/utils'
  import VueCookie from 'vue-cookie'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  import Garden from './garden'
  import { CATEGORY_LIST, PUBLISH_LIST } from '@/cms/constants'
  export default {
    components: {
      vabUpload,
      VabCropper,
      ChooseVideo,
      Garden,
    },
    data() {
      return {
        ruleForm: {
          picturePath: [],
          content: '',
          status: 3,
          schoolIds: [],
          schoolName: '',
          areaId: [],
          areaName: '',
        },
        picture: [],
        type: 0,
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
        headers: {},
        loading1: false,
        location: {},
        dialogTableVisible: false,
        tempNews: {},
        categoryList: CATEGORY_LIST,
        publishList: PUBLISH_LIST,
        pictureList: [],
        addressOptions: regionDataPlus,
        showGardenList: false,
        schoolData: [],
        uploadUrl: '',
      }
    },
    created() {},
    mounted() {
      this.uploadUrl = `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadAndUserType?bizType=article&userType=${this.userType}`
      this.headers = {
        token: this.token,
        userId: this.userId,
      }
      // this.getCategoryList()
    },
    methods: {
      //获取地区数据
      codeChange(value) {
        if (value[1] != null && value[2] != null) {
          var dz =
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
        if (data) {
          if (data[0] !== '') {
            this.ruleForm.areaId = data.join(',')
            this.ruleForm.areaName = await this.codeChange(data)
          } else {
            this.ruleForm.releaseType = 3
            delete this.ruleForm.areaId
          }
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
      getSchool(data) {
        this.schoolData = [...data]
      },
      setSchool() {
        this.ruleForm.schoolName =
          this.schoolData.length === 0
            ? ''
            : `已选择${this.schoolData.length}所学校`
        if (this.schoolData.length > 0) {
          this.$message.success('添加成功')
          this.showGardenList = false
        } else {
          this.$message.warning('请先选择幼儿园！')
        }
      },
      setType() {
        this.ruleForm.picturePath = []
      },
      //上传成功
      handleChange(file) {
        if (this.beforeAvatarUpload) {
          this.getPicture(file.data, 'picture')
        }
      },
      //判断上传状态
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
          return false
        }
        return isJPG
      },
      //删除封面数据
      async delPic(data) {
        if (data) {
          this.pictureList = this.pictureList.filter(
            (item) => item.url !== data.url
          )
          this.ruleForm.picturePath = this.ruleForm.picturePath.filter(
            (item) => item !== data.path
          )
        }
      },
      //删除封面数据
      async delPics(data) {
        if (data) {
          this.picture = this.picture.filter((item) => item.url !== data.url)
          this.ruleForm.picturePath = this.ruleForm.picturePath.filter(
            (item) => item !== data.path
          )
        }
      },
      //获取封面图片
      showGarden() {
        this.showGardenList = true
      },
      async getArticlePhoto(data) {
        if (data) {
          await this.getPicture(data)
        }
      },
      //调用截图工具
      openCropper() {
        this.$refs['vabCropper'].dialogVisible = true
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
      //获取图文上传数据
      async getList(data) {
        if (data) {
          await this.getPicture(data, 'content')
        }
      },
      setData(data) {
        if (+data.releaseType === 2) {
          if (data.schoolIds.length === 0) {
            for (let item of this.schoolData) {
              data.schoolIds.push(item.id)
            }
          }
        }
        data.status = 3
        // if (+data.releaseType === 1 && data.areaId.length) {
        //   data.areaId = data.areaId.join(',')
        // }
        return data
      },
      //提交图文信息
      async publish() {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            let ruleData = {}
            ruleData = await this.setData({ ...this.ruleForm })
            if (this.type === 0) {
              AddActivity(ruleData).then((res) => {
                if (+res.code === 0) {
                  this.$emit('success')
                  this.$message({
                    message: '恭喜你，新增成功',
                    type: 'success',
                  })
                }
              })
            } else {
              EditActivity(ruleData).then((res) => {
                if (+res.code === 0) {
                  this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success',
                  })
                  this.$emit('success')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      //时间格式处理
      getCurrentTime() {
        let date = new Date()
        let Y = date.getFullYear()
        let M =
          date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let hours = date.getHours()
        let minutes =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let seconds =
          date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        date =
          Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
        return date
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
        // eslint-disable-next-line vue/custom-event-name-casing
        this.$emit('addClick', false)
      },
      //获取当前时间
      changeTime(date) {
        this.ruleForm.onlineTime_input =
          date.getTime() <= Date.now()
            ? '当前时间'
            : moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      //获取图片数据
      async getPicture(data, type) {
        if (data) {
          await GetFile(data).then((res) => {
            if (res.code == 0) {
              if (type === 'picture') {
                if (this.picture.length >= 20) {
                  this.$message.warning('已超出封面图片数量！')
                } else {
                  this.ruleForm.picturePath.push(data)
                  this.picture.push({ url: res.data, path: data })
                }
                return
              } else {
                if (this.pictureList.length >= 1) {
                  this.$message.warning('已超出封面图片数量！')
                } else {
                  this.ruleForm.videoCover = data
                  this.pictureList.push({ url: res.data, path: data })
                }
              }
            }
          })
        }
      },
      getVideo(data) {
        if (data) {
          this.ruleForm.videoPath = data.video
          this.ruleForm.videoSource = data.orgin
        }
      },
      //初始化表单数据
      async init(row) {
        this.type = 1
        this.ruleForm = { ...row }
        if (+row.releaseType === 1) {
          this.ruleForm.areaId = this.ruleForm.areaId.split(',')
        }
        if (+row.dynamicType === 1) {
          this.picture = []
          this.ruleForm.picturePath = []
          for (let item of row.picturePath) {
            this.getPicture(item, 'picture')
          }
        }
        if (+row.dynamicType === 2) {
          this.pictureList = []
          this.ruleForm.picturePath = []
          this.getPicture(row.videoCover)
        }
        if (row.schoolIds) {
          this.ruleForm.schoolName = `已选择${row.schoolIds.length}所学校`
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .article_ruleForm {
    padding: 20px 0;
    .article_item {
      flex-wrap: wrap;
      width: 500px;
    }
    .el-upload__tip {
      float: right;
      margin: 5px;
    }
    .onlineTime_item {
      position: relative;
      .el-date-editor {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
    }
  }
  .imgBox {
    width: 700px;
    display: flex;
    flex-wrap: wrap;
  }
  .garden-list {
    // padding-top: 30px;
    height: 600px;
    overflow: scroll;
  }
</style>
