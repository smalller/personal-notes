<template>
  <div>
    <add-user
      v-if="isEdit"
      ref="userEdit"
      @cancel="isEdit = false"
      @success="success"
    ></add-user>
    <Layout v-else>
      <template #search>
        <search-filter @search="search" @reset="reset"></search-filter>
      </template>
      <template #btn>
        <el-button type="primary" @click="addUser">新增</el-button>
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
  import SearchFilter from './components/SearchFilter'
  import Table from '@/cms/components/table'
  import AddUser from './components/AddUser'
  import tableMinix from '@/cms/mixins/tableMixin'
  import { changeUser } from '@/api/user'
  export default {
    components: {
      Layout,
      SearchFilter,
      Table,
      AddUser,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableUrl: '/userserver/api/operate/query', //列表地址
        searchContent: {},
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'username',
            label: '昵称',
            align: 'center',
          },
          {
            prop: 'createTime',
            label: '创建时间',
            align: 'center',
          },
          {
            prop: 'c',
            label: '角色',
            align: 'center',
          },
          {
            prop: 'mobile',
            label: '联系方式',
            align: 'center',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                return <span>{row.status == 1 ? '启用' : '禁用'}</span>
              },
            },
          },
          {
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { status, id } = scope.row
                let { edit, del, changeStatus } = this
                return (
                  <div>
                    <el-button on-click={() => edit(scope.row)} type="text">
                      修改
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() =>
                        del('/userserver/api/operate/delete', { id })
                      }
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => changeStatus(scope.row, scope.$index)}
                      class={status == 0 ? 'success' : 'warning'}
                    >
                      {status == 0 ? '启用' : '禁用'}
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
      changeStatus(params, index) {
        if (params.status == 1) {
          //开启-》禁用需要提示
          this.$confirm('是否需要禁用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              params.status = '0'
              changeUser(params).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '禁用成功!',
                  })
                  this.tableList[index].status = '0'
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
          params.status = '1'
          changeUser(params).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '开启成功!',
              })
              this.tableList[index].status = '1'
            }
          })
        }
      },
      addUser() {
        this.isEdit = true
      },
      edit(row) {
        this.isEdit = true
        setTimeout(() => {
          this.$refs.userEdit.init({
            ...row,
            password: '000000',
            password2: '000000',
          })
        })
      },
      success() {
        this.isEdit = false
        this.list()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .success {
    color: #67c23a;
  }
  .warning {
    color: #f56c6c;
  }
</style>
