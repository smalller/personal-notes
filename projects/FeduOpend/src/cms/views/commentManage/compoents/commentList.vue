<template>
  <div>
    <div class="comment">
      <div class="commentInfo">
        <span>
          {{ comment.comment }}
        </span>
      </div>
      <div class="commentList">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          style="margin-top: 20px"
          :data="tableList"
        >
          <el-table-column
            prop="comment"
            label="回复内容"
            width="200px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="recUserName"
            label="评论人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="评论时间"
            align="center"
            width="180px"
          >
            <template #default="{ row }">
              <span>
                {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作">
            <template #default="{ row }">
              <div>
                <el-button type="text" @click="banComment(row)">禁言</el-button>
                <el-button type="text" @click="delComment(row)">删除</el-button>
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
    </div>
  </div>
</template>

<script>
  import { DelComment, MuteUser } from '@/api/common'
  import VueCookie from 'vue-cookie'
  import tableMixin from '@/cms/mixins/tableMixin'
  // import Table from '@/cms/components/table'
  import dayjs from 'dayjs'
  export default {
    components: {
      // Table,
    },
    mixins: [tableMixin],
    props: {
      comment: {
        type: Object,
        default: () => {
          return {}
        },
      },
      previewUrl: {
        type: String,
        default: () => {
          return ''
        },
      },
    },
    data() {
      return {
        dayjs,
        tableList: [],
        tableUrl: `/community/comment/queryComments?relatedId=${this.comment.relatedId}`,
        searchContent: {},
        params: {
          pageSize: 10,
        },
        phoneNews: {},
        phoneInfo: '',
        pictureList: [],
        showVideoPath: '',
        controls: true,
        autoplay: false,
        comments: [],
        userId: VueCookie.get(`${firmId}_user_id`),
      }
    },

    mounted() {
      if (this.comment) {
        this.list()
      }
    },
    methods: {
      banComment(data) {
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
      //删除评论
      delComment(data) {
        if (data) {
          this.$confirm('是否需要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DelComment(data.uuid).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，删除成功',
                    type: 'success',
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
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .comment {
    width: 750px;
    top: 50%;
    left: 50%;
    z-index: 0;
    .commentInfo {
      width: 100%;
      margin: auto;
      height: 100px;
      border: 1px solid #eee;
      border-radius: 5px;
      span {
        display: block;
        font-size: 14px;
        margin: 5px;
      }
    }
  }
</style>
