<template>
  <div>
    <h3>{{ type === 0 ? '新增图文信息' : '修改图文信息' }}</h3>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="120px"
      class="article_ruleForm"
    >
      <el-form-item
        label="标题"
        prop="title"
        :rules="filterRules({ required: true, msg: '请输入标题' })"
      >
        <el-input
          v-model="ruleForm.title"
          type="text"
          maxlength="40"
          style="width: 400px"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="栏目名称"
        prop="columnId"
        :rules="filterRules({ required: true, msg: '请选择栏目名称' })"
      >
        <el-select
          v-model="ruleForm.columnId"
          style="width: 400px"
          placeholder="请选择栏目名称"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="关键字"
        prop="keyword"
        :rules="filterRules({ required: true, msg: '请输入关键字' })"
      >
        <el-input
          v-model="ruleForm.keyword"
          maxlength="40"
          type="text"
          placeholder="关键词以逗号间隔"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input
          v-model="ruleForm.source"
          type="text"
          maxlength="40"
          placeholder="请输入文章来源"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <div class="article_item">
        <el-form-item
          label="图片封面"
          prop="picturePath"
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
                  删除图片
                </el-button>
              </el-card>
            </div>
          </div>
          <el-image
            v-if="picture !== ''"
            style="width: 300px; height: 150px"
            :src="picture"
            :preview-src-list="picture"
          ></el-image>
          <el-button
            style="margin-top: 5px; width: 115px"
            size="small"
            :type="picture !== '' ? 'warning' : 'primary'"
            icon="el-icon-upload2"
            @click="openCropper"
          >
            {{ picture !== '' ? '删除封面' : '点击上传' }}
          </el-button>
          <vab-cropper
            ref="vabCropper"
            class="add-photo"
            @sendPhoto="getArticlePhoto"
          />
        </el-form-item>
        <el-form-item prop="origin" style="margin-left: -80px">
          <choose-video
            :video-link="ruleForm.videoPath"
            :video-type="ruleForm.videoSource"
            @sendVideo="getVideo"
          ></choose-video>
        </el-form-item>
        <el-form-item
          label="作者"
          prop="author"
          :rules="filterRules({ required: true, msg: '请输入作者' })"
        >
          <el-input
            v-model="ruleForm.author"
            placeholder="请输入作者名称"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="热度" prop="heat">
          <el-input
            v-model="ruleForm.heat"
            style="width: 400px"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
            maxlength="9"
            type="text"
            placeholder="请输入文章热度"
          ></el-input>
        </el-form-item>
        <el-form-item label="浏览数" prop="views">
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
      <el-form-item
        label="摘要"
        prop="summary"
        :rules="filterRules({ required: true, msg: '请输入摘要' })"
      >
        <el-input
          v-model="ruleForm.summary"
          style="width: 400px"
          type="textarea"
          placeholder="请输入内容"
          rows="3"
          maxlength="50"
          resize="none"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div>
          <!--          <vab-quill-->
          <!--            ref="vabQuill"-->
          <!--            v-model="ruleForm.content"-->
          <!--            :height="550"-->
          <!--            :options="options"-->
          <!--          />-->
          <!--          <wang-editor-->
          <!--            :data="ruleForm.content"-->
          <!--            @setValue="getContent"-->
          <!--          ></wang-editor>-->
          <my-editor v-model="ruleForm.content" />
          <!-- <div style="height: 400px">
            <editor :data="ruleForm.content"></editor>
          </div> -->
        </div>
      </el-form-item>
      <el-form-item label="上线时间" prop="onlineTime" class="onlineTime_item">
        <el-input
          v-model="ruleForm.onlineTime_input"
          style="width: 400px"
        ></el-input>
        <el-date-picker
          v-model="ruleForm.onlineTime"
          type="datetime"
          placeholder="选择日期时间"
          style="width: 400px"
          class="date-picker"
          @change="changeTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="publish">发布</el-button>
        <el-button type="success" @click="handlePreview">预览</el-button>
        <el-button type="primary" @click="saveDrafts">保存草稿</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      width="20%"
      style="border-radius: 15px"
      :visible.sync="dialogTableVisible"
    >
      <phone-show v-if="dialogTableVisible" :news="tempNews"></phone-show>
    </el-dialog>

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
            <choose-video
              :video-link="ruleForm.videoPath"
              :video-type="ruleForm.videoSource"
              :is-ariticle="1"
              @sendVideo="getVideo"
            ></choose-video>
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
        <!-- <el-tab-pane label="添加视频链接" name="second">
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
        </el-tab-pane> -->
      </el-tabs>
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
  import {
    AddArticle,
    EditArticle,
    GetCategory,
    GetArticle,
  } from '@/api/article'
  import { GetFile } from '@/api/common'
  import ChooseVideo from './ChooseVideo'
  import vabUpload from '@/extra/VabUpload'
  import VabCropper from '@/extra/VabCropper'
  import moment from 'moment'
  import { limitFileWH } from '@/cms/utils'
  import phoneShow from './phoneShow.vue'
  import VueCookie from 'vue-cookie'
  // import WangEditor from '@/cms/views/article/compoents/wangEditor'
  import MyEditor from '@/cms/components/editor'
  // import editor from './wangEditor.vue'
  export default {
    components: {
      MyEditor,
      vabUpload,
      VabCropper,
      phoneShow,
      ChooseVideo,
      // editor,
    },
    data() {
      return {
        ruleForm: {
          title: '',
          columnId: '',
          keyword: '',
          source: '',
          picturePath: [],
          author: '',
          heat: '',
          views: '',
          click: '',
          summary: '',
          content: '',
          onlineTime: '',
          onlineTime_input: '当前时间',
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
                ['image', 'video'], //上传图片、上传视频
              ],
              handlers: {
                image: () => {
                  this.$refs['vabUpload'].handleShow()
                },
                video: (value) => {
                  this.videoUploadTag = true
                },
              },
            },
          },
          placeholder: '请输入文章内容...',
          // readOnly: false,
        },
        picture: '',
        type: 0,
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
        uploadUrl: '',
        headers: {},
        loading1: false,
        location: {},
        dialogTableVisible: false,
        tempNews: {},
        categoryList: [],
        pictureList: [],
        videoUploadTag: false,
        videoLinkInfo: '',
        ariticleVideo: '',
      }
    },
    created() {},
    mounted() {
      this.getCategoryList()
    },
    methods: {
      //添加视频链接
      addVideoLink() {
        if (this.videoLinkInfo == '' && this.ariticleVideo == '') {
          this.$message({
            message: '请检查视频链接',
            type: 'warning',
          })
        }
        this.videoUploadTag = false
        if (this.ariticleVideo) {
          let data = ' <iframe   src=' + this.ariticleVideo + '></iframe>'
          this.ruleForm.content = data + this.ruleForm.content
        } else {
          this.$refs.vabQuill.Quill.insertEmbed(0, 'video', this.videoLinkInfo)
        }
        this.videoLinkInfo = ''
        this.ariticleVideo = ''
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
      //获取栏目数据
      getCategoryList() {
        this.categoryList = []
        let status = 1
        GetCategory(status).then((res) => {
          if (+res.code === 0) {
            this.categoryList = [...res.data.list]
          }
        })
      },
      //获取封面图片
      async getArticlePhoto(data) {
        if (data) {
          await this.getPicture(data)
        }
      },
      //调用截图工具
      openCropper() {
        if (this.picture !== '') {
          this.picture = ''
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
      //获取图文上传数据
      async getList(data) {
        if (data) {
          await this.getPicture(data, 'content')
        }
      },
      getContent(data) {
        if (data) {
          this.ruleForm.content = data
        }
      },
      //提交图文信息
      async publish() {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            let ruleData = {}
            ruleData = { ...(await this.setSatus(this.ruleForm)) }
            ruleData.content =
              `<div class="ql-editor">` + ruleData.content + `</div>`
            console.log(this.ruleForm)
            if (this.type === 0) {
              await delete ruleData.onlineTime_input
              AddArticle(ruleData).then((res) => {
                if (+res.code === 0) {
                  this.$emit('success')
                  this.$message({
                    message: '恭喜你，新增成功',
                    type: 'success',
                  })
                }
              })
            } else {
              let ruleForm = { ...this.ruleForm }
              EditArticle(ruleForm).then((res) => {
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
      //判断活动状态
      async setSatus(data) {
        if (data.onlineTime === '') {
          data.onlineTime = this.getCurrentTime()
        } else {
          data.onlineTime = moment(data.onlineTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
        if (data.status == undefined) {
          if (
            +new Date(data.onlineTime).getTime() <=
            +new Date().getTime() + 10000
          ) {
            data.status = 3
          } else {
            data.status = 2
          }
        }

        return data
      },
      //保存草稿数据
      saveDrafts() {
        this.ruleForm.status = 1
        this.publish()
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
      handleAvatarSuccess(res, file) {
        this.ruleForm.picturePath = [URL.createObjectURL(file.raw)]
      },
      handleRemove() {
        this.ruleForm.picturePath = ''
      },
      //上传成功
      async handleChange(file) {
        if (!this.beforeAvatarUpload) {
          this.$set(this.ruleForm, 'picturePath', [])
          return
        }
        this.$set(this.ruleForm, 'picturePath', file.data)
      },
      //判断上传状态
      async beforeAvatarUpload(file) {
        this.uploadUrl = `${process.env.VUE_APP_BASE_API}/mamserver/file/uploadAndUserType?bizType=article&userType=${this.userType}`
        this.headers = {
          token: this.token,
          userId: this.userId,
        }
        const isJPG = file.type === 'image/jpeg'
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
          return false
        }
        let res = await limitFileWH(686, 420, file)
        file.isFlag = res
        return isJPG && file.isFlag
      },
      //获取图片数据
      async getPicture(data, type) {
        if (data) {
          // let quill = this.$refs.vabQuill.Quill
          // let length = quill.selection.savedRange.index
          let index = length ? length : 0
          await GetFile(data).then((res) => {
            if (res.code == 0) {
              if (type === 'content') {
                if (res.data) {
                  quill.insertEmbed(index, 'image', res.data)
                }
                return res.data
              } else {
                if (this.pictureList.length >= 3) {
                  this.$message.warning('已超出封面图片数量！')
                } else {
                  this.ruleForm.picturePath.push(data)
                  this.pictureList.push({ url: res.data, path: data })
                }
              }
            }
          })
        }
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
          } else {
            this.ruleForm.videoPath = data.video
            this.ruleForm.videoSource = data.orgin
          }
        }
      },
      //初始化表单数据
      async init(row) {
        let params = {}
        await GetArticle(row.id).then((res) => {
          if (+res.code === 0) {
            params = { ...res.data }
            this.type = 1
            params.onlineTime_input = params.onlineTime
            if (params.pictureUrls.length) {
              for (let i = 0; i < params.pictureUrls.length; i++) {
                this.pictureList.push({
                  url: params.pictureUrls[i],
                  path: params.picturePath[i],
                })
              }
            }
            delete params.status

            this.ruleForm = { ...params }
            console.log(params)
            console.log(this.ruleForm)
            this.ruleForm.content = params.content
          }
        })
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
  .add-photo {
    z-index: 99999 !important;
  }

  .imgBox {
    width: 700px;
    display: flex;
    flex-wrap: wrap;
  }
</style>
<style>
  .el-date-picker {
    z-index: 99999 !important;
  }
</style>
