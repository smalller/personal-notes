<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="搜索" prop="status">
        <el-input
          v-model="params.username"
          placeholder="请输入园所名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="所在地区" prop="status">
        <el-cascader
          v-model="params.areaId"
          placeholder="请选择"
          :options="addressOptions"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="园所名称" prop="status">
        <el-input
          v-model="params.username"
          placeholder="请输入园所名称"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="params.status" placeholder="请选择">
          <el-option
            v-for="(item, index) in payStatusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="发布时间" prop="payTime">
        <el-date-picker
          v-model="params.startTime"
          type="date"
          placeholder="开始日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        -
        <el-date-picker
          v-model="params.endTime"
          type="date"
          placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <br />

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
      <el-form-item>
        <el-button @click="reset">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">批量禁言</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">批量下线</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { GetCategory } from '@/api/article'
  import { STATUS_ARTICLE } from '@/cms/constants'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  export default {
    data() {
      return {
        payStatusList: STATUS_ARTICLE,
        params: {},
        categoryList: [],
        addressOptions: regionDataPlus,
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
