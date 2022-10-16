<template>
  <div
    class="top-info"
    v-if="!isTeacher"
  >
    <slot></slot>
    <img
      class="avatar"
      :src="studentInfo.headerImg || require('@/assets/image/img-list3.png')"
      alt=""
    >
    <span class="name">{{studentInfo.studentName}}</span>
    <span class="class">{{className}}</span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['studentInfo'])
  },
  data() {
    return {
      className: '',
      isTeacher: false
    }
  },
  methods: {
    ...mapActions(['setStudentApplyInfo']),

    // 获取学生信息
    getStudentsInfo() {
      this.$request(`/schools/api/student/${this.studentInfo.studentId}`).then(res => {
        if (+res.code === 0) {
          this.className = res.data.clazzName
          this.setStudentApplyInfo(res.data)
        }
      })
    },
  },
  mounted() {
    const isTeacher = sessionStorage.getItem('isTeacher')
    if (isTeacher) {
      if (+isTeacher === 1) {
        this.isTeacher = true
        return
      }
    }
    this.getStudentsInfo()
  }
}
</script>

<style lang="less" scoped>
.top-info {
  padding: 5px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .name {
    font-weight: 500;
    font-size: 16px;
    color: #1c1c1c;
    margin-right: 11px;
  }

  .class {
    width: 50px;
    height: 18px;
    background: #e5e5e5;
    border-radius: 30px;
    font-size: 10px;
    color: #6a6a6a;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>