<template>
  <el-dialog title="选择学校" :visible="visible" width="700px" @close="close">
    <div class="schoolSelectBox">
      <div class="head">
        <el-form
          :model="queryForm"
          inline
          label-position="left"
          label-width="70px"
        >
          <el-form-item label="园所名称">
            <el-input v-model="queryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="园所ID">
            <el-input v-model="queryForm.schoolId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table :data="list">
          <el-table-column label="园所名称" prop="name"></el-table-column>
          <el-table-column
            label="代理商名称"
            prop="agentContactName"
          ></el-table-column>
          <el-table-column label="操作" align="right">
            <template #default="{ row }">
              <el-button type="primary" @click="selectSchool(row)">
                选择学校
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="+pageForm.pageNo"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :page-size="+pageForm.pageSize"
          :total="+pageForm.totalNum"
          background
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { QuerySchoolList } from '@/cms/api/school'

  export default {
    name: 'SchoolSelect',
    data() {
      return {
        visible: false,
        queryForm: {},
        pageForm: {
          pageNo: 1,
          pageSize: 10,
        },
        list: [],
        data: {},
      }
    },
    created() {
      // this.query()
    },
    methods: {
      open(item) {
        this.data = item
        this.query()
        this.visible = true
      },
      reset() {
        this.queryForm = {}
        this.pageForm.pageNo = 1
        this.pageForm.pageSize = 10
        this.query()
      },
      selectSchool(school) {
        this.$emit('select', {
          school: school,
          data: this.data,
        })
        this.close()
      },
      close() {
        this.visible = false
      },
      pageChange(page) {
        this.pageForm.pageNo = page
        this.query()
      },
      sizeChange(size) {
        this.pageForm.pageSize = size
        this.query()
      },
      query() {
        const formData = Object.assign(this.queryForm, this.pageForm)
        for (const formDataKey in formData) {
          if (!formData[formDataKey]) {
            delete formData[formDataKey]
          }
        }
        QuerySchoolList(formData).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.pageForm.totalNum = res.data.page.totalNum
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .schoolSelectBox {
  }
</style>
