<template>
  <div class="apply-info">
    <my-head
      title="申请宝宝入园"
      @leftClick="backClick"
    >

    </my-head>
    <span class="teacher-info">来自{{formData.examinerName}}老师的入园邀请</span>
    <div class="top">

      <div class="top-info">
        <div class="top-icon">
          <img :src="formData.clazzImg?formData.clazzImg:deafultImg" />
        </div>
        <span class="class-info">{{formData.clazzName}}</span>
        <p>{{formData.schoolName}}</p>
        <div
          class="sign"
          v-if="formData.createTime"
        >
          <img :src="signImg" />
        </div>
        <div class="line"></div>
        <div class="yuan1"></div>
        <div class="yuan2"></div>
        <van-form
          validate-first
          label-width="80"
          style="padding-top:25px;padding-bottom: 30px;"
        >
          <van-field
            label="宝宝姓名："
            v-model="formData.studentName"
            placeholder="请输入宝宝姓名"
          />
          <!-- <van-field
            center
            clearable
            label="宝宝性别："
          /> -->
          <van-field
            name="radio"
            label="宝宝性别："
            v-model="formData.sex"
          >
            <template #input>
              <van-radio-group
                style="margin-top:0px;padding-bottom: 15px;border-bottom:1px solid #eee;margin-bottom: 20px;"
                direction="horizontal"
                v-model="formData.sex"
              >
                <van-radio
                  name="1"
                  @click="getSex"
                >
                  <template #default>
                    <span>男</span>
                    <img
                      style="width:20px;margin:0px 0 -5px 5px"
                      src="../../assets/student/boy.png"
                    />
                  </template>
                </van-radio>
                <van-radio
                  name="0"
                  @click="getSex"
                >
                  <template #default>
                    <span>女</span>
                    <img
                      style="width:20px;margin:0px 0 -5px 5px"
                      src="../../assets/student/girl.png"
                    />
                  </template>
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            label="宝宝生日："
            v-model="birthTime"
            :rules="[{ required: true}]"
            placeholder="请输入宝宝出生日期"
            readonly
            clickable
            @click="chooseDate = true"
          >
            <template #button>
              <div class="age">{{ageTitle !== ''?ageTitle:'0岁0个月'}}</div>
            </template>
          </van-field>
          <van-popup
            v-model="chooseDate"
            position="bottom"
            :style="{ height: '40%' }"
          >
            <van-datetime-picker
              @confirm="getDate"
              @cancel="chooseDate = false"
              type="date"
              title="请选择宝宝生日"
            />
          </van-popup>
          <van-field
            label="宝宝关系："
            placeholder="请选择与宝宝的关系"
            @click="chooseRelate = true"
          >
            <template #input>
              <img
                src="../../assets/arrow1.png"
                class="img-arrow"
              >
              <span :style="{color:relateTitle !== ''? '#323233':'#C8C9CC'}">{{relateTitle !== ""? relateTitle : '请选择与宝宝的关系'}}</span>
            </template>
          </van-field>
          <van-popup
            v-model="chooseRelate"
            position="bottom"
            :style="{ height: '30%' }"
          >
            <van-picker
              title="请选择与宝宝的关系"
              show-toolbar
              :columns="relateList"
              @confirm="getReleate"
              @cancel="chooseRelate = false"
            >
              <template #option="item">
                <span>{{item.describe}}</span>
              </template>
            </van-picker>
          </van-popup>
          <van-field
            label="家长姓名："
            v-model="formData.applyUserName"
            placeholder="请输入您的姓名"
          />
        </van-form>



        <div
            class="student-remark"
            v-if="formData.remark"
        >
          <span>审核消息：{{formData.remark}}</span>
          <p></p>
        </div>
        <div v-if="applyId&&applyCode" class="btnBox">
          <van-button
              class="next"
              @click="backInfo"
              v-if="formData.status === 0 && formData.enableStatus === 1"
          >撤销申请</van-button>
          <van-button
              class="next"
              @click="saveInfo"
              v-else-if="formData.enableStatus === 9 || formData.status === 2"
          >重新申请</van-button>

          <van-button
              class="next"
              @click="downApp('jz')"
          >下载金树丫</van-button>
          <div class="tips">下载或打开金树丫APP，就能一起查看宝宝班级照片和视频动态啦！</div>
        </div>
        <div v-else class="">
          <van-button
              class="next"
              @click="saveInfo"
          >申请入园</van-button>
          <div class="tips" @click="downApp('jz')">前往下载APP</div>
        </div>
      </div>

    </div>


  </div>

