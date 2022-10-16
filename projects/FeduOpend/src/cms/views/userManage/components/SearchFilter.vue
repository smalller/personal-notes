<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="params.username"
          placeholder="请输入用户姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="params.createTime"
          type="date"
          placeholder="创建日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="params.status" clearable placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="params.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" type="primary" @click="search()">
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
  import { USER_STATUS } from '@/cms/constants'
  import moment from 'moment'
  export default {
    data() {
      return {
        params: {},
        statusList: USER_STATUS,
      }
    },
    methods: {
      async search() {
        let params = { ...this.params }
        if (params.createTime) {
          params.createTime = await moment(params.createTime).format(
            'YYYY-MM-DD'
          )
        }
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
