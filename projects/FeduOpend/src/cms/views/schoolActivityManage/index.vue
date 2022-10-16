<template>
  <div class="article_warpper">
    <add-activity
      v-if="isEdit"
      ref="activityEdit"
      @addClick="isEdit = false"
      @success="success"
    ></add-activity>
    <div v-else>
      <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
      <el-form ref="myForm" :inline="true" @submit.native.prevent>
        <!-- <el-form-item label="搜索" prop="status">
          <el-input
            v-model="params.username"
            placeholder="请输入园所名称"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="指定区域" prop="areaId">
          <el-cascader
            v-model="params.areaId"
            placeholder="请选择"
            :options="addressOptions"
            @change="setArea"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="园所名称" prop="status">
          <el-input
            v-model="params.username"
            placeholder="请输入园所名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="payTime" width="200">
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
          <el-button type="primary" @click="articleBtn">发布动态</el-button>
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
        <el-form-item>
          <el-button @click="reset">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">批量下线</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
        @selection-change="setSelectRows"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="所在地区" width="200px" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{
                  +row.releaseType === 1
                    ? row.areaName
                    : +row.releaseType === 2
                    ? '指定学校发布'
                    : '全平台发布'
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="userNikeName"
          label="发布人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="publishTime"
          label="发布时间"
          align="center"
          width="160"
        ></el-table-column>
        <el-table-column label="浏览数" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ +row.views ? row.views : '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" width="160" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ +row.click ? row.click : '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="comments"
          label="评论数"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="类型">
          <template #default="{ row }">
            <div>
              <span>
                {{ +row.dynamicType === 1 ? '图片资讯' : '视频动态' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <div>
              <el-button
                :type="
                  row.status == 3
                    ? 'success'
                    : row.status == 2
                    ? 'primary'
                    : row.status == 0
                    ? 'danger'
                    : row.status == 1
                    ? 'info'
                    : 'warning'
                "
              >
                {{
                  row.status == 3
                    ? '已上线'
                    : row.status == 2
                    ? '待上线'
                    : row.status == 0
                    ? '已删除'
                    : row.status == 1
                    ? '草稿箱'
                    : '已下线'
                }}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="250px">
          <template #default="{ row }">
            <div>
              <el-button type="text" @click="show(row)">预览</el-button>
              <el-button
                v-show="+row.status !== 0"
                type="text"
                :disabled="row.status === 1"
                @click="changeStatus(row, $index)"
              >
                {{ row.status === 3 ? '下线' : '上线' }}
              </el-button>
              <el-button
                type="text"
                :disabled="row.status === 3"
                @click="edit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                :disabled="row.status === 3"
                @click="deleteInfo(row)"
              >
                删除
              </el-button>
              <el-button type="text" @click="showComment(row)">
                查看评论
              </el-button>
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
      width="20%"
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
  import { formTime } from '@/utils/index'
  import {
    OnlineActivity,
    OfflineActivity,
    DeleteActivity,
  } from '@/api/activity'
  // import SearchFilter from './compoents/SearchFilter'
  import tableMixin from '@/cms/mixins/tableMixin'
  // import Table from '@/cms/components/table'
  import AddActivity from './compoents/AddActivity.vue'
  import phoneShow from './compoents/phoneShow.vue'
  import { STATUS_ARTICLE } from '@/cms/constants'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  import { CATEGORY_LIST, PUBLISH_LIST } from '@/cms/constants'
  export default {
    components: {
      // SearchFilter,
      // Table,
      AddActivity,
      phoneShow,
    },
    mixins: [tableMixin],
    data() {
      return {
        tableList: [],
        tableUrl: '/api/dynamic/query',
        searchContent: {},
        publishList: PUBLISH_LIST,
        categoryList: CATEGORY_LIST,
        dialogTableVisible: false,
        tempNews: {},
        addressOptions: regionDataPlus,
        previewUrl: '',
      }
    },

    computed: {},
    created() {
      this.list()
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
      //发布图文
      articleBtn() {
        this.isEdit = true
      },
      //添加成功
      success() {
        this.isEdit = false
        this.list()
      },
      //修改图文信息
      edit(row) {
        this.isEdit = true
        let vm = this
        let data = { ...row }
        setTimeout(() => {
          vm.$refs.activityEdit.init(data)
        })
      },
      show(row) {
        if (row.shareUrl) {
          this.dialogTableVisible = true
          this.previewUrl = row.shareUrl
        } else {
          this.$message({
            message: '暂无预览信息',
            type: 'warning',
          })
        }

        // if (row) {
        //   this.dialogTableVisible = true
        //   this.previewUrl = `${process.env.VUE_APP_PREVIEW_URL}/details?shareId=${row.id}&type=3`
        //   console.log(this.previewUrl)
        //   // this.tempNews = { ...row }
        // }
      },
      setSelectRows(data) {
        console.log(data, '88888888888888')
      },
      //恢复图文信息
      // recoverArticle(data) {
      // if (data) {
      //   this.$confirm('是否需要恢复？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   })
      //     .then(() => {
      //       RecoverArticle(data.id).then((res) => {
      //         if (res.code == 0) {
      //           this.$message({
      //             message: '恭喜你，恢复成功',
      //             type: 'success',
      //           })
      //           this.list()
      //         }
      //       })
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消恢复',
      //       })
      //     })
      // }
      // },
      showComment(row) {
        if (row.id) {
          this.$router.push({
            path: '/activityMange/commentList',
            query: { sourceId: row.id },
          })
        }
      },
      //删除动态信息
      deleteInfo(data) {
        if (data) {
          this.$confirm('是否需要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DeleteActivity(data.id).then((res) => {
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
      //切换活动状态
      changeStatus(data, index) {
        if (data.status == 3) {
          this.$confirm('是否需要下线？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let time = new Date().getTime()
              data.offlineTime = formTime(time)
              OfflineActivity(data.id).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '下线成功!',
                  })
                  this.tableList[index].status = 4
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消下线',
              })
            })
        } else {
          OnlineActivity(data.id).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '上线成功!',
              })
              this.tableList[index].status = 3
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .article_warpper {
    padding: 20px;
  }
  .article_btn {
    margin: 20px 0;
  }
  .phone-show {
    border-radius: 20px;
  }
</style>
<style lang="scss">
  .el-dialog {
    border-radius: 20px;
  }
</style>