</template>

<script>
import MyHead from "@/views/userCamera/component/head";
import dayjs from 'dayjs'
export default {
  components: { MyHead },
  data() {
    return {
      formData: {
        familyRels: "",
      },
      chooseDate: false,
      ageTitle: "",
      chooseRelate: false,
      relateList: [
        {
          "index": 0,
          "name": "FATHER",
          "describe": "爸爸"
        },
        {
          "index": 1,
          "name": "MOTHER",
          "describe": "妈妈"
        },
        {
          "index": 2,
          "name": "YEYE",
          "describe": "爷爷"
        },
        {
          "index": 3,
          "name": "NAINAI",
          "describe": "奶奶"
        },
        {
          "index": 4,
          "name": "WAIGN",
          "describe": "外公"
        },
        {
          "index": 5,
          "name": "WAIPO",
          "describe": "外婆"
        },
        {
          "index": 6,
          "name": "BROTHER",
          "describe": "哥哥"
        },
        {
          "index": 7,
          "name": "SISTER",
          "describe": "姐姐"
        },
        {
          "index": 8,
          "name": "JIUJIU",
          "describe": "舅舅"
        }
      ],
      applyId: "",
      applyCode: "",
      relateTitle: "",
      birthTime: "",
      signImg: "",
      statusList: [
        {
          img: require("../../assets/student/status2.png"),
        },
        {
          img: require("../../assets/student/status1.png"),
        },
        {
          img: require("../../assets/student/status4.png"),
        },
        {
          img: require("../../assets/student/status3.png"),
        },
      ],
      deafultImg: require("../../assets/student.png")
    }
  },
  methods: {
    //获取选择时间
    getDate(time) {
      this.ageTitle = ""
      if (time) {
        this.ageTitle = this.setTime(time)
        this.birthTime = this.timeFormat(time, 'form')
        this.formData.birthday = dayjs(time).format("YYYY-MM-DD") + ' 00:00:00'
        this.chooseDate = false
      }
    },
    //处理学生年龄
    setTime(data) {
      const date = dayjs()
      let year = date.diff(data, 'year')
      let month = date.diff(data, 'month')
      if (month % 12) {
        return year + '岁' + month % 12 + '个月'
      } else {
        return year + '岁'
      }
    },
    //时间格式化
    timeFormat(time, type) { // 时间格式化 2019-09-08
      if (time) {
        let date = dayjs(time).format("YYYY年MM月DD日")
        return date
      }
    },
    //获取学生关系
    getReleate(data) {
      if (data.index !== '') {
        this.formData.familyRels = data.name
        this.relateTitle = data.describe
        this.chooseRelate = false
      }
    },
    backClick() {
      this.$router.back()
    },
    //提交申请
    saveInfo() {
      if (this.formData) {
        if (!this.formData.studentName) {
          this.$message.warning("请填写宝宝姓名");
          return
        }
        if (!this.formData.sex) {
          this.$message.warning("请选择宝宝性别");
          return
        }
        if (!this.formData.birthday) {
          this.$message.warning("请选择宝宝生日");
          return
        } if (!this.formData.familyRels) {
          this.$message.warning("请选择宝宝关系");
          return
        } if (!this.formData.applyUserName) {
          this.$message.warning("请填写家长姓名");
          return
        }
        this.$request('/schools/api/stuApply/commitApply', {
          method: 'post',
          data: this.formData
        }).then(res => {
          if (res.code === 0) {
            this.$message.success("提交成功!");
            this.$router.push({
              name: 'record'
            })
          } else {
            this.$message.error(res.msg);
          }
        })
      }
    },
    // 撤回申请
    backInfo() {
      if (this.formData.status === 0) {
        this.$request(`/schools/api/stuApply/revokeApply?id=${this.formData.id}`, {
          method: 'get',
        }).then(res => {
          if (res.code === 0) {
            this.$message.success("撤销申请成功!");
            this.$router.push({
              name: 'record'
            })
          }
        })
      }
    },
    getApplyInfo() {
      if (this.applyId) {
        this.$request(`/schools/api/stuApply/queryApply?id=${this.applyId}`, {
          methods: 'get',
        }).then(res => {
          if (res.code === 0) {
            this.formData = { ...res.data[0] }
            this.ageTitle = this.setTime(this.formData.birthday)
            this.birthTime = this.timeFormat(this.formData.birthday)
            this.relateTitle = this.formData.familyRels.describe
            this.formData.familyRels = this.formData.familyRels.name
            if (this.formData.enableStatus === 9) {
              this.signImg = this.statusList[3].img
            } else if (this.formData.status === 1) {
              this.signImg = this.statusList[1].img
            } else if (this.formData.status == 2) {
              this.signImg = this.statusList[2].img
            } else {
              this.signImg = this.statusList[0].img
            }
          }
        })
      }
    },
    getInvitedInfo() {
      if (this.applyCode) {
        this.$request(`/schools/api/stuApply/checkCode?code=${this.applyCode}`, {
          methods: 'get',
        }).then(res => {
          if (+res.code === 0) {
            this.formData = { ...res.data }
            this.formData.applyUser = this.$store.state.userId
            this.formData.phone = this.$store.state.userInfo.mobile
          }
        })
      }
    },
    getSex(data) {
      console.log(data, '000000000')
    },
    downApp(type) {
      this.$router.push(
          { path: '/download', query: { type: type } }
      )
    },
  },
  mounted() {
    this.applyId = this.$route.query.id
    this.applyCode = this.$route.query.code
    if (this.applyId) {
      this.getApplyInfo()
    }
    if (this.applyCode) {
      this.getInvitedInfo()
    }
  }
}
</script>

