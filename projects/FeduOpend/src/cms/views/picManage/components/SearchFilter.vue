<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="图片ID" prop="id">
        <el-input v-model="params.id" placeholder="请输入图片ID"></el-input>
      </el-form-item>
      <el-form-item label="上传时间" prop="time">
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
        <el-button @click="resets">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        params: {
          status: 1,
          bizTypes: 'album,Header,article,Recipes,Attendance,Pay',
        },
        searchContent: {
          status: 1,
          bizTypes: 'album,Header,article,Recipes,Attendance,Pay',
        },
      }
    },
    methods: {
      search() {
        this.$emit('search', this.params)
      },
      resets() {
        this.$emit('resetes')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
