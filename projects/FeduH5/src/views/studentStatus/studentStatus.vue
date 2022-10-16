<template>
  <div class="studentStatus">
    <my-head
      title="学籍录入"
      @leftClick="backClick"
    >
      <template #right>
                <div class="headBtn" @click="toText">填报说明</div>
      </template>
    </my-head>
    <div class="studentStatusContent">

      <div class="titleBox">
        <p>学籍信息</p>
        <span>仅用于幼儿园建立幼儿学籍档案</span>
      </div>
      <div class="infoContent">
        <div class="tips">
          <p>学籍档案的建立与幼小衔接相关，请认真填写。</p>
        </div>
        <div class="infoTitle">
          <span>基本信息</span>
        </div>
        <div class="userPhoto">
          <div

            class="userPhotoBtn"
          >
            <img
                @click="photoTypeSelectShow = true"
              class="userImg"
              v-if="imgUrl"
              :src="imgUrl"
              alt=""
            >
            <img
                @click="photoTypeSelectShow = true"
              v-else
              src="../../assets/image/plus.png"
              alt=""
            >
            <div class="openImg" v-if="imgUrl" @click="openImgMax">
              <img src="../../assets/student/openImg.png" alt="">
            </div>
            <span v-if="!formData.headerImg">添加孩子寸照</span>
          </div>
        </div>
        <van-form
          validate-first
          @failed="onFailed"
          ref="form"
          input-align="right"
        >
          <van-field
            label="姓名"
            :rules="[{ required: true, message: '请填写姓名' }]"
            v-model="formData.studentName"
            @input="studentNameChanged"
            placeholder="请输入"
          />
          <van-field
            label="姓名拼音"
            :rules="[{ required: true, message: '请填写姓名拼音' }]"
            v-model="formData.pinyin"
            @input="pinyinChange"
            placeholder="请输入"
          />

          <van-field
            label="性别"
            :rules="[{ required: true, message: '请选择性别' }]"
          >
            <template #input>
              <van-radio-group
                class="sexSelect"
                v-model="formData.stuSex"
                direction="horizontal"
              >
                <van-radio name="男">
                  男
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? nanIconActive:nanIcon"
                    />
                  </template>
                </van-radio>
                <van-radio name="女">
                  女
                  <template #icon="props">
                    <img
                      class="img-icon"
                      :src="props.checked ? nvIconActive:nvIcon"
                    />
                  </template>
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            :rules="[{ required: true, message: '请选择出生年月' }]"
            readonly
            clickable
            name="datetimePicker"
            label="出生年月"
            placeholder="点击选择日期"
            :value="formData.birthTime"
            right-icon="arrow"
            @click="birthTimeShow = true"
          >
            <template #input>
              <div>
                {{formData.birthTime}}
                <div
                  v-show="studentAge>7"
                  class="ageTag"
                >超过7岁</div>
              </div>
            </template>
          </van-field>
          <van-popup
            v-model="birthTimeShow"
            position="bottom"
          >
            <van-datetime-picker
              type="date"
              :min-date="new Date('2010/1/1')"
              :max-date="new Date()"
              @confirm="selectBirthTime"
              @cancel="birthTimeShow = false"
            />
          </van-popup>

          <van-field
            readonly
            clickable
            name="picker"
            :rules="[{ required: true, message: '请选择血型' }]"
            :value="formData.bloodType"
            label="血型"
            right-icon="arrow"
            placeholder="请选择"
            @click="bloodTypeShow = true"
          />
          <van-popup
            v-model="bloodTypeShow"
            position="bottom"
          >
            <van-picker
              show-toolbar
              :columns="getExcelData('血型',excelData)"
              @confirm="selectBloodType"
              @cancel="bloodTypeShow = false"
            />
          </van-popup>

          <van-field
            readonly
            clickable
            name="picker"
            :rules="[{ required: true, message: '请选择证件类型' }]"
            :value="formData.stuCertType"
            label="身份证件类型"
            placeholder="请选择"
            right-icon="arrow"
            @click="IDTypeShow = true"
          />
          <van-popup
            v-model="IDTypeShow"
            position="bottom"
          >
            <van-picker
              show-toolbar
              :columns="getExcelData('幼儿身份证件类型',excelData)"
              @confirm="selectIDType"
              @cancel="IDTypeShow = false"
            />
          </van-popup>
          <van-field
            label="证件号码"
            scroll-to-error
            v-model="formData.stuCertNo"
            :rules="formData.stuCertType==='居民身份证'?[{ required: true, message: '请输入证件号码' },{pattern:/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message: '请输入正确的号码'}]:[]"
            placeholder="请输入"
            @blur="focusOrBlur($event, 'blur')"
            @focus="focusOrBlur($event, 'focus')"
          />
        </van-form>
      </div>
      <div class="infoContent">
        <van-form
          validate-first
          @failed="onFailed"
          input-align="right"
        >
          <van-field
            readonly
            clickable
            name="picker"
            :value="formData.clazzName"
            label="班级"
            placeholder="请选择"
            right-icon="arrow"
            disabled
          />

          <van-field
            readonly
            clickable
            :rules="[{ required: true, message: '请选择入园日期' }]"
            name="datetimePicker"
            :value="formData.admissionTime"
            label="入园日期"
            placeholder="请选择"
            @click="admissionTimeShow = true"
          />
          <van-popup
            v-model="admissionTimeShow"
            position="bottom"
          >
            <van-datetime-picker
              type="date"
              @confirm="selectAdmissionTime"
              @cancel="admissionTimeShow = false"
            />
          </van-popup>
        </van-form>
      </div>
      <div
        class="nextBtn"
        @click="next"
      >下一步</div>
      <apple-bar />
      <van-action-sheet
        class="payBox"
        duration="0.1"
        v-model="photoTypeSelectShow"
        cancel-text="取消"
        close-on-click-action
        @cancel="photoTypeSelectShow = false"
      >
        <div class="photoTypeListBox">
          <div @click="photoTypeSelect('cameraLive')">
            在线制作证件照
            <span>推荐</span>
          </div>
          <div @click="photoTypeSelect('camera')">拍摄</div>
          <div @click="photoTypeSelect('image')">从相册上传</div>
        </div>
      </van-action-sheet>
