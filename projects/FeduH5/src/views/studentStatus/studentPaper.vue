<template>
  <div class="student-info">
    <my-head title="学籍详情"  @leftClick="backClick">
      <template #right>
        <div class="headBtn" @click="editClick">编辑</div>
      </template>
    </my-head>
    <div class="student-title">
      <!-- <img src=".././assets/student/title.png"> -->
      <div class="title-info">
        <span>学籍信息</span>
        <p>仅用于幼儿园建立幼儿学籍档案</p>
      </div>
    </div>
    <el-card class="student">
      <div class="title-name">
        <div class="student-box"></div>
        <span>基本信息</span>
      </div>
      <div>
        <div class="student-img">
          <img :src="imgUrl" />
          <span>{{formData.studentName}}</span>
          <p>{{formData.pinyin}}</p>
          <div class="student-name">
            <div class="sex">
              <img v-if="formData.stuSex === '女'" src="../../assets/student/girls.png">
              <img v-else src="../../assets/student/boy.png">
              <span>{{formData.stuSex}}</span>
            </div>
            <p>{{formData.birthTime}}</p>
            <div class="over" v-show="age>7">
              <span>超过七岁</span>
            </div>
          </div>
        </div>
        <div class="student-data">
          <ul>
            <li>
              <span>血型</span>
              <p>{{formData.bloodType}}</p>
            </li>
            <li>
              <span>身份证件类型</span>
              <p>{{formData.stuCertType}}</p>
            </li>
            <li>
              <span>证件号码</span>
              <p>{{formData.stuCertNo}}</p>
            </li>
            <li>
              <span>班级</span>
              <p>{{formData.clazzName}}</p>
            </li>
            <li>
              <span>入园日期</span>
              <p>{{formData.admissionTime}}</p>
            </li>
          </ul>
        </div>
        <div class="title-name">
          <div class="student-box"></div>
          <span>户籍信息</span>
        </div>
        <div class="student-data">
          <ul>
            <li>
              <span>国籍</span>
              <p>{{formData.huKouInfoPos.nationality}}</p>
            </li>
            <li>
              <span>民族</span>
              <p>{{formData.huKouInfoPos.nation}}</p>
            </li>
            <li>
              <span>港澳台侨外</span>
              <p>{{formData.huKouInfoPos.overSeas}}</p>
            </li>
            <li>
              <span>出生所在地</span>
              <p>{{formData.huKouInfoPos.birthPlace}}</p>
            </li>
            <li>
              <span>籍贯</span>
              <p>{{formData.huKouInfoPos.nativePlace}}</p>
            </li>
            <li>
              <span>户口性质</span>
              <p>{{formData.huKouInfoPos.huKouNature}}</p>
            </li>
            <li>
              <span>非农业户口类型</span>
              <p>{{formData.huKouInfoPos.huKouType}}</p>
            </li>
            <li>
              <span>户口所在地</span>
              <p>{{formData.huKouInfoPos.huKouLocation}}</p>
            </li>
            <li>
              <span>现住址</span>
              <p>{{formData.huKouInfoPos.actualAddress}}</p>
            </li>
            <li>
              <span>现详细住址</span>
              <p>{{formData.huKouInfoPos.actualDetailAddress}}</p>
            </li>
          </ul>
        </div>
        <div class="title-name">
          <div class="student-box"></div>
          <span>家庭信息</span>
        </div>
        <div class="student-data">
          <ul>
            <li>
              <span>就读方式</span>
              <p>{{formData.familyInfoPos.studyMode}}</p>
            </li>
            <li>
              <span>是否独生子女</span>
              <p>{{formData.familyInfoPos.isOnlyChild}}</p>
            </li>
            <li>
              <span>是否留守儿童</span>
              <p>{{formData.familyInfoPos.isLeftBehindChild}}</p>
            </li>
            <li>
              <span>是否进城务工人员子女</span>
              <p>{{formData.familyInfoPos.isPeasantWorker}}</p>
            </li>
            <li>
              <span>健康状况</span>
              <p>{{formData.familyInfoPos.healthStatus}}</p>
            </li>
            <li>
              <span>是否残疾幼儿</span>
              <p>{{formData.familyInfoPos.isDisabledChild}}</p>
            </li>
            <li>
              <span>残疾幼儿类别</span>
              <p>{{formData.familyInfoPos.disabilityLevel}}</p>
            </li>
            <li>
              <span>是否孤儿</span>
              <p>{{formData.familyInfoPos.isOrphan}}</p>
            </li>
          </ul>
        </div>
        <div class="title-name">
          <div class="student-box"></div>
          <span>第一监护人</span>
        </div>
        <div class="student-data">
          <ul>
            <li>
              <span>姓名</span>
              <p>{{formData.stuGuardian.name}}</p>
            </li>
            <li>
              <span>民族</span>
              <p>{{formData.stuGuardian.nation}}</p>
            </li>
            <li>
              <span>与幼儿关系</span>
              <p>{{formData.stuGuardian.familyRels}}</p>
            </li>
            <li>
              <span>身份证件类型</span>
              <p>{{formData.stuGuardian.cerType}}</p>
            </li>
            <li>
              <span>证件号码</span>
              <p>{{formData.stuGuardian.certNo}}</p>
            </li>
            <li>
              <span>工作单位</span>
              <p>{{formData.stuGuardian.workUnit}}</p>
            </li>
            <li>
              <span>联系电话</span>
              <p>{{formData.stuGuardian.mobile}}</p>
            </li>
          </ul>
        </div>
        <div
          class="title-name"
          v-if="formData.stuGuardian2.name"
        >
          <div class="student-box"></div>
          <span>第二监护人</span>
        </div>
        <div
          class="student-data"
          v-if="formData.stuGuardian2.name"
        >
          <ul>
            <li>
              <span>姓名</span>
              <p>{{formData.stuGuardian2.name}}</p>
            </li>
            <li>
              <span>民族</span>
              <p>{{formData.stuGuardian2.nation}}</p>
            </li>
            <li>
              <span>与幼儿关系</span>
              <p>{{formData.stuGuardian2.familyRels}}</p>
            </li>
            <li>
              <span>身份证件类型</span>
              <p>{{formData.stuGuardian2.cerType}}</p>
            </li>
            <li>
              <span>证件号码</span>
              <p>{{formData.stuGuardian2.certNo}}</p>
            </li>
            <li>
              <span>工作单位</span>
              <p>{{formData.stuGuardian2.workUnit}}</p>
            </li>
            <li>
              <span>联系电话</span>
              <p>{{formData.stuGuardian2.mobile}}</p>
            </li>
          </ul>
        </div>
      </div>
    </el-card>

  </div>

