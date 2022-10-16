<template>
  <div
    class="home"
    :style="{background:themeInfo.background}"
  >
    <div>
      <div v-if="schoolInfo.id">
        <div>
          <homePage
            :school="schoolInfo"
            :theme="themeInfo"
          ></homePage>
        </div>
        <div>
          <about
            :school="schoolInfo"
            :theme="themeInfo"
            @show="centerDialogVisible = !centerDialogVisible"
          ></about>
        </div>
        <div v-if="schoolInfo.teacherRemark.length">
          <teacher
            :school="schoolInfo"
            :theme="themeInfo"
          ></teacher>
        </div>
        <div v-if="schoolInfo.parentComments.length">
          <parents
            :school="schoolInfo"
            :theme="themeInfo"
          ></parents>
        </div>
        <div v-if="schoolInfo.stuWork.length">
          <work
            :school="schoolInfo"
            :theme="themeInfo"
          ></work>
        </div>
        <div>
          <info
            :school="schoolInfo"
            :theme="themeInfo"
          ></info>
        </div>
        <div>
          <invited
            :school="schoolInfo"
            :theme="themeInfo"
          ></invited>
        </div>
      </div>
      <van-popup
        v-model="centerDialogVisible"
        :style="{ height: '70%' }"
      >
        <div class="header-show">
          <p>关于我们</p>
          <span>{{ schoolInfo.schoolRemark }}</span>
        </div>
      </van-popup>
    </div>

  </div>

</template>

<script>
import HomePage from "../components/schoolHome.vue";
import about from "../components/schoolAbout.vue";
import teacher from "../components/schoolTeacher.vue";
import parents from "../components/schoolParents.vue";
import work from "../components/schoolDemo.vue";
import info from "../components/schoolInfo.vue";
import invited from "../components/schoolInvited.vue";
import axios from "axios";

export default {
  components: {
    HomePage,
    about,
    teacher,
    parents,
    work,
    info,
    invited,
  },
  data() {
    return {
      SCREEN_HEIGHT: 0,
      isShow: false,
      centerDialogVisible: false,
      type: 1,
      school: "",
      id: "",
      schoolInfo: {},
      themeInfo: {}
    };
  },
  created() {
    this.school = this.UrlParamHash('schoolId');
    this.id = this.UrlParamHash('id') || '';
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
    this.getSchool();
  },
  mounted() {
  },
  methods: {
    UrlParamHash(queryName) {
      let query = decodeURI(window.location.search.substring(1))//将url转码
      let vars = query.split("&");//分割字符串，将url切割成数组形式的对象
      for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }//如果匹配输出结果
      }
      return null;
    },
    getSchool() {
      this.schoolInfo = {}
      if (this.school) {
        axios
          .get(
            `${process.env["VUE_APP_BASE_API"]}/schools/unAccess/admissions/queryDetail?id=${this.id}&schoolId=${this.school}`
          )
          .then((res) => {
            console.log(res.data.id)
            if (res.data.code === 0) {
              this.schoolInfo = { ...res.data.data };
              console.log(this.schoolInfo, '99999999999999')
              this.getTheme()
            } else {
              // this.$router.push("/");
              this.$message.warning("信息错误!");
            }
          });
      } else {
        // this.$router.push("/");
        this.$message.warning("学校信息错误!");
      }
    },
    getTheme() {
      if (this.schoolInfo) {
        axios
          .get(
            `${process.env["VUE_APP_BASE_API"]}/schools/api/schoolTemp/unAccess/queryOne/${this.schoolInfo.themeId}`
          )
          .then((res) => {
            if (res.data.code === 0) {
              this.themeInfo = { ...res.data.data };
            } else {
              this.$message.warning("信息错误!");
            }
          });
      }
    }
  },
  computed: {},
};
</script>

<style  lang="less" scoped>
.home {
  // background: url("../assets/school/background.png") no-repeat;
  // width: 100%;
  background-size: 100% 100%;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/school/background.png',sizingMethod='scale');
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  text-align: center;
  // top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.home /deep/ .el-dialog {
  border-radius: 20px;
  max-height: 500px;
  overflow: scroll;
}
.home /deep/ .el-dialog__header {
  padding-top: 0px;
}
.head-show {
  display: block;
  width: 100%;
  p {
    font-size: 18px;
    font-weight: 600;
    color: #1c1c1c;
    letter-spacing: 2px;
  }
  span {
    display: block;
    margin-top: 10px;
    color: #1c1c1c;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: 1px;
  }
}
</style>
