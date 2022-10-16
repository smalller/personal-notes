<template>
  <div class="article_warpper">
    <add-article
      v-if="isEdit"
      ref="articleEdit"
      @addClick="isEdit = false"
      @success="success"
    ></add-article>
    <div v-else>
      <search-filter @search="search" @reset="reset"></search-filter>
      <el-button type="primary" class="article_btn" @click="articleBtn">
        发布文章
      </el-button>
      <Table
        :colums="colums"
        :data="tableList"
        :page-config="params"
        :list-loading="listLoading"
        @sizeChange="pageSizeChange"
        @currentChange="pageChange"
      ></Table>
    </div>
    <el-dialog
      title="推荐"
      :visible.sync="showpopList"
      width="600px"
      top="10%"
      height="600"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          label-width="120px"
          class="article_ruleForm"
        >
          <el-form-item
            label="发布范围"
            prop="releaseType"
            :rules="filterRules({ required: true, msg: '请选择推荐范围' })"
          >
            <el-select
              v-model="ruleForm.releaseType"
              placeholder="请选择发布范围"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-show="ruleForm.releaseType === 1"
            label="指定区域"
            prop="areaId"
            :rules="filterRules({ required: true, msg: '请选择推荐区域' })"
          >
            <el-cascader
              v-model="ruleForm.areaId"
              style="width: 400px"
              placeholder="请选择"
              :options="addressOptions"
              @change="setArea"
            ></el-cascader>
          </el-form-item>

          <el-form-item
            v-show="ruleForm.releaseType === 2"
            label="幼儿园"
            prop="type"
            :rules="filterRules({ required: true, msg: '请选择幼儿园' })"
          >
            <el-input
              v-model="ruleForm.schoolName"
              type="text"
              maxlength="40"
              style="width: 400px"
              placeholder="请选择幼儿园"
              @click.native="showGarden"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="setPop">确 定</el-button>
        <el-button @click="showpopList = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="幼儿园列表"
      :visible.sync="showGardenList"
      width="60%"
      top="40px"
      height="600"
    >
      <div>
        <garden
          :school-data="ruleForm.schoolIds"
          @setSchool="getSchool"
        ></garden>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="setSchool">确 定</el-button>
        <el-button @click="showGardenList = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { formTime } from '@/utils/index'
  import {
    DeleteArticle,
    OnlineArticle,
    OfflineArticle,
    RecoverArticle,
    PopArticle,
    UpdateArticle,
  } from '@/api/article'
  import SearchFilter from './compoents/SearchFilter'
  import tableMixin from '@/cms/mixins/tableMixin'
  import Table from '@/cms/components/table'
  import AddArticle from './compoents/AddArticle'
  import Garden from './compoents/garden'
  import { CATEGORY_LIST } from '@/cms/constants'
  import { regionDataPlus, CodeToText } from 'element-china-area-data'
  export default {
    components: {
      SearchFilter,
      Table,
      AddArticle,
      Garden,
    },
    mixins: [tableMixin],
    data() {
      return {
        tableList: [],
        tableUrl: '/mamserver/api/article/query',
        searchContent: {},
        showGardenList: false,
        showpopList: false,
        ruleForm: {},
        categoryList: [],
        addressOptions: regionDataPlus,
        schoolIds: [],
      }
    },

    computed: {
      colums() {
        return [
          {
            prop: 'title',
            label: '标题',
            align: 'center',
          },
          {
            prop: 'columnName',
            label: '栏目名称',
            align: 'center',
          },
          {
            prop: 'id',
            label: 'uuid',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return +row.status === 3 ? row.id : ''
              },
            },
          },
          {
            prop: 'username',
            label: '发布人',
            align: 'center',
          },
          {
            prop: 'onlineTime',
            label: '上线时间',
            align: 'center',
          },
          {
            prop: 'offlineTime',
            label: '下线时间',
            align: 'center',
          },
          {
            prop: 'author',
            label: '作者',
            align: 'center',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return (
                  <div>
                    <el-button
                      type={
                        row.status == 3
                          ? 'success'
                          : row.status == 2
                          ? 'primary'
                          : row.status == 0
                          ? 'danger'
                          : row.status == 1
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {row.status == 3
                        ? '已上线'
                        : row.status == 2
                        ? '待上线'
                        : row.status == 0
                        ? '已删除'
                        : row.status == 1
                        ? '草稿箱'
                        : '已下线'}
                    </el-button>
                  </div>
                )
              },
            },
          },
          {
            prop: 'source',
            label: '来源',
            align: 'center',
          },
          {
            prop: 'click',
            label: '点赞数',
            align: 'center',
          },
          {
            prop: 'views',
            label: '浏览数',
            align: 'center',
          },
          {
            prop: 'heat',
            label: '热度',
            align: 'center',
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return (
                  <div>
                    <el-button
                      type="text"
                      disabled={row.status !== 3}
                      on-click={() => this.pop(scope.row)}
                    >
                      推荐
                    </el-button>
                    <el-button
                      type="text"
                      disabled={row.status !== 3}
                      on-click={() => this.update(scope.row)}
                    >
                      刷新
                    </el-button>
                    <el-button
                      type="text"
                      disabled={row.status === 3}
                      on-click={() => this.edit(scope.row)}
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      disabled={row.status === 3}
                      on-click={() => {
                        this.deleteArticle(row)
                      }}
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      disabled={row.status === 1}
                      v-show={+row.status !== 0}
                      on-click={() => {
                        this.changeStatus(row, $index)
                      }}
                    >
                      {row.status === 3 ? '下线' : '上线'}
                    </el-button>
                    <el-button
                      type="text"
                      disabled={row.status === 1}
                      v-show={+row.status === 0}
                      on-click={() => {
                        this.recoverArticle(row, $index)
                      }}
                    >
                      恢复
                    </el-button>
                  </div>
                )
              },
            },
          },
        ]
      },
    },
    created() {
      this.categoryList = [...CATEGORY_LIST]
      this.list()
    },
    methods: {
      //推荐文章
      pop(data) {
        if (data) {
          this.ruleForm = { sourceType: 3, sourceId: data.id }
          this.showpopList = true
        }
      },
      //幼儿园列表
      showGarden() {
        this.showGardenList = true
      },
      //获取幼儿园数据
      getSchool(data) {
        if (data) {
          // this.ruleForm.schoolIds = [...data]
          this.schoolIds = [...data]
        } else {
          this.schoolIds = []
        }
      },
      //发布幼儿园
      async setSchool() {
        this.ruleForm.schoolIds = this.schoolIds
        this.ruleForm.schoolName =
          this.ruleForm.schoolIds.length === 0
            ? '请选择幼儿园'
            : `已选择${this.ruleForm.schoolIds.length}所学校`
        this.$message.success('添加成功')
        this.showGardenList = false
      },
      //设定发布区域
      setArea(data) {
        if (data) {
          // if (data.length > 0) {
          //   ;[
          //     this.ruleForm.province = '',
          //     this.ruleForm.city = '',
          //     this.ruleForm.area = '',
          //   ] = data
          // } else {
          //   this.ruleForm.province = ''
          //   this.ruleForm.city = ''
          //   this.ruleForm.area = ''
          // }
        }
      },
      //推荐文章
      async setPop() {
        if (this.ruleForm.releaseType) {
          if (+this.ruleForm.releaseType === 1) {
            // delete ruleForm.schoolIds
            this.ruleForm.areaId = this.ruleForm.areaId.join()
          }
          PopArticle(this.ruleForm).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '恭喜你，推荐成功',
                type: 'success',
              })
              this.showpopList = false
              this.list()
            }
          })
        }
      },
      //刷新文章
      update(data) {
        if (data) {
          UpdateArticle(data.id).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '文章刷新成功!',
                type: 'success',
              })
              this.list()
            } else {
              this.$message({
                message: '文章刷新失败!',
                type: 'warning',
              })
            }
          })
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
        setTimeout(() => {
          vm.$refs.articleEdit.init(row)
        })
      },
      //恢复图文信息
      recoverArticle(data) {
        if (data) {
          this.$confirm('是否需要恢复？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              RecoverArticle(data.id).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，恢复成功',
                    type: 'success',
                  })
                  this.list()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消恢复',
              })
            })
        }
      },
      //删除图文信息
      deleteArticle(data) {
        if (data) {
          this.$confirm('是否需要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DeleteArticle(data.id).then((res) => {
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
        // let code = {
        //   id: data.id,
        // }
        if (data.status == 3) {
          this.$confirm('是否需要下线？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let time = new Date().getTime()
              data.offlineTime = formTime(time)
              OfflineArticle(data.id).then((res) => {
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
          OnlineArticle(data.id).then((res) => {
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
</style>