</template>

<script>

import {mapGetters} from 'vuex'
import dayjs from 'dayjs'
import MyHead from "@/views/userCamera/component/head";

export default {
  components: {
    MyHead

  },
  data() {
    return {
      imgUrl: '',
      formData: {
        "admissionTime": "",
        "birthTime": "",
        "bloodType": "",
        "clazzId": "",
        "clazzName": "",
        "createInfo": "",
        "createTime": "",
        "createUser": "",
        "description": "",
        "enableStatus": 0,
        "familyInfoPos": {
          "disabilityLevel": "",
          "healthStatus": "",
          "isDisabledChild": "",
          "isLeftBehindChild": "",
          "isOnlyChild": "",
          "isOrphan": "",
          "isPeasantWorker": "",
          "studyMode": ""
        },
        "headerImg": "",
        "huKouInfoPos": {
          "actualAddress": "",
          "actualDetailAddress": "",
          "birthPlace": "",
          "huKouLocation": "",
          "huKouNature": "",
          "huKouType": "",
          "nation": "",
          "nationality": "",
          "nativePlace": "",
          "overSeas": ""
        },
        "id": "",
        "pinyin": "",
        "remark": "",
        "schoolId": "",
        "stuCertNo": "",
        "stuCertType": "",
        "stuGuardian": {
          "cerType": "",
          "certNo": "",
          "duties": "",
          "education": "",
          "familyRels": "",
          "mobile": "",
          "name": "",
          "nation": "",
          "workPhone": "",
          "workUnit": "",
          "worlAddress": ""
        },
        "stuGuardian2": {
          "cerType": "",
          "certNo": "",
          "duties": "",
          "education": "",
          "familyRels": "",
          "mobile": "",
          "name": "",
          "nation": "",
          "workPhone": "",
          "workUnit": "",
          "worlAddress": ""
        },
        "stuSex": "",
        "studentId": "",
        "studentName": "",
        "updateInfo": "",
        "updateTime": "",
        "updateUser": "",
        "version": 0

      },
      imgBoy: require('../../assets/student/boy.png'),
      imgGirl: require('../../assets/student/girl.png'),
      username: "查看详情",
      age: 0
    };
  },
  created() {
    this.getDetails()
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['studentInfo'])
  },
  methods: {
    backClick() {
      if(micell.ua.isWeChat()){
        document.addEventListener('WeixinJSBridgeReady', function(){ WeixinJSBridge.call('closeWindow'); }, false);

        WeixinJSBridge.call('closeWindow');
      }

      if (micell.ua.isAndroid()) {
        window.WebViewJavascriptBridge.closeWindow()
      } else {
        window.webkit.messageHandlers.closeWindow.postMessage("closeWindow")
      }
    },
    editClick() {
      this.$router.push({
        path: '/studentFile',
        query: {
          isEdit: 1
        }
      })
    },
    getDetails() {
      this.$request(`/schools/api/schoolRoll/queryByStu/${this.studentInfo.studentId}`, {
        method: 'GET',
      }).then(response => {
        if(+response.code === 0) {
          this.formData = response.data
          const date = dayjs()
          this.age = date.diff(this.formData.birthTime, 'year')
          this.imgUrl = response.data.headerImg
        }
      })
    },

  },
};
</script>

