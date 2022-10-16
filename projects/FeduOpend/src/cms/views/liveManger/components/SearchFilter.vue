<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="id">
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

<style lang="scss" scoped>
</style>