<script>
  import Table from '@/cms/components/table'
  import RecommendType from './components/RecommendType'
  import PreviewRecommend from './components/PreviewRecommend.vue'
  import {
    getRecommendList,
    deleteRecommend,
    flushRecommend,
  } from '@/cms/api/indexRecommend'

  export default {
    components: {
      Table,
      RecommendType,
      PreviewRecommend,
    },

    provide() {
      return {
        indexParent: this,
      }
    },

    data() {
      return {
        tableList: [],
        choosedRecommend: 1,
        listLoading: false,
        queryForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
      }
    },

    computed: {
      colums() {
        return [
          {
            label: '名称',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>
                      {this.choosedRecommend === 3
                        ? row.sourceName
                        : row.albumName}
                    </span>
                  </div>
                )
              },
            },
          },
          {
            label: 'sourceId',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>
                      {+row.sourceType === 3 ? row.sourceId : row.mediaAlbumId}
                    </span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'views',
            label: '点击数',
            align: 'center',
          },
          {
            prop: 'commentCount',
            label: '评论数',
            align: 'center',
          },
          {
            prop: 'areaName',
            label: '分享区域',
            align: 'center',
          },
          {
            prop: 'createTime',
            label: '推荐时间',
            align: 'center',
          },
          {
            prop: 'refreshTime',
            label: '推荐刷新时间',
            align: 'center',
          },
          {
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => this.handleRecommend(1, row)}
                    >
                      移除推荐
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => this.handleRecommend(2, row)}
                    >
                      刷新推荐
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => this.previewRecommend(row)}
                    >
                      预览
                    </el-button>
                  </div>
                  // {this.choosedRecommend !== 3 ? (
                  //   <el-button
                  //     type="text"
                  //     on-click={() => this.recommendHistory(row)}
                  //   >
                  //     推荐历史
                  //   </el-button>
                  // ) : (
                  //   ''
                  // )}
                )
              },
            },
          },
        ]
      },
    },

    created() {
      this.getTableList()
    },

    methods: {
      // 获取表格列表
      async getTableList() {
        this.listLoading = true
        this.queryForm.sourceType = this.choosedRecommend
        const { code, data } = await getRecommendList(this.queryForm)
        if (code == 0) {
          this.tableList = data.list
          this.queryForm.total = data.page.totalNum
        }
        this.listLoading = false
      },

      // 页码切换
      pageChange(val) {
        this.queryForm.pageNo = val
        this.getTableList()
      },

      // 列表长度切换
      pageSizeChange(val) {
        this.queryForm.pageSize = val
        this.getTableList()
      },

      // 切换顶部推荐类型
      changeRecommend(res) {
        this.queryForm = {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        }
        this.choosedRecommend = res
        this.getTableList()
      },

      // 移除/刷新推荐操作
      handleRecommend(index, row) {
        const txt = index === 1 ? '移除推荐' : '刷新推荐'
        const fn = index === 1 ? deleteRecommend : flushRecommend

        this.$confirm(`确认要${txt}？`, '提示', {
          type: 'warning',
        })
          .then(() => {
            this.recommendRequest(fn, row, txt)
          })
          .catch(() => {})
      },

      // 移除/刷新推荐请求
      async recommendRequest(fn, row, txt) {
        const { code } = await fn({
          id: row.id,
          sourceType: this.choosedRecommend,
        })

        if (code == 0) {
          this.getTableList()
          this.$message.success(`${txt}成功`)
        }
      },

      // 预览
      previewRecommend(row) {
        this.$refs.previewRecommend.openDialog(row)
      },

      // 推荐历史
      // recommendHistory(row) {
      //   this.$refs.recommendHistoryComm.openDialog(row)
      // },
    },

    render() {
      return (
        <div>
          <el-card>
            <recommend-type
              on-changeRecommend={this.changeRecommend}
            ></recommend-type>
            <Table
              colums={this.colums}
              data={this.tableList}
              list-loading={this.listLoading}
              page-config={this.queryForm}
              on-sizeChange={this.pageSizeChange}
              on-currentChange={this.pageChange}
            />
            <preview-recommend ref="previewRecommend"></preview-recommend>
          </el-card>
        </div>
      )
    },
  }
</script>

<style lang="scss" scoped>
  .titleBox {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