<style  lang="less" scoped>
.van-cell {
  border: none;
}
.van-cell::after {
  border-bottom: none;
}
.apply-info {
  min-height: 100vh;
  background: rgba(105, 118, 134);
  text-align: center;
  .student-remark {
    width: 340px;
    margin: auto;
    margin-top: 9px;
    min-height: 10vh;
    background: rgba(255, 255, 255);
    border-radius: 9px 9px 9px 9px;
    span {
      float: left;
      margin-left: 16px;
      margin-top: 12px;
      display: block;
    }
  }
  .btnBox{
    display: flex;
    justify-content: space-around;
    .next {
      padding:0 50px;
      width: auto;
    }
  }

  .next {
    width: 205px;
    //margin: auto;
    height: 46px;
    background: rgba(255, 170, 83);
    opacity: 1;
    border-radius: 25px;
    color: #ffffff;
    border: none;
  }
  .tips{
    font-weight: 400;
    font-size: 12px;
    margin-top: 12px;
    text-align: center;
    color: #B0B0B0;
    padding-bottom: 20px;
  }

  .teacher-info {
    display: block;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    margin-top: 30px;
    color: #ffffff;
  }
  .top {
    .age {
      width: 60px;
      height: 20px;
      text-align: center;
      background: rgba(242, 242, 242);
      opacity: 1;
      border-radius: 4px;
      font-size: 10px;
    }
    .sign {
      position: absolute;
      right: 9px;
      top: 7px;
      img {
        width: 64px;
        height: 64px;
      }
    }
    .yuan1 {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgba(105, 118, 134);
      left: -12.5px;
      top: 85px;
      z-index: 1;
    }
    .yuan2 {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgba(105, 118, 134);
      right: -12.5px;
      top: 85px;
      z-index: 1;
    }
    .top-icon {
      width: 100%;
      text-align: center;
      img {
        background: #ffffff;
        border-radius: 50%;
        border: 3px solid #ffffff;
        width: 53px;
        height: 53px;
        margin-top: -30px;
      }
    }
    .top-info {
      width: 340px;
      margin: auto;
      margin-top: 60px;
      background: rgba(255, 255, 255);
      border-radius: 9px 9px 9px 9px;
      position: relative;
      .img-arrow {
        width: 14px;
        height: 14px;
        margin-right: 3px;
      }
      .class-info {
        display: block;
        text-align: center;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #1c1c1c;
      }
      p {
        display: block;
        text-align: center;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 25px;
        color: #b0b0b0;
      }
      .line {
        width: 100%;
        height: 20px;
        top: 95px;
        position: absolute;
        background-image: linear-gradient(
          to right,
          #ccc 0%,
          #ccc 50%,
          transparent 50%
        );
        background-size: 10px 1px;
        background-repeat: repeat-x;
      }
      .van-cell {
        height: 40px;
        margin-top: 5px;

        /deep/.van-cell__title {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 46px;
          color: #1c1c1c;
          opacity: 1;
          margin-top: -10px;
          display: block;
        }
        /deep/.van-field__control {
          font-size: 14px;
          font-weight: 400;
          // color: #c1c1c1;
          opacity: 1;
        }
      }
    }
  }
}
</style>
