<template>
  <div class="selectStudent">
    <div class="selectStudentHead">
      <div class="schoolInfo">
        <img
          :src="schoolInfo.logoUrl"
          alt=""
          class="schoolLogo"
        >
        <span>{{ schoolInfo.name }}</span>
      </div>
      <div class="selectTitle">{{ title }}</div>
    </div>
    <div
      v-show="isSelectTeacher"
      class="studentBox"
    >
      <div class="title">选择身份</div>
      <div class="teacherList">
        <div
          class="teacherItem"
          @click="teacherSelect('parent')"
        >
          <img
            src="./assets/image/parent.png"
            alt=""
          >
          <span>家长身份</span>
        </div>
        <div
          class="teacherItem"
          @click="teacherSelect('teacher')"
        >
          <img
            src="./assets/image/teacher.png"
            alt=""
          >
          <span>老师身份</span>
        </div>
      </div>
    </div>
    <div
      v-show="!isSelectTeacher"
      class="studentBox"
    >
      <div class="title">选择宝宝</div>
      <div
        class="studentLists"
        v-if="studentList.length>0"
      >
        <div
          class="studentItem"
          v-for="item in studentList"
          @click="selectStudent(item)"
          :key="item.id"
        >
          <div class="studentPic">
            <img
              :src="item.headerImg"
              alt=""
            >
          </div>
          <div class="studentInfo">
            <div class="studentName">{{ item.studentName }}</div>
            <div class="studentClassInfo">
              <span>{{ item.schoolName }}</span>
              <!--              -<span>大二班(雏鹰班)</span>-->
            </div>
          </div>
        </div>
      </div>
      <div
        class="noStudent"
        v-else
      >
        <img
          src="./assets/image/error.png"
          alt=""
        >
        <p>当前账号还未绑定宝宝</p>
        <span>请联系老师绑定宝宝</span>
      </div>
    </div>
    <div class="selectStudentFooter">
      <img
        src="./assets/image/logo.png"
        alt=""
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import qs from "qs";

export default {
  name: "selectStudent",
  data() {
    return {
      title: sessionStorage.getItem('loginTitle'),
      studentList: [ ],
      isSelectTeacher: +sessionStorage.getItem('isSelectTeacher')
    }
  },
  computed: {
    ...mapGetters(['userId', 'token', 'schoolId', 'schoolInfo'])
  },
  methods: {
    ...mapActions(['setStudentInfo']),
    async selectStudent(student) {
      if (student.schoolId === this.schoolInfo.id) {
        await this.setStudentInfo(student)
        this.jump()
      } else {
        vant.Toast('只能选择当前学校的幼儿')
      }

    },
    queryStudentList() {
      this.$request('/schools/api/stuFamily/getFamiliesByUserId', {
        method: 'get',
      }).then(res => {
        if (+res.code === 0) {
          this.studentList = res.data.filter(item => item.schoolId === this.schoolId)
          if (this.studentList.length === 1) {
            if (!this.isSelectTeacher) {
              this.selectStudent(this.studentList[0])
            }
          }
        }
      })
    },
    teacherSelect(type) {
      sessionStorage.setItem('isTeacher', type === 'teacher' ? '1' : '0')
      if (type === 'teacher') {
        this.jump()
      } else {
        this.queryStudentList()
        this.isSelectTeacher = false
      }
    },
    jump() {
      const path = sessionStorage.getItem('routerPath')
      const query = JSON.parse(sessionStorage.getItem('routerQuery'))
      location.href = location.origin + path + '?' + qs.stringify(query)
    }
  },
  created() {
    // this.queryStudentList()
    if (sessionStorage.getItem('isSelectTeacher')) {
      this.isSelectTeacher = !!+sessionStorage.getItem('isSelectTeacher');
      if(!this.isSelectTeacher) {
        console.log('1233')
        this.queryStudentList()
      }
    }
  }
}
</script>

<style scoped lang="less">
.selectStudent {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #607692;
  display: flex;
  flex-direction: column;

  * {
    box-sizing: border-box;
  }

  .schoolLogoMax {
    position: absolute;
    right: 10px;
    top: 20px;
    opacity: 0.1;
    width: 124px;
    height: 124px;
  }

  .selectStudentHead {
    padding-top: 20px;
    padding-left: 16px;

    .schoolInfo {
      display: flex;
      align-items: center;

      img {
        width: 26px;
        height: 26px;
        margin-right: 7px;
        border-radius: 50%;
      }

      span {
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
      }
    }

    .selectTitle {
      margin-top: 16px;
      margin-bottom: 20px;
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }
  }

  .studentBox {
    background: #ffffff;
    //height: 84vh;
    flex: 1;
    margin: 0 10px;
    border-radius: 12px;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    .title {
      font-weight: bold;
      line-height: 12px;
      color: #000000;
      padding-top: 20px;
      padding-bottom: 16px;
      text-align: center;
    }

    .studentLists {
      flex: 1;
      overflow: auto;
      padding-bottom: 12px;
      display: flex;
      flex-direction: column;
      .studentItem {
        display: flex;
        border-radius: 30px;
        padding: 8px;
        background: #f5f5f5;
        height: 70px;
        margin-bottom: 12px;

        .studentPic {
          width: 54px;
          height: 54px;
          margin-right: 12px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .studentInfo {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .studentName {
            font-weight: 500;
            color: #333333;
            font-size: 18px;
          }

          .studentClassInfo {
            font-size: 12px;
            color: #666666;
          }
        }
      }
    }

    .noStudent {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 160px;
        height: 130px;
      }

      p {
        margin-top: 24px;
        color: #333333;
        font-size: 18px;
      }

      span {
        margin-top: 6px;
        font-size: 16px;
        color: #6a6a6a;
      }
    }

    .teacherList {
      .teacherItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 175px;
        background: #fdf3e6;
        border-radius: 16px;
        margin-bottom: 12px;

        img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
        }

        span {
          margin-top: 12px;
          font-size: 18px;
          font-weight: bold;
          color: #ff9f3d;
        }

        &:nth-child(2) {
          background: #f1f1fb;

          span {
            color: #3b7af7;
          }
        }
      }
    }
  }

  .selectStudentFooter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 78px;

    img {
      height: 27px;
    }
  }
}
</style>