<style  lang="less" scoped>
.student-info {
  background: #ff9f3d;
  padding-bottom: 30px;
  .student-title {
    width: 100%;
    height: 110px;
    background: url("../../assets/student/title.png") no-repeat center;
    background-size: 100% 100%;
    .title-info {
      padding: 25px;
      width: 100%;
      span {
        font-size: 27px;
        font-weight: bold;
        color: #ffffff;
        line-height: 35px;
      }
      p {
        font-size: 15px;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
  .student {
    width: 95%;
    min-height: 60vh;
    margin: auto;
    border-radius: 10px;
    .title-name {
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      height: 25px;
      .student-box {
        width: 3px;
        height: 16px;
        background: #ff9f3d;
        border-radius: 4px;
      }
      span {
        display: block;
        font-size: 16px;
        font-weight: bold;
        line-height: 0px;
        color: #1c1c1c;
        margin-left: 5px;
        margin-top: 10px;
      }
    }

    .student-img {
      width: 100%;
      text-align: center;
      img {
        display: block;
        width: 146px;
        height: 180px;
        border: 1px solid rgba(255, 159, 61, 0.4);
        opacity: 1;
        border-radius: 4px;
        margin: auto;
        margin-top: 10px;
      }
      span {
        display: block;
        margin-top: 20px;
        font-size: 20px;
        font-weight: bold;
        color: #1c1c1c;
      }
      p {
        font-size: 14px;
        font-weight: 400;
        color: #8a8a8e;
      }
      .student-name {
        width: 220px;
        margin-top: 10px;
        display: inline-flex;
        .sex {
          display: flex;
          margin: auto;
          img {
            width: 20px;
            height: 20px;
            border: none;
          }
          span {
            font-size: 16px;
            font-weight: 400;
            display: block;
            color: #1c1c1c;
            margin-left: 10px;
            margin-top: 10px;
          }
        }
        p {
          width: 150px;
          display: block;
          font-size: 16px;
          font-weight: 400;
          color: #1c1c1c;
          margin-top: 15px;
        }
        .over {
          width: 55px;
          height: 20px;
          border: 1px solid #ff9f3d;
          opacity: 1;
          border-radius: 2px;
          margin-top: 10px;
          margin-left: -20px;
          span {
            display: inline;
            font-size: 12px;
            font-weight: 400;
            color: #ff9f3d;
          }
        }
      }
    }
    .student-data {
      margin-top: 15px;
      margin-bottom: 20px;
      ul {
        margin-top: 10px;
      }
      li {
        width: 100%;
        display: flex;
      }
      span {
        min-width: 48%;
        font-size: 14px;
        font-weight: 400;
        line-height: 30px;
        color: #8a8a8e;
      }
      p {
        width: 75%;
        text-align: right;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 30px;
        color: #1c1c1c;
      }
    }
    .save-btn {
      border: none;
      width: 170px;
      height: 40px;
      margin: auto;
      background: #fff3e7;
      border-radius: 55px;
      span {
        width: 100%;
        color: #ff9f3d;
      }
    }
    .form {
      margin-top: 50px;
    }

    .van-cell {
      height: 60px;
      margin-top: 5px;
      /deep/.van-cell__title {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 46px;
        color: #25262b;
        opacity: 1;
        margin-top: -10px;
        display: block;
      }
      /deep/.van-field__control {
        font-size: 14px;
        font-weight: 400;
        color: #c1c1c1;
        opacity: 1;
      }
    }
  }
  .notice {
    height: 25vh;
    span {
      display: block;
      margin: 5px;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      line-height: 46px;
      color: #c1c1c1;
      opacity: 1;
    }
  }
}
</style>
