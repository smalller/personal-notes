<template>
  <div class="order_warpper">
    <search-filter @reset="reset" @search="search"></search-filter>
    <Table
      :colums="colums"
      :data="tableList"
      :list-loading="listLoading"
      :page-config="params"
      @sizeChange="pageSizeChange"
      @currentChange="pageChange"
    ></Table>
  </div>
</template>

<script>
  import { getRePay } from '@/api/finance'
  import Table from '@/cms/components/table'
  import SearchFilter from './components/SearchFilter'
  import tableMinix from '@/cms/mixins/tableMixin'
  export default {
    components: {
      Table,
      SearchFilter,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableList: [],
        tableUrl: '/orders/agent/getList',
        searchContent: {},
        payStatus: [
          {
            index: 0,
            describe: '未返现',
          },
          {
            index: 1,
            describe: '返现中',
          },
          {
            index: 2,
            describe: '返现成功',
          },
          {
            index: 3,
            describe: '返现失败',
          },
        ],
        payType: [],
        selectData: {},
        showInfo: false,
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'return_time',
            label: '平台打款时间',
            align: 'center',
          },
          {
            prop: 'order_id',
            label: '平台订单号',
            align: 'center',
          },
          {
            prop: 'contact_name',
            label: '代理商',
            align: 'center',
          },
          {
            prop: 'uuid',
            label: '回执订单号',
            align: 'center',
          },
          {
            prop: 'return_status',
            label: '付款状态',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{this.getType(scope.row.return_status, 1)}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'return_remark',
            label: '备注',
            align: 'center',
          },
          {
            prop: 'order_amt',
            label: '收款',
            align: 'center',
          },
          {
            prop: 'ios_amt',
            label: '苹果扣费',
            align: 'center',
          },
          {
            prop: 'order_real_amt',
            label: '实际到账',
            align: 'center',
          },
          {
            prop: 'company_rate',
            label: '公司分成比例',
            align: 'center',
          },
          {
            prop: 'company_amt',
            label: '公司收入',
            align: 'center',
          },
          {
            prop: 'agent_rate',
            label: '代理商分成比例',
            align: 'center',
          },
          {
            prop: 'agent_amt',
            label: '代理商分成金额',
            align: 'center',
          },
          {
            prop: 'server_rate',
            label: '服务费率',
            align: 'center',
          },
          {
            prop: 'server_amt',
            label: '服务费',
            align: 'center',
          },
          {
            prop: 'return_amt',
            label: '实际支付',
            align: 'center',
          },
          {
            prop: 'tax_amt',
            label: '税务公司收费',
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
                      v-show={+scope.row.return_status !== 3}
                      disabled={+scope.row.return_status === 2}
                      on-click={() => {
                        this.rePay(scope.row)
                      }}
                    >
                      立即打款
                    </el-button>
                    <el-button
                      type="text"
                      v-show={+scope.row.return_status === 3}
                      class={'warning'}
                      on-click={() => {
                        this.rePay(scope.row)
                      }}
                    >
                      重新打款
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
      getType(data, index) {
        let name = ''
        if (index === 1) {
          for (let status of this.payStatus) {
            if (+data == +status.index) {
              name = status.describe
            }
          }
        }
        return name
      },
      //重新打款
      rePay(data) {
        if (data) {
          getRePay(data.order_id).then((res) => {
            if (+res.code == 0) {
              this.$message({
                type: 'success',
                message: '打款中!',
              })
            } else {
              this.$message({
                type: 'warning',
                message: '付款失败!',
              })
            }
          })
          this.list()
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .order_warpper {
    padding: 20px;
    .add_btn {
      margin: 0 20px;
    }
    .header_title {
      font-size: 14px;
      font-weight: bold;
    }
    .table {
      margin-top: 20px;
    }
    .success {
      color: #67c23a;
    }
    .warning {
      color: #f56c6c;
    }
  }
</style>
