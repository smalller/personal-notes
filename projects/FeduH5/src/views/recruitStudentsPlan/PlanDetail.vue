<template>
  <div>
    <div
      class="plan-detail-box"
      :class="{filter: showVideo}"
      v-if="courseInfo"
    >
      <Header>
        <img
          v-if="shareId"
          class="back-btn"
          :src="require('@/assets/recruitStudentsPlan/back.png')"
          alt=""
          @click="handleBack"
        >
      </Header>
      <div class="top-img">
        <img
          :src="courseInfo.pic || require('@/assets/recruitStudentsPlan/bg.png')"
          alt=""
        >
      </div>
      <div class="content-box">
        <p class="title">{{courseInfo.courseName}}</p>
        <div class="tuition">
          <p class="money">
            学费：
            <span>{{courseInfo.coursePrice}}</span>
          </p>
          <p
            class="over-time"
            v-if="isOverApplyDate(courseInfo.endTime)"
          >报名已结束</p>
          <p
            class="end-date"
            v-else
          >距报名结束剩{{dayjs(courseInfo.endTime).diff(dayjs(),'day')}}天</p>
        </div>
        <div class="course-info">
          <div class="teacher-info">
            <span>张潇老师</span>
          </div>
          <p class="start-date">开课时间：{{courseInfo.clazzTime}}</p>
        </div>
        <div class="course-brief">
          <p class="title">课程简介</p>
          <div
            class="content"
            v-html="courseInfo.content"
          >
          </div>
        </div>
        <div class="course-section">
          <p class="title">课程章节</p>
          <ul v-if="courseInfo.courseSectionBoList.length > 0">
            <li
              v-for="item in courseInfo.courseSectionBoList"
              :key="item.id"
            >
              <div class="section-name">
                {{item.sectionName}}
              </div>
              <div class="right-info">
                <span
                  class="preview"
                  @click="handlePreview(item.videoPath)"
                >预览</span>
                <span class="duration">{{item.videoDuration}}</span>
              </div>
            </li>
          </ul>
          <span v-else>暂无课程章节</span>
        </div>
        <Footer />
      </div>
      <div
        class="footer-btn"
        v-if="!isTeacher"
      >
        <button
          v-if="isOverApplyDate(courseInfo.endTime)"
          class="btn apply"
        >报名已结束</button>
        <button
          v-else
          :class="['btn',isApply ? 'apply' : 'not-apply']"
          @click="handleClick"
        >{{isApply ? '取消报名' : '立即报名'}}</button>
      </div>
    </div>
    <div
      v-else
      class="no-data"
    >暂无课程信息</div>
    <div
      class="player-box"
      v-show="showVideo"
    >
      <div
        class="mask"
        @click="handleCloseVideo"
      ></div>
      <div class="player-con">
        <Player ref="player" />
        <div
          class="close-box"
          @click="handleCloseVideo"
        >
          <img
            src="@/assets/recruitStudentsPlan/close.png"
            alt=""
          >
        </div>
      </div>
    </div>
    <Dialog
      :visible="dialogStatus"
      title="确定取消报名吗？"
      :showClose="true"
      @close="handleCancel"
      @sure="handleSure"
    >
      <div class="body-text">
        点击确认将取消报名
        课程报名截止前可重新报名
      </div>
    </Dialog>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from '@/components/Footer.vue'
