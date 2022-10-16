<template>
  <div class="article_warpper">
    <div>
      <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
      <el-form ref="myForm" :inline="true" @submit.native.prevent>
        <el-form-item label="发布人" prop="status">
          <el-input
            v-model="params.userName"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="payTime" width="200">
          <el-date-picker
            v-model="params.startDate"
            type="date"
            placeholder="开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="params.endDate"
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
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="changeStatus">批量解禁</el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
        @selection-change="setSelectRows"
      >
        <el-table-column
          type="selection"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="bantalkTime"
          label="禁言时间"
          align="center"
        ></el-table-column>
        <el-table-column align="left" label="操作" width="250px">
          <template #default="{ row }">
            <div>
              <el-button type="text" @click="changeStatus(row)">解禁</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="+params.pageNo"
        :layout="'total, sizes, prev, pager, next, jumper'"
        :page-size="+params.pageSize"
        :total="+params.total"
        background
        @current-change="pageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </div>
    <el-dialog
      width="390px"
      class="phone-show"
      :visible.sync="dialogTableVisible"
    >
      <phone-show
        v-if="dialogTableVisible"
        :preview-url="previewUrl"
      ></phone-show>
    </el-dialog>
  </div>
</template>

<script>
  import { UnMuteUser } from '@/api/common'
  import tableMixin from '@/cms/mixins/tableMixin'
  import { GetCategory } from '@/api/article'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  export default {
    components: {},
    mixins: [tableMixin],
    data() {
      return {
        tableList: [],
        tableUrl: '/userserver/api/banTalk/getBanTalkUserList',
        searchContent: {},
        dialogTableVisible: false,
        params: {},
        addressOptions: regionDataPlus,
        previewUrl: '',
        selectInfo: [],
      }
    },
    computed: {},
    created() {
      this.list()
    },
    methods: {
      setSelectRows(data) {
        this.selectInfo.length = 0
        if (data.length) {
          this.selectInfo = [...data]
        }
        console.log(this.selectInfo)
      },
      //切换园所动态状态
      changeStatus(data) {
        console.log(data)
        let user = []
        this.$confirm('是否需要解禁？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            if (data.id) {
              user = [data.id]
            } else if (this.selectInfo.length) {
              for (let item of this.selectInfo) {
                console.log(item)
                user.push(item.id)
              }
            }
            UnMuteUser(user).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '解禁成功!',
                })
                this.list()
                this.selectInfo.length = 0
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
            })
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .article_warpper {
    padding: 20px;
  }
  .phone-show {
    // border-radius: 20px;

    .el-dialog {
      border-radius: 20px !important;
    }
  }
</style>
