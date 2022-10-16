<template>
  <el-dialog
    custom-class="selectSchool"
    width="700px"
    title="选择学校"
    @close="close"
  >
    <el-form inline>
      <el-form-item label="园所名称">
        <el-input v-model="formData.schoolName" />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list">
      <el-table-column label="园所名称"></el-table-column>
      <el-table-column label="代理商名称"></el-table-column>
      <el-table-column label="操作">
        <template #default="{}">
          <el-button type="primary">选择园所</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageForm.pageNo"
      :page-size="pageForm.pageSize"
      :total="pageForm.total"
      background
      @current-change="pageChange"
      @size-change="pageSizeChange"
    ></el-pagination>
  </el-dialog>
</template>

<script>
  export default {
    name: 'SelectSchool',
    data() {
      return {
        visible: false,
        formData: {
          schoolName: '',
        },
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        list: [],
      }
    },
    methods: {
      open() {
        this.visible = true
      },
      close() {
        this.visible = false
        this.reset()
      },
      reset() {
        this.formData.schoolName = ''
      },
      pageChange(page) {
        this.pageForm.pageNo = page
      },
      pageSizeChange(size) {
        this.pageForm.pageSize = size
      },
    },
  }
</script>

<style scoped></style>
