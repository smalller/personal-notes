<template>
  <div>
    <add-agent
      v-if="isEdit"
      ref="agentEdit"
      @cancel="isEdit = false"
      @success="success"
    ></add-agent>
    <Layout v-else>
      <template #search>
        <search-filter @search="search" @reset="reset"></search-filter>
      </template>
      <template #btn>
        <el-button type="primary" @click="addGender">新增</el-button>
      </template>
      <template #table>
        <Table
          :colums="colums"
          :data="tableList"
          :page-config="params"
          :list-loading="listLoading"
          @sizeChange="pageSizeChange"
          @currentChange="pageChange"
        ></Table>
      </template>
    </Layout>
  </div>
</template>

<script>
  import Layout from '@/cms/components/Layout'
  import SearchFilter from './compoents/SearchFilter'
  import tableMinix from '@/cms/mixins/tableMixin'
  import Table from '@/cms/components/table'
  import AddAgent from './compoents/AddAgent'
  import { DisbleAgent, OpenAgent } from '@/api/agent'
  export default {
    components: {
      SearchFilter,
      Layout,
      Table,
      AddAgent,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableList: [{ a: 10 }],
        tableUrl: '/userserver/api/agent/query',
        searchContent: {},
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'name',
            label: '机构名称',
            align: 'center',
          },
          {
            prop: 'contactName',
            label: '姓名',
            align: 'center',
          },

          {
            prop: 'contacts',
            label: '电话',
            align: 'center',
          },
          {
            prop: 'returnRate',
            label: '分成比例',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>{row.returnRate}%</span>
                  </div>
                )
              },
            },
          },
          // {
          //   prop: 'c', //暂时不确定
          //   label: '园所数量',
          //   align: 'center',
          // },
          {
            prop: 'createTime',
            label: '入驻时间',
            align: 'center',
          },
          {
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { edit, changeStatus, del } = this
                let { row, $index } = scope
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.searchGender(row)
                      }}
                    >
                      查看园所
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => changeStatus(row, $index)}
                      class={row.status == 0 ? 'success' : 'warning'}
                    >
                      {row.status == 0 ? '启用' : '禁用'}
                    </el-button>
                    <el-button type="text" on-click={() => edit(scope.row)}>
                      修改
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
      this.list()
    },
    methods: {
      addGender() {
        this.isEdit = true
      },
      searchGender(row) {
        this.$router.push({
          path: '/gardenList/index',
          query: row,
        })
      },
      //编辑信息
      edit(row) {
        this.isEdit = true
        let vm = this
        setTimeout(() => {
          vm.$refs.agentEdit.init(row)
        })
      },
      //添加成功回调
      success() {
        this.isEdit = false
        this.list()
      },
      //切换代理商状态
      async changeStatus(params, index) {
        console.log(params, '用户信息')
        if (params.status == 1) {
          //开启-》禁用需要提示
          this.$confirm('是否需要禁用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DisbleAgent(params).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '禁用成功!',
                  })
                  this.tableList[index].status = '0'
                } else {
                  this.$message({
                    type: 'warning',
                    message: '禁用失败!',
                  })
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消禁用',
              })
            })
        } else {
          OpenAgent(params).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '启用成功!',
              })
              this.tableList[index].status = '1'
            } else {
              this.$message({
                type: 'warning',
                message: '启用失败!',
              })
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .agentManage_warpper {
    padding: 20px;
  }
  .success {
    color: #67c23a;
  }
  .warning {
    color: #f56c6c;
  }
</style>
