<template>
  <el-dialog title="选择代理商" :visible.sync="dialogTableVisible" width="60%">
    <div class="content">
      <search-agent
        class="search_filter"
        @search="search"
        @reset="reset"
      ></search-agent>
      <Table
        :colums="colums"
        :data="tableList"
        :list-loading="listLoading"
        :page-config="params"
        @sizeChange="pageSizeChange"
        @currentChange="pageChange"
      ></Table>
    </div>
  </el-dialog>
</template>

<script>
  import SearchAgent from './SearchAgent'
  import Table from '@/cms/components/table'
  import TableMixin from '@/cms/mixins/tableMixin'
  export default {
    components: {
      Table,
      SearchAgent,
    },
    mixins: [TableMixin],
    data() {
      return {
        dialogTableVisible: false,
        chooseContent: '',
        agentData: {},
        tableList: [],
        tableUrl: '/userserver/api/agent/query',
        searchContent: {},
      }
    },
    computed: {
      colums() {
        return [
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
            prop: 'schoolCount',
            label: '园所数量',
            align: 'center',
          },
          {
            prop: 'createTime',
            label: '入驻时间',
            align: 'center',
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <el-button
                    type="primary"
                    on-click={() => {
                      this.getData(scope.row)
                    }}
                  >
                    选择
                  </el-button>
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
      open() {
        this.dialogTableVisible = true
      },
      close() {
        this.dialogTableVisible = false
      },
      reset() {
        this.chooseContent = ''
        this.list()
      },
      //获取数据
      getData(row) {
        if (row) {
          this.$emit('setAgent', row)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .content {
    height: 70vh;
    overflow: scroll;
  }
  .chooseAgent_title {
    display: flex;
    margin-bottom: 20px;
    .el-input {
      width: 200px;
      margin-right: 20px;
    }
  }
</style>
