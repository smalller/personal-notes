<template>
  <div class="student-info">
    <my-head title="学籍详情" @leftClick="backClick"></my-head>
    <el-card class="student">
      <div>
        <div class="student-img">
          <img src="../../assets/student/submit.png">
          <span>提交成功</span>
        </div>
        <div class="student-data">
          <ul>
            <li>
              <span>姓名</span>
              <p>{{formData.studentName}}</p>
            </li>
            <li>
              <span>姓名拼音</span>
              <p>{{formData.pinyin}}</p>
            </li>
            <li>
              <span>性别</span>
              <p>{{formData.stuSex}}</p>
            </li>
            <li>
              <span>出生年月</span>
              <p>{{formData.birthTime}}</p>
            </li>
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

          <div style="margin: 16px">
            <van-button
              round
              block
              class="save-btn"
              native-type="submit"
              @click="readDetails"
            ><span>学籍详情</span></van-button>
          </div>
        </div>
      </div>
    </el-card>

  </div>

</template>

<script>

import {mapGetters} from 'vuex'
import MyHead from "@/views/userCamera/component/head";

export default {
  components: {
    MyHead

  },
  data() {
    return {
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
      username: "查看详情"
    };
  },
  created() {
    this.query()
  },
  mounted() {
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
    UrlParamHash(queryName) {
      let query = decodeURI(window.location.search.substring(1))//将url转码
      let vars = query.split("&");//分割字符串，将url切割成数组形式的对象
      for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }//如果匹配输出结果
      }
      return null;
    },
    query(){
      this.$request(`/schools/api/schoolRoll/queryByStu/${this.studentInfo.studentId}`, {
        method: 'GET',
      }).then(response => {
        if(+response.code === 0) {
          this.formData = response.data
        }
      })
    },
    readDetails(){
      this.$router.push({
        name: 'studentPaper',
        query: {
          studentId: this.$route.query.studentId
        }
      })
    }

  },
  computed: {
    ...mapGetters(['studentInfo'])
  },
};
</script>

<style  lang="less" scoped>
.student-info {
  background: #ff9f3d;
  height: 100vh;
  .student {

    width: 95%;
    min-height: 60vh;
    margin: auto;
    margin-top: 15px;
    border-radius: 10px;
    .student-img {
      width: 100%;
      text-align: center;
      img {
        display: block;
        width: 175px;
        height: 110px;
        margin: auto;
        margin-top: 35px;
      }
      span {
        display: block;
        margin-top: 18px;
        font-size: 20px;
        font-weight: bold;
        color: #1c1c1c;
      }
    }
    .student-data {
      margin-top: 30px;
      border-top: 1px solid #f0f0f0;
      ul {
        margin-top: 10px;
      }
      li {
        width: 100%;
        display: flex;
      }
      span {
        width: 35%;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 30px;
        color: #8a8a8e;
      }
      p {
        width: 75%;
        text-align: right;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
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
