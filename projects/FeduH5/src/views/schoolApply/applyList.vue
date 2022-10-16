<template>
  <div class="studentList">
    <my-head
      title="申请记录"
      @leftClick="backClick"
    >
    </my-head>
    <van-pull-refresh
      v-model="isLoading"
      @refresh="getApplyList"
    >
      <div class="apply-list">
        <ul>
          <li
            v-for="(item,index) in applyList"
            :key="index"
            @click="selectStudent(item)"
          >
            <div class="list-box">
              <img :src="item.headPortait" />
              <div class="list-info">
                <span>{{item.studentName}}宝宝申请加入{{item.clazzName}}</span>
                <p>{{item.studentName}}宝宝{{setAge(item.birthday)}}，申请加入{{item.clazzName}}</p>
                <p>申请时间：{{formTime(item.createTime)}}</p>
              </div>
              <div
                class="list-status"
                style="color:#FF8A8A"
                v-if="item.enableStatus === 9"
              >已撤销</div>
              <div
                v-else
                class="list-status"
                :style="{ color: item.status === 0 ? '#5DC1F6 ' : item.status === 1 ? '#84C77C': '#FF8A8A'  }"
              >{{item.status === 0 ? '审核中' : item.status === 1 ? '已通过': '已拒绝'  }}</div>
            </div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>

  </div>

</template>

<script>
import MyHead from "@/views/userCamera/component/head";
export default {
  name: "studentApply",
  components: { MyHead },
  data() {
    return {
      sms: '',
      show: false,
      codeErr: false,
      applyList: [],
      isLoading: false,
    }
  },
  computed: {

  },
  created() {
    this.getApplyList()
  },
  methods: {
    getApplyList() {
      this.isLoading = true
      this.applyList.length = 0
      this.$request('/schools/api/stuApply/queryApply', {
        methods: 'get',
      }).then(res => {
        if (res.code === 0) {
          this.applyList = [...res.data]
          this.isLoading = false
        }
      })
    },
    showHistory() {
      this.$router.push({
        name: 'record'
      })
    },
    //时间格式处理
    formTime(time) {
      let date = ""
      if (time) {
        date = dayjs(time).format("YYYY年MM月DD日 hh:mm")
      }
      return date
    },
    setAge(times) {
      const date = dayjs()
      let year = date.diff(times, 'year')
      let month = date.diff(times, 'month')
      if (month % 12) {
        return year + '岁' + month % 12 + '个月'
      } else {
        return year + '岁'
      }
    },
    backClick() {
      this.$router.back()
    },
    selectStudent(data) {
      if (data) {
        this.$router.push({
          name: 'student',
          query: { id: data.id }
        })
      }
    }

  }
}
</script>

<style  lang="less">
.studentList {
  background: #f6f7f9;
  min-height: 100vh;
  .head-btn {
    cursor: pointer;
  }
  .apply-list {
    background: #ffffff;
    min-height: 100vh;
    .list-box {
      height: 75px;
      width: 100%;
      border-bottom: 1px solid #eee;
      display: flex;
      .list-info {
        width: 60%;
        margin-left: 9px;
        margin-top: 12px;
        span {
          width: 100%;
          font-size: 14px;
          font-weight: 400;
          color: #1c1c1c;
          overflow: hidden;
          white-space: nowrap;
          word-wrap: normal;
          text-overflow: ellipsis;
        }
        p {
          width: 100%;
          margin-top: 3px;
          font-size: 12px;
          font-weight: 400;
          color: #b0b0b0;
          white-space: nowrap;
          overflow: hidden;
          word-wrap: normal;
          text-overflow: ellipsis;
        }
      }
      .list-status {
        font-size: 12px;
        font-weight: 400;
        line-height: 33px;
        margin-top: 25px;
        margin-left: 16px;
      }
      img {
        width: 59px;
        height: 59px;
        margin-left: 16px;
        margin-top: 12px;
        border-radius: 50%;
      }
    }
  }
}
.van-popup--center {
  border-radius: 16px;
}
</style>
