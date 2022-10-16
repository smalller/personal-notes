<template>
  <div>
    <h3>{{ type === 0 ? '新增学校信息' : '修改学校信息' }}</h3>
    <div class="head">
      <el-button type="primary" @click="$parent.isEdit = false">返回</el-button>
    </div>
    <el-form
      ref="schoolData"
      :model="schoolData"
      label-width="120px"
      class="article_ruleForm"
    >
      <el-form-item
        label="学校名称"
        prop="name"
        :rules="filterRules({ required: true, msg: '请输入学校名称' })"
      >
        <el-input
          v-model="schoolData.name"
          type="text"
          maxlength="40"
          style="width: 400px"
          placeholder="请输入学校名称"
        ></el-input>
        <el-button style="margin-left: 5px" @click="schoolSearch">
          查询
        </el-button>
      </el-form-item>
      <el-form-item
        label="学校标签"
        prop="tag"
        :rules="filterRules({ required: true, msg: '请输入学校标签' })"
      >
        <el-input
          v-model="schoolData.tag"
          maxlength="40"
          type="text"
          placeholder="关键词以逗号间隔"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="入学节点"
        prop="enrollmentNodePos"
        :rules="filterRules({ required: true, msg: '请输入学校标签' })"
      >
        <div
          v-for="(item, index) in schoolData.enrollmentNodePos"
          :key="index"
          style="margin-bottom: 10px"
        >
          <el-input
            v-model="item.describe"
            maxlength="40"
            type="text"
            placeholder="请输入节点描述"
            style="width: 400px"
          ></el-input>
          <div style="margin-top: 10px">
            <el-date-picker
              v-model="item.startTime"
              type="date"
              style="width: 190px"
              placeholder="开始时间"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
            ></el-date-picker>
            <span style="margin-left: 7px; margin-right: 7px">-</span>
            <el-date-picker
              v-model="item.endTime"
              style="width: 190px"
              type="date"
              placeholder="结束时间"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-button
              v-show="index == schoolData.enrollmentNodePos.length - 1"
              style="margin-left: 10px"
              @click="addTime"
            >
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button
              v-show="
                index !== schoolData.enrollmentNodePos.length - 1 && index !== 0
              "
              style="margin-left: 10px"
              type="danger"
              plain
            >
              <i class="el-icon-delete" @click="delTime(index)"></i>
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="招生数据"
        prop="enrollmentDataPos"
        :rules="filterRules({ required: true, msg: '请输入学校标签' })"
      >
        <div
          v-for="(item, index) in schoolData.enrollmentDataPos"
          :key="index"
          style="margin-bottom: 10px"
        >
          <el-input
            v-model="item.year"
            maxlength="40"
            type="text"
            placeholder="请输入招生年份"
            style="width: 190px"
          ></el-input>
          <el-input
            v-model="item.totals"
            maxlength="40"
            type="text"
            placeholder="请输入招生班级数量"
            style="width: 190px; margin-left: 20px"
          ></el-input>
          <el-button
            v-show="index == schoolData.enrollmentDataPos.length - 1"
            style="margin-left: 10px"
            @click="addNum"
          >
            <i class="el-icon-plus"></i>
          </el-button>
          <el-button
            v-show="
              index !== schoolData.enrollmentDataPos.length - 1 && index !== 0
            "
            style="margin-left: 10px"
            type="danger"
            plain
          >
            <i class="el-icon-delete" @click="delNum(index)"></i>
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div>
          <div></div>
          <div
            id="GDMap"
            v-loading="loading"
            style="height: 300px; width: 400px"
          ></div>
        </div>
      </el-form-item>
      <el-form-item
        label="学校地址"
        prop="province"
        :rules="filterRules({ required: true, msg: '请输入学校地址' })"
      >
        <el-input
          v-model="schoolData.province"
          type="text"
          maxlength="40"
          style="width: 80px"
        ></el-input>
        <el-input
          v-model="schoolData.city"
          type="text"
          maxlength="40"
          style="width: 80px; margin-left: 10px"
        ></el-input>
        <el-input
          v-model="schoolData.county"
          type="text"
          maxlength="40"
          style="width: 80px; margin-left: 10px"
        ></el-input>
        <el-input
          v-model="schoolData.address"
          type="text"
          maxlength="40"
          style="width: 185px; margin-left: 10px"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="学校电话"
        prop="mobile"
        :rules="filterRules({ required: true, msg: '请输入学校电话' })"
      >
        <el-input
          v-model="schoolData.mobile"
          type="text"
          maxlength="40"
          style="width: 455px"
          placeholder="请输入学校电话"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="学校性质"
        prop="schoolNature"
        :rules="filterRules({ required: true, msg: '请选择学校性质' })"
      >
        <el-radio-group v-model="schoolData.schoolNature">
          <el-radio :label="1" :value="1">公办</el-radio>
          <el-radio :label="2" :value="2">私立</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="直营单位" prop="straightPipeUnit">
        <el-input
          v-model="schoolData.straightPipeUnit"
          type="text"
          maxlength="40"
          style="width: 455px"
          placeholder="请输入直营单位"
        ></el-input>
      </el-form-item>
      <div class="article_item">
        <el-form-item
          label="宣传图片"
          prop="images"
          :rules="filterRules({ required: true, msg: '请上传宣传图片' })"
        >
          <div class="upPic">
            <div class="uploadBtn" @click="uploadPic">
              <img v-if="pictureUrl" :src="pictureUrl" class="avatar" alt="" />
              <vab-remix-icon v-else icon="add-fill" />
            </div>
          </div>

          <!-- <div class="imgBox">
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
          /> -->
        </el-form-item>
        <el-form-item label="宣传视频" prop="origin" style="margin-left: 0px">
          <choose-video
            :video-link="schoolData.promotionalVideoUrl"
            video-type="0"
            @sendVideo="getVideo"
          ></choose-video>
        </el-form-item>
        <el-form-item label="预览">
          <el-switch
            v-model="schoolData.isPreview"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="评测视频" prop="origin" style="margin-left: 0px">
          <choose-video
            :video-link="schoolData.evaluationVideoUrl"
            video-type="1"
            @sendVideo="getVideo"
          ></choose-video>
        </el-form-item>
      </div>
      <el-form-item
        label="评测人头像"
        prop="evaluatorImg"
        :rules="
          filterRules({
            required: !!schoolData.evaluationVideoUrl,
            msg: '请输入评测人头像',
          })
        "
      >
        <div class="uploadBtn" @click="openUpload">
          <img
            v-if="evaluatorImgUrl"
            :src="evaluatorImgUrl"
            class="avatar"
            alt=""
          />
          <vab-remix-icon v-else icon="add-fill" />
        </div>
      </el-form-item>
      <el-form-item
        label="评测人"
        prop="evaluator"
        :rules="
          filterRules({
            required: !!schoolData.evaluationVideoUrl,
            msg: '请输入评测人',
          })
        "
      >
        <el-input
          v-model="schoolData.evaluator"
          type="text"
          maxlength="40"
          style="width: 455px"
          placeholder="请输入评测人"
        ></el-input>
      </el-form-item>
      <el-form-item label="评测人标识" prop="evaluatorTag">
        <el-input
          v-model="schoolData.evaluatorTag"
          type="text"
          maxlength="40"
          style="width: 455px"
          placeholder="关键词以逗号间隔"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveDrafts">保存</el-button>
        <el-button @click="$parent.isEdit = false">取消</el-button>
      </el-form-item>
    </el-form>
    <vab-upload
      ref="vabUpload"
      :limit="50"
      name="file"
      :size="2"
      @sendPhoto="getList"
    />
    <cms-upload ref="cmsUpload"></cms-upload>
  </div>