<!--      <img-cut-->
<!--        ref="imgCut"-->
<!--        :token="token"-->
<!--        :id="userId"-->
<!--        @getImgData="getImgData"-->
      <van-image-preview v-model="imgReviewShow" :images="[imgUrl]"  :style="{backgroundColor: 'rgba(0,0,0,0.7)'}">
        <template v-slot:cover>
          <div class="downloadBtn" style="padding: 6px 10px;color: #ffffff" @click="downloadImg">下载图片</div>
        </template>
      </van-image-preview>

    </div>
  </div>
</template>

<script>
import MyHead from "@/views/userCamera/component/head";
import {pinyin} from "pinyin-pro";
import AppleBar from "@/components/appleBar";
import ImgCut from "@/components/imgCut";
import {mapActions, mapGetters} from 'vuex'
import dayjs from 'dayjs';
import qs from "qs";

import openId from "../../pay/openId";
import {getFileUrl} from "@/api/common";

export default {
  name: "studentStatus",
  components: { ImgCut, AppleBar, MyHead },
  mixins: [openId],
  data() {
    return {
      Date: Date,
      bloodTypeShow: false,
      IDTypeShow: false,
      birthTimeShow: false,
      clazzShow: false,
      admissionTimeShow: false,
      formData: {
        stuCertType: '居民身份证'
      },
      nanIcon: require('../../assets/image/nan_1.png'),
      nanIconActive: require('../../assets/image/nan_2.png'),
      nvIcon: require('../../assets/image/nv_1.png'),
      nvIconActive: require('../../assets/image/nv_2.png'),
      showPicker: false,
      photoTypeSelectShow: false,
      imgUrl: '',
      studentAge: 0,
      imgReviewShow: false
    }
  },
  computed: {
    ...mapGetters(['excelData', 'studentInfo', 'userId', 'token', 'schoolId'])
  },
  watch: {
    // 'formData.studentName': function (val) {
    //   console.log(val)
    //   // this.formData.pinyin = this.getPY(val).replaceAll(' ', '')
    // },
    studentInfo: {
      handler: function (val) {
        this.studentInfoToForm(val)
      },
      deep: true
    }
  },
  created() {

    if (this.studentInfo.studentId) {
      this.getStudentInfo()
    } else {
      if (this.$route.query?.studentId) {
        this.setStudentInfo({
          studentId: this.$route.query.studentId
        })
        this.getStudentInfo()
      }
    }

    if(sessionStorage.getItem('formData')) {
      const formData = sessionStorage.getItem('formData')
      this.formData = JSON.parse(formData)
    }
  },
  methods: {
    studentNameChanged(val) {
      this.$set(this.formData,'pinyin',  this.getPY(val).replaceAll(' ', ''))
    },
    pinyinChange(val) {
      this.$set(this.formData,'pinyin', val)
    },
    //前往填报说明
    toText() {
      sessionStorage.setItem('formData', JSON.stringify(this.formData))
      this.$router.push({
        name: 'studentText'
      })
    },
    focusOrBlur(ev, type) {
      console.log(ev, '99999999999999')
      if (type === 'focus') {
        ev.target.style.position = 'sticky'
      } else if (type === 'blur') {
        ev.target.style.position = 'none'
      }
    },
    ...mapActions(['setStudentInfo']),
    getImgData(e) {
      if (this.loading) {
        this.loading.clear()
        this.loading = null
      }
      this.$set(this.formData, 'headerImg', e.data)
      this.imgUrl = e.attach
    },
    backClick() {
      if (micell.ua.isWeChat()) {
        document.addEventListener('WeixinJSBridgeReady', function () { WeixinJSBridge.call('closeWindow'); }, false);

        WeixinJSBridge.call('closeWindow');
      }

      if (micell.ua.isAndroid()) {
        window.WebViewJavascriptBridge.closeWindow()
      } else {
        window.webkit.messageHandlers.closeWindow.postMessage("closeWindow")
      }
    },
    studentInfoToForm(info) {
      this.$set(this.formData, 'studentName', info.name)
      this.$set(this.formData, 'studentId', info.id)
      this.$set(this.formData, 'stuSex', +info.sex === 1 ? '男' : '女')
      this.$set(this.formData, 'birthTime', dayjs(info.birthTime).format('YYYY-MM-DD'))
      this.$set(this.formData, 'clazzId', info.clazzId)
      this.$set(this.formData, 'clazzName', info.clazzName)
      this.$set(this.formData, 'admissionTime', dayjs(info.createTime).format('YYYY-MM-DD'))
      this.$set(this.formData, 'studentId', info.id)
      this.$set(this.formData, 'studentId', info.id)
    },
    getExcelData: (key, data) => {
      return data.find(item => item.key === key)?.data || []
    },
    onConfirm(date) {
      this.formData.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.showPicker = false;
    },
    //出生年月选择
    selectBirthTime(value) {
      this.formData.birthTime = dayjs(value).format('YYYY-MM-DD');
      this.birthTimeShow = false;
      const date = dayjs()
      this.studentAge = date.diff(this.formData.birthTime, 'year')
    },
    //血型选择
    selectBloodType(value) {
      this.formData.bloodType = value
      this.bloodTypeShow = false
    },
    //身份证件选择
    selectIDType(value) {
      this.formData.stuCertType = value
      this.IDTypeShow = false
    },
    //班级选择
    selectClazzId(value) {
      this.formData.clazzId = value
      this.clazzShow = false;
    },
    //入园日期选择
    selectAdmissionTime(value) {
      this.formData.admissionTime = dayjs(value).format('YYYY-MM-DD')
      this.admissionTimeShow = false
    },
    //拍照方式选择
    photoTypeSelect(type) {
      this.photoTypeSelectShow = false
      if (type === 'cameraLive') {
        this.$router.push('/camera')
      } else if (type === 'camera') {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.style.opacity = 0;
        input.style.position = 'fixed';
        input.style.top = 0;
        input.style.left = 0;
        input.type = 'file';
        input.accept = ".png,.jpg";
        input.multiple = false
        input.name = "file";
        input.setAttribute('capture', 'camera')
        input.onchange = (e) => {
          document.body.removeChild(input)
          if (input.files.length > 0) {
            sessionStorage.setItem('photo', URL.createObjectURL(input.files[0]));
              this.$router.push({
                path: '/camera/testImg',
              });


            // const reader = new FileReader()
            // reader.readAsDataURL( input.files[0]);
            // reader.onload = e => {
            //   sessionStorage.setItem('photo', e.target.result);
            //   this.$router.push({
            //     path: '/camera/testImg',
            //   });
            // }
          }
        }
        input.click()
      } else if (type === 'image') {
        const input = document.createElement('input')
        document.body.appendChild(input);
        input.accept = "image/*";
        input.type = "file";
        input.name = "file";
        input.style.opacity = 0;
        input.style.position = 'fixed';
        input.style.top = 0;
        input.style.left = 0;
        input.multiple = false
        input.onchange = (e) => {
          document.body.removeChild(input)
          if (input.files.length > 0) {
            sessionStorage.setItem('photo', URL.createObjectURL(input.files[0]));
              this.$router.push({
                path: '/camera/testImg',
              });

            // const reader = new FileReader()
            // reader.readAsDataURL( input.files[0]);
            // reader.onload = e => {
            //   sessionStorage.setItem('photo', e.target.result);
            //   this.$router.push({
            //     path: '/camera/testImg',
            //   });
            // }
          }
        }
        input.click()
      }
    },
    getImgUrl(fileId) {
      // this.formData.headerImg = fileId
      this.$set(this.formData, 'headerImg', fileId)
      getFileUrl(fileId).then(res => {
        if (+res.code === 0) {
          this.imgUrl = res.data
        }
      })
    },
    onFailed() { },
    getPY: text => pinyin(text, { toneType: 'none' }),
    next() {
      if (!this.formData.headerImg) {
        this.$message.warning('请先上传学生照片！')
        return
      }
      this.$refs.form.validate().then(() => {
        this.formData.enableStatus = 9
        this.request(`${process.env['VUE_APP_BASE_API']}/schools/api/schoolRoll/save`, 'put', this.formData, {
          'Content-Type': 'application/json'
        }).then(res => {
          console.log(res)
          if (+res.code === 0) {
            this.$router.push({
              name: 'studentStatusDetails',
              query: {
                id: res.data.id
              }
            })
          } else {
            vant.Notify({ type: 'warning', message: res.msg });
          }
        })
      }).catch(err => {
        console.warn(err)

      })

    },
    //放大预览照片
    openImgMax() {
      this.imgReviewShow = true;
    },
    downloadImg() {
      micell.download(this.imgUrl,'photo.png')
    },
    getStudentInfo() {
      this.request(`${process.env['VUE_APP_BASE_API']}/schools/api/student/${this.studentInfo.studentId}`).then(res => {
        if (+res.code === 0) {
          res.data.studentId = res.data.id
          if (+res.data.setSchoolRoll === 1 && !this.$route.query.isEdit) {
            this.$router.push({
              name: 'studentPaper',
              query: {
                studentId: this.$route.query.studentId
              }
            })
          }
          this.setStudentInfo(res.data)
          this.setSchoolId(res.data.schoolId)
          this.getStudentStatus()

        }
      })
    },
    getStudentStatus() {
      this.$request(`/schools/api/schoolRoll/queryByStu/${this.studentInfo.studentId}`, {
        method: 'get'
      }).then(res => {
        if (+res.code === 0) {
          this.formData = JSON.parse(JSON.stringify(res.data))
          this.imgUrl = res.data.headerImg
          this.formData.headerImg = res.data.headerId
        } else {
          this.studentInfoToForm(this.studentInfo)
        }
        if (this.$route.query?.upload) {
          this.getImgUrl(this.$route.query.upload)
        }
      })
    },
    request(url, method = 'get', data, headers = {}) {
      headers = Object.assign(headers, {
        userId: this.userId,
        token: this.token,
        schoolId: this.schoolId
      })
      return new Promise((resolve, reject) => {
        if (method === 'get' && JSON.stringify(data) !== '{}') {
          url += `?${qs.stringify(data)}`
        }
        fetch(url, {
          method: method,
          headers: headers,
          body: method === 'get' ? null : JSON.stringify(data),
        }).then(res => {
          resolve(res.json())
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
</script>

<style  lang="less">
.studentStatus {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .van-field__label {
    font-size: 16px;
    font-weight: 500;
    color: #1c1c1c;
    display: flex;
    align-items: center;
  }
  .van-field {
    height: 50px;
    line-height: 30px;
    bottom: 0;
    .van-field__right-icon {
      color: #c4c4c6;
      position: absolute;
      right: -20px;
    }
  }
  .van-field--disabled {
    pointer-events: none;
  }
  .van-field__error-message {
    position: absolute;
    bottom: -18px;
  }
  .sexSelect {
    img {
      width: 20px;
      height: 20px;
    }
  }
  * {
    box-sizing: border-box;
  }
  .headBtn {
    color: #ff9f3d;
    font-size: 16px;
  }
  .studentStatusContent {
    width: 100%;
    flex: 1;
    background: url("../../assets/student/back.png") no-repeat #ff9f3d;
    background-size: 100% auto;
    padding: 0 10px;
    overflow-y: auto;
    .tips {
      margin-bottom: 12px;
      color: #ff2a2a;
      font-size: 14px;
    }
    .titleBox {
      margin-top: 26px;
      color: #ffffff;
      padding: 0 14px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 24px;
      p {
        font-size: 28px;
        font-weight: bold;
      }
      span {
        font-size: 14px;
      }
    }
    .infoContent {
      padding: 18px 16px;
      background: #ffffff;
      border-radius: 10px;
      margin-bottom: 10px;
      .infoTitle {
        display: flex;
        align-items: center;
        span {
          color: #1c1c1c;
          font-weight: bold;
          font-size: 20px;
        }
        &::before {
          content: "";
          display: inline-block;
          width: 3px;
          height: 20px;
          background: #ff9f3d;
          border-radius: 4px;
          margin-right: 5px;
        }
      }
      .userPhoto {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px 0;
        .userPhotoBtn {
          width: 146px;
          height: 180px;
          border-radius: 8px;
          background: #fff4e9;
          border: 2px solid rgba(255, 159, 61, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          .openImg{
            width: 24px;
            height: 24px;
            position: absolute;
            top: 6px;
            right: 6px;
            z-index: 1;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            img{
              width: 10px;
              height: 10px;
              margin: 0;
            }
          }
          img {
            width: 45px;
            height: 45px;
            margin-bottom: 16px;
          }
          .userImg {
            width: 100%;
            height: 100%;
            margin: 0;
          }
          span {
            color: #ff9f3d;
            font-size: 14px;
          }
        }
      }
    }
    .nextBtn {
      margin-top: 14px;
      width: 100%;
      height: 55px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ff8100;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 24px;
    }
  }
  .ageTag {
    padding: 2px 4px;
    border: 1px solid #ff9f3d;
    height: 20px;
    color: #ff9f3d;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    border-radius: 2px;
    margin-left: 6px;
  }
  .photoTypeListBox {
    background: #ffffff;
    > div {
      height: 55px;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      color: #1c1c1c;
      font-size: 18px;
      span {
        position: absolute;
        right: 60px;
        width: 51px;
        height: 24px;
        background: #ffd557;
        border-radius: 13px;
        color: #883505;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
