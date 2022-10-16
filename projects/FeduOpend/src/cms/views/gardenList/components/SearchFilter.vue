<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="园所名称" prop="name">
        <el-input v-model="params.name" placeholder="请输入园所名称"></el-input>
      </el-form-item>
      <el-form-item label="园所ID" prop="id">
        <el-input v-model="params.id" placeholder="请输入园所ID"></el-input>
      </el-form-item>
      <el-form-item label="代理商" prop="keyword">
        <el-input
          v-model="params.keyword"
          placeholder="请输入姓名或电话号码"
        ></el-input>
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
  export default {
    data() {
      return {
        params: {},
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