import Player from '@/components/player.vue';
import Dialog from '@/components/Dialog.vue'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {
    Header,
    Footer,
    Player,
    Dialog
  },
  data() {
    return {
      isApply: false,
      isTouchBotom: false,
      num: 10,
      showVideo: false,
      dialogStatus: false,
      courseId: '',
      planId: '',
      courseInfo: null,
      id: '',
      dayjs,
      isTeacher: false,
      micell,
      shareId: sessionStorage.getItem('planShareId')
    }
  },
  computed: {
    ...mapGetters(['studentInfo', 'studentApplyInfo'])
  },
  methods: {
    handleBack() {
      this.$router.push({
        path: '/recruitStudentsPlan', query: {
          shareId: sessionStorage.getItem('planShareId'),
          schoolId: sessionStorage.getItem('schoolId'),
        }
      })

    },

    // 判断报名时间是否结束
    isOverApplyDate(date) {
      return dayjs().toDate() > dayjs(date).toDate()
    },

    // 报名/取消报名
    handleClick() {
      if (this.isApply) {
        this.dialogStatus = true;
      } else {
        this.apply()
      }
    },

    // 预览章节
    handlePreview(url) {
      this.$refs.player.setPlay(url, {
        autoPlay: true,
        live: false
      })
      this.showVideo = true;
    },

    // 关闭预览
    handleCloseVideo() {
      this.$refs.player.close();
      this.showVideo = false
    },

    // 取消按钮
    handleCancel() {
      this.dialogStatus = false
    },

    // 确定按钮
    handleSure() {
      this.cancelApply()
    },

    // 获取课程详情信息
    getCourseDetail() {
      this.$request(`/mamserver/api/course/queryOneByH5/${this.courseId}/${this.id}`).then(res => {
        if (+res.code === 0) {
          this.courseInfo = res.data
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 报名
    apply() {
      console.log(222222222, this.studentApplyInfo);
      const { birthTime, clazzId, clazzName, contacts, headerImg, sex, name } = this.studentApplyInfo;
      this.$request(`/schools/api/courseSign/courseSign`, {
        method: 'post',
        data: {
          courseId: this.courseId,
          courseName: this.courseInfo.courseName,
          planId: this.planId,
          studentId: this.studentInfo.studentId,
          pid: this.id,
          birthTime,
          clazzId,
          clazzName,
          contacts,
          headerImg,
          sex,
          name
        }
      }).then(res => {
        if (+res.code === 0) {
          this.$message.success("报名成功");
          this.getStudentApplyStatus()
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 取消报名
    cancelApply() {
      this.$request(`/schools/api/courseSign/cancelSign`, {
        method: 'post',
        data: {
          courseId: this.courseId,
          planId: this.planId,
          studentId: this.studentInfo.studentId,
          pid: this.id
        }
      }).then(res => {
        if (+res.code === 0) {
          this.$message.success("取消报名成功");
          this.dialogStatus = false
          this.getStudentApplyStatus()
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    // 获取当前学生是否报名
    getStudentApplyStatus() {
      this.$request(`/schools/api/courseSign/selectSign`, {
        params: {
          courseId: this.courseId,
          planId: this.planId,
          stuId: this.studentInfo.studentId,
          pid: this.id
        }
      }).then(res => {
        if (+res.code === 0) {
          this.isApply = Boolean(res.data);
        } else {
          this.$message.error(res.msg);
        }
      })
    }


  },
  created() {
    this.courseId = this.$route.query.courseId;
    this.planId = this.$route.query.planId;
    this.id = this.$route.query.id;
    this.isTeacher = eval(this.$route.query.isTeacher)
    this.getCourseDetail()
    this.getStudentApplyStatus()
  },
}
</script>

<style lang="less" scoped>
.top-img {
  width: 100%;
  height: 210px;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
}

.content-box {
  padding: 14px 16px 55px 16px;

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #1c1c1c;
    line-height: 28px;
    margin-bottom: 12px;
  }

  .tuition {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .money {
      margin-right: 16px;
      font-size: 12px;
      color: #ff9f3d;

      > span {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .end-date {
      padding: 2px 11px;
      background: #ffe6e9;
      border-radius: 11px;
      font-size: 12px;
      font-weight: 500;
      color: #ff2c49;
    }

    .over-time {
      padding: 2px 10px;
      background: #f2f2f2;
      border-radius: 11px;
      font-size: 12px;
      font-weight: 500;
      color: #999999;
    }
  }

  .course-info {
    width: 100%;
    padding: 16px;
    background: #f4f5fb;
    border-radius: 8px;
    margin-bottom: 32px;

    .teacher-info {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }

      > span {
        font-size: 15px;
        font-weight: bold;
        color: #1c1c1c;
      }
    }

    .start-date {
      font-size: 14px;
      color: #000000;
    }
  }

  .course-brief {
    margin-bottom: 32px;

    .content {
      font-size: 15px;
      line-height: 24px;
      color: #666666;

      // > img {
      //   width: 100%;
      //   height: 234px;
      //   object-fit: cover;
      //   border-radius: 4px;
      // }
    }
  }

  .course-section {
    > ul {
      > li {
        padding: 10px 12px;
        background: #f4f5fb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 8px;
        margin-bottom: 8px;

        .section-name {
          flex-grow: 1;
          min-width: 230px;
          font-size: 15px;
          line-height: 22px;
          color: #333333;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .right-info {
          font-size: 12px;
          margin-left: 20px;
          min-width: 74px;
          display: flex;
          align-items: center;

          .preview {
            color: #ff9f3d;
          }

          .duration {
            margin-left: 12px;
            color: #565656;
          }
        }
      }
    }
  }
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 55px;
  border-top: 1px solid #f2f2f2;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  z-index: 9;

  .btn {
    width: 355px;
    height: 44px;
    border-radius: 55px;
    font-size: 18px;
    border: none;
  }

  .apply {
    background: #c1c1c1;
    color: #fff;

    &:active {
      background-color: #a09f9f;
    }
  }

  .not-apply {
    color: #ffffff;
    background: #ff9f3d;
  }
}

.filter {
  filter: blur(40px);
}

.plan-detail-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.back-btn {
  width: 24px;
  height: 24px;
  margin-right: 16px;
}

.player-box {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .player-con {
    width: 100%;
    height: auto;
    position: relative;
  }

  .close-box {
    position: absolute;
    top: 6px;
    left: 10px;
  }
}

.body-text {
  font-size: 13px;
  color: #333333;
  text-align: center;
}

.no-data {
  text-align: center;
  font-size: 18px;
}
</style>