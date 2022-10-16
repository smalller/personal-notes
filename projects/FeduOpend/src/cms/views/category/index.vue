<template>
  <div>
    <add-category
      v-if="isEdit"
      ref="categoryEdit"
      @cancel="isEdit = false"
      @success="success"
    ></add-category>
    <Layout v-else>
      <template #btn>
        <el-button size="small" type="primary" @click="addCategory">
          新增栏目
        </el-button>
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
  import addCategory from './components/addCategory.vue'
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  import { DisableCategory } from '@/api/category'
  import VueCookie from 'vue-cookie'

  export default {
    components: {
      Layout,
      // SearchFilter
      Table,
      addCategory,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableUrl: '/mamserver/api/column/query', //列表地址
        searchContent: {},
        uploadUrl: '',
        fileList: [],
        classList: [],
        headers: {},
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'name',
            label: '栏目名称',
            align: 'center',
          },
          {
            prop: 'createTime',
            label: '创建时间',
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
            prop: 'sequence',
            label: '排序',
            align: 'center',
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => this.edit(scope.row)}
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.changeStatus(scope.row, scope.$index)
                      }}
                      class={+scope.row.status === 0 ? 'success' : 'warning'}
                    >
                      {+scope.row.status === 0 ? '启用' : '禁用'}
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
      console.log(this.list(), '2351313')
    },
    methods: {
      addCategory() {
        this.isEdit = true
      },
      changeStatus(params, index) {
        if (params.status == 1) {
          //开启-》禁用需要提示
          this.$confirm('是否需要禁用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DisableCategory(params.id).then((res) => {
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
          DisableCategory(params.id).then((res) => {
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
          this.$refs.categoryEdit.init({
            ...row,
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
