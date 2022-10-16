<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="发布时间" prop="time">
        <el-date-picker
          v-model="params.time"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input v-model="params.name"></el-input>
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
      <el-form-item label="发布人" prop="person">
        <el-input v-model="params.person"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="params.author"></el-input>
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
  import { STATUS_ARTICLE } from '@/cms/constants'
  export default {
    data() {
      return {
        params: {},
        statusList: STATUS_ARTICLE,
      }
    },
    methods: {
      search() {
        this.$emit('search', this.params)
      },
      reset() {
        this.params = {}
        this.$emit('reset')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
