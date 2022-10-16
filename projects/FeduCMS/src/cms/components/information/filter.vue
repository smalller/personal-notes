<template>
  <div>
    <el-form ref="form" :inline="true" @submit.native.prevent>
      <el-form-item label="班级">
        <el-select v-model="searchData.class" placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="+currentType !== 4">
        <el-input
          v-model="searchData.name"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          native-type="submit"
          type="primary"
          plain
          @click="handleSearch"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      currentType: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        searchData: {
          class: '',
          name: '',
        },
        options: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '一班',
            value: 1,
          },
          {
            label: '二班',
            value: 2,
          },
          {
            label: '三班',
            value: 3,
          },
        ],
      }
    },
    methods: {
      // 查询
      handleSearch() {
        this.$emit('handleSearch', this.searchData)
      },
      // 重置
      handleReset() {
        this.searchData = {
          class: '',
          name: '',
        }
        this.$emit('handleReset', this.searchData)
      },
    },
  }
</script>

<style></style>
