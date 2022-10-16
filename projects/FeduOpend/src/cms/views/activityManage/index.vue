<template>
  <div class="article_warpper">
    <div>
      <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
      <el-form ref="myForm" :inline="true" @submit.native.prevent>
        <!-- <el-form-item label="搜索" prop="status">
          <el-input
            v-model="params.username"
            placeholder="请输入园所名称"
          ></el-input>
        </el-form-item> -->
        <!--        <el-form-item label="指定区域" prop="areaId">-->
        <!--          <el-cascader-->
        <!--            v-model="params.areaId"-->
        <!--            placeholder="请选择"-->
        <!--            :options="addressOptions"-->
        <!--            @change="setArea"-->
        <!--          ></el-cascader>-->
        <!--        </el-form-item>-->
        <el-form-item label="园所名称" prop="status">
          <el-input
            v-model="params.schoolName"
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
          <el-button @click="delActivity()">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="mute()">批量禁言</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="offset()">批量下线</el-button>
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
        @selection-change="setSelectRows"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="所在地区" width="200px" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ row.address ? row.address : '无地区信息' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="园所名称" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ row.schoolName ? row.schoolName : '无园所信息' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ row.publisher ? row.publisher : '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ row.mobile ? row.mobile : '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="160" align="center">
          <template #default="{ row }">
            <div>
              <span>
                {{ row.publishTime.slice(0, 10) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="readCounter"
          label="阅读量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="praiseNums"
          label="点赞数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="commentNums"
          label="评论数"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <div>
              <el-button
                :type="
                  row.status === 3
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
        <el-table-column align="left" label="状态" width="250px">
          <template #default="{ row }">
            <div>
              <el-button
                type="text"
                :disabled="row.commentStatus === 1"
                @click="mute(row)"
              >
                {{ +row.commentStatus === 1 ? '已禁言' : '禁言' }}
              </el-button>
              <el-button type="text" @click="delActivity(row)">删除</el-button>
              <el-button
                type="text"
                :disabled="row.status === 1"
                @click="changeStatus(row, $index)"
              >
                {{ row.status === 3 ? '下线' : '上线' }}
              </el-button>
              <el-button type="text" @click="show(row)">预览</el-button>
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
  // import { formTime } from '@/utils/index'
  import {
    MamSchoolActivity,
    DelSchoolActivity,
    OffActivity,
    UpSchoolActivity,
  } from '@/api/activity'
  import { MuteUser } from '@/api/common'
  // import SearchFilter from './compoents/SearchFilter'
  import tableMixin from '@/cms/mixins/tableMixin'
  // import Table from '@/cms/components/table'
  import phoneShow from './compoents/phoneShow'
  import { GetCategory } from '@/api/article'
  // import { STATUS_ARTICLE } from '@/cms/constants'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  // import AddArticle from './compoents/AddArticle'
  export default {
    components: {
      // SearchFilter,
      // Table,
      phoneShow,
      // AddArticle,
    },
    mixins: [tableMixin],
    data() {
      return {
        tableList: [],
        tableUrl: '/mamserver/api/dynamic/query',
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
      //获取地区数据
      // codeChange(value) {
      //   if (value[1] != null && value[2] != null) {
      //     var dz =
      //       CodeToText[value[0]] +
      //       '/' +
      //       CodeToText[value[1]] +
      //       '/' +
      //       CodeToText[value[2]]
      //   } else {
      //     if (value[1] != null) {
      //       dz = CodeToText[value[0]] + '/' + CodeToText[value[1]]
      //     } else {
      //       dz = CodeToText[value[0]]
      //     }
      //   }
      //   return dz
      // },
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
          this.dialogTableVisible = true
          this.previewUrl = row.shareUrl
        } else {
          this.$message({
            message: '暂无预览信息',
            type: 'warning',
          })
        }
      },
      setSelectRows(data) {
        this.selectInfo.legnth = 0
        if (data.length) {
          this.selectInfo = [...data]
        }
      },
      //切换园所动态状态
      changeStatus(data, index) {
        if (data.status == 3) {
          this.$confirm('是否需要下线？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              data.status = 4
              MamSchoolActivity(data.id).then((res) => {
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
          data.status = 3
          UpSchoolActivity(data.id).then((res) => {
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
      getCategoryList() {
        this.categoryList = []
        GetCategory().then((res) => {
          if (+res.code === 0) {
            this.categoryList = [...res.data.list]
          }
        })
      },
      showComment(row) {
        if (row.id) {
          this.$router.push({
            path: '/activityMange/commentList',
            query: { sourceId: row.id },
          })
        }
      },
      mute(data) {
        if (data || this.selectInfo.length) {
          let user = []
          this.$confirm('是否需要禁言？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              if (data) {
                user = [data.createUser]
              } else if (this.selectInfo.length) {
                for (let item of this.selectInfo) {
                  user.push(item.createUser)
                }
              }
              MuteUser(user).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '禁言成功!',
                  })
                  this.list()
                  this.selectInfo.length = 0
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消禁言',
              })
            })
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择动态',
          })
        }
      },
      delActivity(data) {
        console.log(data)
        let user = []
        if (data || this.selectInfo.length) {
          this.$confirm('是否需要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              if (data) {
                user = [data.id]
              } else if (this.selectInfo.length) {
                for (let item of this.selectInfo) {
                  user.push(item.id)
                }
              }
              if (user.length > 0) {
                DelSchoolActivity(user).then((res) => {
                  if (res.code == 0) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!',
                    })
                    this.list()
                    this.selectInfo.length = 0
                  }
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              })
            })
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择动态',
          })
        }
      },
      offset(data) {
        console.log(data)
        if (data || this.selectInfo.length) {
          let user = []
          this.$confirm('是否需要下线？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              if (data) {
                user = [data.id]
              } else if (this.selectInfo.length) {
                for (let item of this.selectInfo) {
                  user.push(item.id)
                }
              }
              OffActivity(user).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '下线成功!',
                  })
                  this.list()
                  this.selectInfo.length = 0
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
          this.$message({
            type: 'warning',
            message: '请先选择动态',
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
  .phone-show {
    // border-radius: 20px;

    .el-dialog {
      border-radius: 20px !important;
    }
  }
</style>
