<template>
  <div class="article_warpper">
    <div>
      <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
      <el-form ref="myForm" :inline="true" @submit.native.prevent>
        <el-form-item label="查找评论" prop="status">
          <el-input
            v-model="params.comment"
            placeholder="请输入评论内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="status">
          <el-input
            v-model="params.sysUserName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="payTime" width="200">
          <el-date-picker
            v-model="params.beginDate"
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
      </el-form>
      <!-- <Table
        :colums="colums"
        :data="tableList"
        :page-config="params"
        :list-loading="listLoading"
        @sizeChange="pageSizeChange"
        @currentChange="pageChange"
        @selection-change="setSelectRows"
      ></Table> -->

      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
      >
        <el-table-column
          prop="comment"
          label="评论内容"
          width="300px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="recCommentNum"
          label="回复数"
          width="100px"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="praiseNums"
          label="所在幼儿园"
          align="center"
        ></el-table-column> -->
        <el-table-column
          prop="sysUserName"
          label="评论人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="评论时间"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column align="left" label="操作" width="250px">
          <template #default="{ row }">
            <div>
              <el-button
                type="text"
                :disabled="+row.commentStatus === 1"
                @click="banComment(row)"
              >
                {{ +row.commentStatus === 1 ? '已禁言' : '禁言' }}
              </el-button>
              <!-- <el-button type="text" @click="banComment(row)">禁言</el-button> -->
              <el-button type="text" @click="delComment(row)">删除</el-button>
              <el-button type="text" @click="showRepaly(row)">
                查看回复
              </el-button>
              <el-button type="text" @click="show(row)">查看详情</el-button>
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
      width="800px"
      class="phone-show"
      :visible.sync="showComent"
      title="评论详情"
    >
      <comment-show v-if="showComent" :comment="commentInfo"></comment-show>
    </el-dialog>
    <el-dialog width="390px" class="phone-show" :visible.sync="showDetail">
      <phone-show v-if="showDetail" :preview-url="previewUrl"></phone-show>
    </el-dialog>
  </div>
</template>

<script>
  import { formTime } from '@/utils/index'
  import { GetComment, DelComment, MuteUser } from '@/api/common'
  // import SearchFilter from '/compoents/SearchFilter'
  import tableMixin from '@/cms/mixins/tableMixin'
  // import Table from '@/cms/components/table'
  import commentShow from './compoents/commentList.vue'
  import { GetCategory } from '@/api/article'
  import { STATUS_ARTICLE } from '@/cms/constants'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  import phoneShow from '../activityManage/compoents/phoneShow.vue'
  // import AddArticle from './compoents/AddArticle'
  export default {
    components: {
      // SearchFilter,
      // Table,
      commentShow,
      phoneShow,
      // AddArticle,
    },
    mixins: [tableMixin],
    data() {
      return {
        tableList: [],
        tableUrl: '/community/api/comment/getCommentList',
        searchContent: {},
        showComent: false,
        params: {},
        addressOptions: regionDataPlus,
        previewUrl: '',
        commentInfo: {},
        showDetail: false, // Show
      }
    },
    computed: {},
    mounted() {
      console.log(this.$route.query)
      if (this.$route.query.sourceId) {
        this.searchContent.relatedId = this.$route.query.sourceId
        console.log('11111111111111')
        this.list()
      } else {
        this.list()
      }
    },
    methods: {
      async setArea(data) {
        if (data) {
          if (data[0] !== '') {
            this.params.areaId = data.join(',')
            // this.params.areaName = await this.codeChange(data)
          } else {
            delete this.params.areaId
          }
        }
      },
      show(row) {
        if (row.shareUrl) {
          this.showDetail = true
          this.previewUrl = row.shareUrl
        } else {
          this.$message({
            message: '暂无预览信息',
            type: 'warning',
          })
        }
      },
      showRepaly(data) {
        if (data) {
          this.commentInfo = { ...data }
          this.showComent = true
        }
      },
      banComment(data) {
        console.log(data)
        let user = []
        this.$confirm('是否需要禁言？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            if (data.sysUserId) {
              user = [data.sysUserId]
            }
            MuteUser(user).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '禁言成功!',
                })
                this.list()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消禁言',
            })
          })
      },
      delComment(data) {
        this.$confirm('是否需要删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            DelComment(data.uuid).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                this.list()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
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