</template>

<script>
  import { AddArticle, EditArticle, GetArticle } from '@/api/article'
  import { GetFile, addSchool } from '@/api/common'
  import ChooseVideo from './ChooseVideo'
  import vabUpload from '@/extra/VabUpload'
  import moment from 'moment'
  import { limitFileWH } from '@/cms/utils'
  import VueCookie from 'vue-cookie'
  import AMapLoader from '@amap/amap-jsapi-loader'
  import location from '../../../assets/images/title.png'
  import CmsUpload from '@/cms/common/cmsUpload'
  export default {
    components: {
      vabUpload,
      ChooseVideo,
      CmsUpload,
    },
    data() {
      return {
        schoolData: {
          tag: '',
          address: '',
          city: '',
          county: '',
          enableStatus: 0,
          enrollmentDataPos: [
            {
              totals: null,
              year: '',
            },
          ],
          enrollmentNodePos: [
            {
              describe: '',
              endTime: '',
              startTime: '',
            },
          ],
          evaluationVideo: '',
          evaluator: '',
          evaluatorImg: '',
          evaluatorTag: '',
          images: '',
          isPreview: '',
          latitude: '',
          longitude: '',
          mobile: '',
          name: '',
          promotionalVideo: '',
          province: '',
          remark: '',
          schoolNature: '',
          straightPipeUnit: '',
        },
        evaluationVideoUrl: '',
        promotionalVideoUrl: '',
        evaluatorImgUrl: '',
        pictureUrl: '',
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
        picture: '',
        type: 0,
        userType: VueCookie.get(`${firmId}_user_type`),
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
        uploadUrl: '',
        headers: {},
        loading1: false,
        dialogTableVisible: false,
        tempNews: {},
        categoryList: [{}, {}],
        videoUploadTag: false,
        videoLinkInfo: '',
        ariticleVideo: '',
        geoc: null,
        GDMap: null,
        plugins: [
          'AMap.OverView',
          'AMap.MouseTool',
          'AMap.PolyEditor',
          'AMap.RectangleEditor',
          'AMap.PlaceSearch',
          'AMap.DistrictLayer',
          'AMap.CustomLayer',
          'AMap.Autocomplete',
        ],
        // key
        key: 'c5eac55551560531336988396dacbf53',
        // 地图版本
        // v: '1.4.14',
        v: '2.0',
        loading: true,
        placeSearch: null,
        marker: [],
        address: '', //保存地址的汉字名字
        map: '', //保存地址的经纬度
        poiArr: [], //左边搜索出来的数组
        windowsArr: [], //信息窗口的数组
        markerMain: null,
        aMap: null,
      }
    },
    created() {
      // window.addEventListener([callback], { passive: false })
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        const that = this
        AMapLoader.load({
          key: this.key,
          plugins: this.plugins,
          version: this.v,
        })
          .then((AMap) => {
            that.aMap = AMap
            that.GDMap = new AMap.Map('GDMap', {
              zoom: 11,
              viewMode: '2D',
              resizeEnable: false,
              // dragEnable: false,
              center: [104.068813, 30.657205],
              // isHotspot: false
            })
            // AMap.event.addListener(this.GDMap, 'click', getLnglat) //点击事件
            that.GDMap.on('click', (e) => {
              this.getLnglat(e)
            })
            // let marker = new AMap.Marker({
            //   map: _this.mapObj,
            //   position: new AMap.LngLat('104.068', '30.657'), //此处根据页面数据可以直接传入经纬度进行描点
            // })
            that.GDMap.on('complete', () => {
              this.loading = false
            })
          })
          .catch(() => {
            this.loading = false
            console.log('地图加载失败！')
          })
      },
      schoolSearch() {
        const that = this
        this.aMap.plugin(['AMap.PlaceSearch'], function () {
          //构造地点查询类
          const placeSearch = new AMap.PlaceSearch({
            type: '科教文化服务|学校',
            pageSize: 1, // 单页显示结果条数
            pageIndex: 1, // 页码  map: map, // 展现结果的地图实例
            // panel: 'panel', // 结果列表将在此容器中进行展示。
            map: that.GDMap,
          })
          //关键字查询
          placeSearch.search(that.schoolData.name, (status, result) => {
            console.log(result)
            that.keywordSearch_CallBack(result)
          })
        })
      },
      getLnglat(e) {
        //初始化覆盖物对象并赋值给vue对象
        let icon = new this.aMap.Icon({
          image: location,
          size: new this.aMap.Size(25, 35),
          imageSize: new this.aMap.Size(25, 35),
        })
        this.markerMain = new this.aMap.Marker({
          icon: icon, //使用自定义的图标
          position: [e.lnglat.lng, e.lnglat.lat], //覆盖物位置坐标
        })
        this.mapMain.add(this.markerMain) //添加覆盖物到地图，与下方法同效
        this.mapMain.setFitView()
      },
      keywordSearch_CallBack(data) {
        let address = {}
        if (!data.poiList.pois.length) {
          this.$message({
            message: '未查询到对应学校，请输入详细名称',
            type: 'warning',
          })
        } else {
          address = data.poiList.pois[0]
          console.log(address)
          this.schoolData.province = address.pname
          this.schoolData.address = address.address
          this.schoolData.city = address.cityname
          this.schoolData.county = address.adname
          this.schoolData.latitude = address.location.lat
          this.schoolData.longitude = address.location.lng
          this.schoolData.mobile = address.tel
        }
        this.GDMap.setFitView()
      },
      //添加时间节点
      addTime() {
        this.schoolData.enrollmentNodePos.push({
          describe: '',
          startTime: '',
          endTime: '',
        })
      },
      //添加招生数据
      addNum() {
        this.schoolData.enrollmentDataPos.push({
          year: '',
          totals: '',
        })
      },
      delNum(data) {
        console.log(data)
        if (data) {
          this.schoolData.enrollmentDataPos.splice(data, 1)
        }
      },
      delTime(data) {
        if (data) {
          this.schoolData.enrollmentNodePos.splice(data, 1)
        }
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
      //提交图文信息
      async publish() {
        this.$refs.schoolData.validate(async (valid) => {
          if (valid) {
            let ruleData = {}
            ruleData = { ...this.schoolData }
            addSchool(ruleData).then((res) => {
              if (+res.code === 0) {
                this.$emit('success')
                this.$message({
                  message: !ruleData.id
                    ? '恭喜你,新增成功'
                    : '恭喜你，修改成功',
                  type: 'success',
                })
              }
            })
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
        this.publish()
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
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
          let index = length ? length : 0
          await GetFile(data).then((res) => {
            if (res.code == 0) {
              if (type === 'content') {
                if (res.data) {
                  quill.insertEmbed(index, 'image', res.data)
                }
                return res.data
              } else {
                if (this.pictureList.length >= 1) {
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
        if (data) {
          GetFile(data.video).then((res) => {
            if (+res.code === 0) {
              console.log(res)
              if (+data.type === 0) {
                this.schoolData.promotionalVideo = data.video
                this.schoolData.promotionalVideoUrl = res.data
              } else {
                this.schoolData.evaluationVideo = data.video
                this.schoolData.evaluationVideoUrl = res.data
              }
            }
          })
        }
      },
      //初始化表单数据
      async init(row) {
        if (row.enrollmentNodePos) {
          this.schoolData.enrollmentNodePos = row.enrollmentNodePos
        }
        if (row.id) {
          this.schoolData = { ...row }
          this.pictureUrl = this.schoolData.imagesUrl
          this.evaluatorImgUrl = this.schoolData.evaluatorImgUrl
          // delete this.schoolData.images
        }
        // await GetArticle(row.id).then((res) => {
        //   if (+res.code === 0) {
        //     params = { ...res.data }
        //     this.type = 1
        //     params.onlineTime_input = params.onlineTime
        //     if (params.pictureUrls.length) {
        //       for (let i = 0; i < params.pictureUrls.length; i++) {
        //         this.pictureList.push({
        //           url: params.pictureUrls[i],
        //           path: params.picturePath[i],
        //         })
        //       }
        //     }
        //     delete params.status
        //     this.ruleForm = { ...params }
        //   }
        // })
      },
      //添加头像
      openUpload() {
        this.$refs['cmsUpload'].upload('.jpeg,.jpg').then((res) => {
          console.log(res)
          this.evaluatorImgUrl = res.url
          this.$set(this.schoolData, 'evaluatorImg', res.data)
          this.$refs.schoolData.validateField('evaluatorImg')
          this.$forceUpdate()
        })
      },
      //添加头像
      uploadPic() {
        this.$refs['cmsUpload'].upload('.jpeg,.jpg').then((res) => {
          this.pictureUrl = res.url
          this.$set(this.schoolData, 'images', res.data)
          this.$forceUpdate()
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  * {
    touch-action: pan-x;
  }
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
  .uploadBtn {
    width: 100px;
    height: 100px;
    i {
      border: 1px solid #ccc;
    }
  }
  .upPic {
    .uploadBtn {
      width: 300px;
      height: 200px;
      i {
        border: 1px solid #ccc;
      }
    }
  }
</style>
<style>
  .el-date-picker {
    z-index: 99999 !important;
  }
</style>
