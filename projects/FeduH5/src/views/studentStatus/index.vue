<template>
  <div>
    <router-view />
    <van-action-sheet class="payBox" duration="0.1"  v-model="studentSelectShow" title="选择幼儿">
      <div class="studentItem"></div>
    </van-action-sheet>
  </div>
</template>

<script>
import qs from "qs";
import {mapActions, mapGetters} from 'vuex'

import worker from "@/views/studentStatus/worker";

export default {
  mixins: [worker],
  data() {
    return {
      studentSelectShow: false
    }
  },
  computed: {
    ...mapGetters(['userId','token','studentInfo'])
  },
  created() {
    if(this.$route.query?.schoolId) {
      this.setSchoolId(this.$route.query.schoolId)
    } else {
      // this.setSchoolId('SCH1426086297644769280')
    }
    if(micell.ua.isWeChat()) {

      if(!this.userId||!this.token) {
        this.$bus.$emit('wechatLogin', {
          title: '学籍录入',
          isSelectTeacher: 0
        })
      }
    } else {
      if(this.$route.query?.userId) {
        this.setUserId(this.$route.query?.userId)
      }
      if(this.$route.query?.token) {
        this.setToken(this.$route.query?.token)
      }
    }

  },
  methods: {
    ...mapActions(['setUserId','setToken','setStudentInfo','setSchoolId']),
    queryStudentList() {

    },
    getStudentInfo(studentId) {
      this.request( `${process.env['VUE_APP_BASE_API']}/schools/api/student/${studentId}`).then(res => {
        if(+res.code === 0) {
          this.setStudentInfo(res.data)
          this.setSchoolId(res.data.schoolId)
        }
      })
    },
    request(url,method='get', data, headers = {}) {
      headers = Object.assign(headers, {
        userId: this.userId,
        token: this.token,
        schoolId: '1'
      })
      return new Promise((resolve, reject) => {
        if (JSON.stringify(data) !== '{}') {
          url += `?${qs.stringify(data)}`
        }
        fetch(url, {
          method: method,
          headers: headers
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
