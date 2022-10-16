<template>
  <div class="feedbackManagement">
    <el-card>
      <el-form inline :model="formData">
        <el-form-item label="反馈类型">
          <el-select v-model="formData.type">
            <el-option value="功能问题" />
            <el-option value="使用问题" />
            <el-option value="意见反馈" />
            <el-option value="投诉" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈方式">
          <el-select v-model="formData.mode">
            <el-option value="投诉反馈" />
            <el-option value="应用模块" />
            <el-option value="其他" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈状态">
          <el-select v-model="formData.handleStatus">
            <el-option value="2" label="已处理" />
            <el-option value="1" label="未处理" />
            <el-option value="9" label="已删除" />
            <el-option value="" label="全部" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="list">
        <el-table-column label="终端" prop="appType" />
        <el-table-column label="反馈方式" prop="mode" />
        <el-table-column label="反馈类型" prop="type" />
        <el-table-column label="反馈用户" prop="username" />
        <el-table-column label="幼儿园" prop="schoolName" />
        <el-table-column label="幼儿姓名" prop="studentName" />
        <el-table-column label="反馈电话" prop="mobile" />
        <!--        <el-table-column label="反馈信息" prop="message" />-->
        <el-table-column label="处理用户" prop="handleUser" />
        <el-table-column label="处理状态" prop="enableStatus">
          <template #default="{ row }">
            <el-tag>
              {{
                +row.enableStatus === 1
                  ? '未处理'
                  : +row.enableStatus === 2
                  ? '已处理'
                  : '已删除'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column label="处理结果" prop="reply" />-->
        <el-table-column label="反馈时间" prop="createTime" />
        <el-table-column label="处理时间" prop="handleDate" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="openDetails(row)">处理</el-button>
            <el-popconfirm
              v-if="+row.enableStatus !== 9"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="sendDelete(row.id)"
            >
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="+pageForm.pageNo"
        :layout="'total, sizes, prev, pager, next, jumper'"
        :page-size="+pageForm.pageSize"
        :total="+pageForm.total"
        background
        @current-change="pageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </el-card>
    <feedback-details ref="feedbackDetails" @close="getFeedbackList" />
  </div>
</template>

<script>
  import { deleteFeedBack, getFeedBackList } from '@/cms/api/feedback'
  import FeedbackDetails from '@/cms/views/feedbackManagement/components/feedbackDetails'

  export default {
    name: 'FeedbackManagement',
    components: { FeedbackDetails },
    data() {
      return {
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        formData: {
          type: '',
          mode: '',
          handleStatus: '',
        },
        list: [],
      }
    },
    created() {
      this.query()
    },
    methods: {
      pageChange(page) {
        this.pageForm.pageNo = page
        this.getFeedbackList()
      },
      sizeChange(size) {
        this.pageForm.pageSize = size
        this.getFeedbackList()
      },
      query() {
        this.pageForm.pageNo = 1
        this.getFeedbackList()
      },
      getFeedbackList() {
        getFeedBackList(Object.assign(this.formData, this.pageForm)).then(
          (res) => {
            if (+res.code === 0) {
              console.log(res)
              this.list = res.data.list
              this.pageForm.total = res.data.page.totalNum
              this.pageForm.pageNo = res.data.page.pageNo
            }
          }
        )
      },
      openDetails(row) {
        this.$refs.feedbackDetails.open(row)
      },
      sendDelete(id) {
        deleteFeedBack({
          id,
        }).then((res) => {
          if (+res.code === 0) {
            this.getFeedbackList()
            this.$message.success('删除成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
      },
    },
  }
</script>

<style scoped></style>
