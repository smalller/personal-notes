<template>
  <div id="container">
    <Header />
    <div
      class="plan-info"
      v-if="planInfo"
    >
      <div class="bg">
        <img
          :src="require('@/assets/recruitStudentsPlan/bg.png')"
          alt=""
        >
      </div>
      <div class="basic-info">
        <span class="school-name">{{planInfo.schoolName}}</span>
        <div class="img-box">
          <img
            :src="planInfo.pic || require('@/assets/recruitStudentsPlan/bg.png')"
            alt=""
          >
        </div>
        <span :class="[
                      'plan-status',
                      getLiveStatusBg(+planInfo.publishStatus),
                    ]">{{ getLiveStatusStr(+planInfo.publishStatus) }}</span>
        <span class="plan-name">{{planInfo.name}}</span>
        <span class="end-date">报名截止日期：{{dayjs(planInfo.endTime).format('YYYY-MM-DD')}}</span>
      </div>
      <div class="plan-brief">
        <p class="title">简介</p>
        <div class="botm-content">
          <div
            class="text"
            :class="[isOver ? 'is-over' : 'show-more']"
            ref="botmContent"
            @click="isOver = false"
          >
            {{planInfo.introduction}}
          </div>
          <div
            class="show-more-btn"
            v-if="isOver"
            @click="isOver = false"
          >
            展开
          </div>
        </div>
      </div>
    </div>
    <div class="course-list">
      <p class="title">招生课程</p>
      <ul>
        <li
          v-for="item in courseList"
          :key="item.id"
          @click="handleToDetail(item.courseId,item.id)"
        >
          <div class="li-item">
            <div class="img-box">
              <img
                :src="item.pic || require('@/assets/recruitStudentsPlan/bg.png')"
                alt=""
              >
            </div>
            <div class="right-info">
              <p class="course-name">{{item.courseName}}</p>
              <p class="start-date">{{item.content}}</p>
              <p class="course-detail">
                <span class="name">{{item.teacherName}}</span>
                <span class="course-num">课节 {{item.sectionNums}}</span>
              </p>
              <div class="course-money">
                <p class="money">
                  学费：
                  <span>{{item.price}}</span>
                </p>
                <button
                  v-if="!isTeacher"
                  :class="['btn',applyList.includes(item.id) ?'apply':'not-apply']"
                >{{applyList.includes(item.id) ? '已报名' : '报名'}}</button>
              </div>
            </div>
          </div>

        </li>
      </ul>
    </div>
    <Footer v-if="isTouchBotom" />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from './components/Header.vue'
import { mapGetters, mapActions } from 'vuex'
import { getLiveStatusStr, getLiveStatusBg } from "./index.js";
import dayjs from 'dayjs'


