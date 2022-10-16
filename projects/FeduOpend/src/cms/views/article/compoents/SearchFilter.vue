<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="发布时间" prop="payTime">
        <el-date-picker
          v-model="params.startTime"
          type="date"
          placeholder="开始日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-date-picker
          v-model="params.endTime"
          type="date"
          placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="params.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="栏目名称" prop="status">
        <el-select v-model="params.columnName" placeholder="请选择">
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="params.status" placeholder="请选择">
          <el-option
            v-for="(item, index) in payStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布人" prop="username">
        <el-input
          v-model="params.username"
          placeholder="请输入发布人"
        ></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="params.author" placeholder="请输入作者"></el-input>
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
  import { GetCategory } from '@/api/article'
  import { STATUS_ARTICLE } from '@/cms/constants'
  export default {
    data() {
      return {
        payStatusList: STATUS_ARTICLE,
        params: {},
        categoryList: [],
      }
    },
    mounted() {
      this.getCategoryList()
    },
    methods: {
      search() {
        this.$emit('search', this.params)
      },
      getCategoryList() {
        this.categoryList = []
        GetCategory().then((res) => {
          if (+res.code === 0) {
            this.categoryList = [...res.data.list]
          }
        })
      },
      reset() {
        this.params = {}
        this.$emit('reset')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
