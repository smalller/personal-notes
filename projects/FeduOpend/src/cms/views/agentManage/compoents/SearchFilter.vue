<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="代理商" prop="keyword">
        <el-input
          v-model="params.keyword"
          placeholder="请输入姓名或电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="入驻时间" prop="time">
        <el-date-picker
          v-model="params.time"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          native-type="submit"
          type="primary"
          @click="search()"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data() {
      return {
        params: {},
      }
    },
    methods: {
      search() {
        let params = { ...this.params }
        params.startTime =
          params.time &&
          params.time[0] &&
          moment(params.time[0]).format('YYYY-MM-DD HH:mm:ss')
        params.endTime =
          params.time &&
          params.time[1] &&
          moment(params.time[1]).format('YYYY-MM-DD HH:mm:ss')
        delete params.time
        this.$emit('search', params)
      },
      reset() {
        this.params = {}
        this.$emit('reset')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