export default {
  components: {
    Footer,
    Header
  },
  data() {
    return {
      isOver: false,
      isTouchBotom: false,
      //   schoolId: ''
      planId: '',
      planInfo: null,
      getLiveStatusStr,
      getLiveStatusBg,
      dayjs,
      pageNo: 1,
      pageSize: 10,
      courseList: [],
      allPage: 0,
      applyList: [], // 当前学生已经报了名的课程列表
      isTeacher: false
    }
  },
  computed: {
    ...mapGetters(['userId', 'token', 'schoolId', 'studentInfo'])
  },
  methods: {
    ...mapActions(['setSchoolId']),

    // 跳转到详情页面
    handleToDetail(courseId, id) {
      this.$router.push(`/planDetail?courseId=${courseId}&planId=${this.planId}&id=${id}&isTeacher=${this.isTeacher}`)
    },

    // 如果用户未登录，就去登录
    ifNotLogin(planName) {
      if (!this.userId || !this.token) {
        this.$bus.$emit('wechatLogin', {
          title: planName,
          isSelectStudent: 1,
          isSelectTeacher: 1,
        })
        return
      }
    },

    // 简介超出隐藏
    hideBrief() {
      this.$nextTick(() => {
        if (this.$refs.botmContent.clientHeight > 88) {
          this.isOver = true;
        }
      })
    },

    // 获取计划详情
    getPlanDetail() {
      this.$request(`/mamserver/api/admissionPlan/unAccess/queryOne/${this.planId}`).then(res => {
        if (+res.code === 0) {
          this.planInfo = res.data
          this.ifNotLogin(res.data.name)
          this.hideBrief()
          this.getCourseList()
          this.judgeIdentity()
        }
      })
    },

    // 判断身份
    judgeIdentity() {
      const isTeacher = sessionStorage.getItem('isTeacher')
      if (isTeacher) {
        if (+isTeacher === 1) {
          this.isTeacher = true
        }
      }
    },

    // 获取当前计划下的课程
    getCourseList() {
      this.$request(`/mamserver/api/admissionPlan/unAccess/queryCourses/${this.planId}`, {
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        },
      }).then(res => {
        if (+res.code === 0) {
          this.courseList = this.courseList.concat(res.data.list);
          this.allPage = res.data.page.totalPage;
          this.getApplyStatus()
        }
      })
    },

    // 获取当前学生在当前课程中是否报了名
    getApplyStatus() {
      this.$request(`/schools/api/courseSign/querySign8Id/${this.studentInfo.studentId}/${this.planId}`).then(res => {
        if (+res.code === 0) {
          this.applyList = res.data.map(item => item.pid)
        }
      })
    }
  },

  created() {
    const { shareId, schoolId } = this.$route.query
    sessionStorage.setItem('planShareId', shareId)
    this.planId = shareId
    this.setSchoolId(schoolId)
    this.getPlanDetail()
  },

  mounted() {
    window.onscroll = () => {
      this.$nextTick(() => {
        const clientHeight = document.documentElement.clientHeight;// 网页可视区域高度
        const scrollTop = document.documentElement.scrollTop; // 滚动条垂直位置
        const offsetHeight = document.documentElement.offsetHeight;   // 网页高度

        if (clientHeight + scrollTop >= offsetHeight && !this.isTouchBotom) {
          if (this.pageNo < this.allPage) {
            this.pageNo++;
            this.getCourseList();
            console.log("触底了");
          } else {
            this.isTouchBotom = true
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.plan-info {
  padding: 16px 16px 36px 16px;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);

  .bg {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      min-width: 100%;
      min-height: 100%;
      filter: blur(50px);
    }
  }

  .basic-info {
    position: relative;
    z-index: 2;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;

    .school-name {
      color: #fff;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .img-box {
      width: 280px;
      height: 158px;
      margin-bottom: 24px;

      > img {
        width: 100%;
        height: 100%;
        border-radius: 12px;

        object-fit: cover;
      }
    }

    .plan-status {
      padding: 3px 9px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16px;
    }

    .blue-bg {
      background-color: #4fa8f9;
    }
    .yellow-bg {
      background-color: #ff9900;
    }

    .plan-name {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 6px;
    }

    .end-date {
      font-size: 13px;
      color: #fff;
      margin-bottom: 24px;
    }
  }

  .plan-brief {
    position: relative;
    z-index: 2;
    color: #fff;

    .title {
      font-size: 18px;
      margin-bottom: 11px;
    }

    .botm-content {
      font-size: 15px;

      .text {
        line-height: 22px;
        margin-bottom: 6px;
      }

      .show-more-btn {
        color: #fff;
        font-size: 15px;
      }

      .is-over {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;

        &.show-more {
          -webkit-line-clamp: 999;
        }
      }
    }
  }
}

.course-list {
  position: relative;
  left: 0;
  top: -12px;
  z-index: 3;
  background-color: #fff;
  //   padding: 16px 16px 0 16px;
  padding-top: 16px;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;

  .title {
    font-size: 18px;
    font-weight: bold;
    color: #222222;
    margin-bottom: 4px;
    padding: 0 16px;
  }

  > ul {
    * {
      user-select: none;
    }
    > li {
      padding: 12px 16px 0 12px;
      border-bottom: 1px solid transparent;

      &:active {
        background-color: #d9d9d9;
      }

      .li-item {
        display: flex;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px solid #f2f2f2;
      }

      .img-box {
        width: 140px;
        height: 94px;
        margin-right: 12px;

        > img {
          width: 140px;
          height: 94px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
      }

      .right-info {
        flex-grow: 1;

        .course-name {
          font-size: 16px;
          font-weight: 500;
          color: #222222;
          margin-bottom: 4px;
        }

        .start-date {
          font-size: 12px;
          color: #989898;
          margin-bottom: 4px;
        }

        .course-detail {
          font-size: 12px;
          color: #989898;
          margin-bottom: 2px;

          .name {
            margin-right: 10px;
          }
        }

        .course-money {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .money {
            font-size: 12px;
            color: #ff9f3d;
            font-weight: 500;

            > span {
              font-size: 16px;
            }
          }

          .btn {
            width: 64px;
            height: 28px;
            border-radius: 16px;
            font-size: 14px;
            border: none;
          }

          .apply {
            background: #e6faff;
            color: #00a1f3;

            &:active {
              background: #b9eaf5;
            }
          }

          .not-apply {
            color: #ffffff;
            background: #ff9f3d;

            &:active {
              background: #f08316;
            }
          }
        }
      }
    }
  }
}
</style>