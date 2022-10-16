<template>
  <div class="order_warpper">
    <search-filter @reset="reset" @search="search"></search-filter>
    <Table
      :colums="colums"
      :data="tableList"
      :page-config="params"
      :list-loading="listLoading"
      @sizeChange="pageSizeChange"
      @currentChange="pageChange"
    ></Table>
    <el-dialog title="订单详情" :visible.sync="showInfo" width="20%" center>
      <el-form label-width="150px">
        <el-form-item label="原价：">
          <span>{{ selectData.order_amt }}</span>
        </el-form-item>
        <el-form-item label="实付：">
          <span>{{ selectData.order_real_amt }}</span>
        </el-form-item>
        <el-form-item label="运营商分成比列：">
          <span>{{ selectData.agent_rate * 100 }}%</span>
        </el-form-item>
        <el-form-item label="运营商分成金额：">
          <span>{{ selectData.agent_amt }}</span>
        </el-form-item>
        <el-form-item label="扣除服务费和税费：">
          <span>{{ selectData.server_rate * 100 }}%</span>
        </el-form-item>
        <el-form-item label="实际到账：">
          <span>{{ selectData.return_amt }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="showInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getOrderInfo, getPayType, getStatusType } from '@/api/order'
  import { mapActions } from 'vuex'
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
        tableUrl: '/orders/api/order/getOrders',
        searchContent: {},
        payStatus: [],
        payType: [],
        selectData: {},
        showInfo: false,
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'agentCompanyName',
            label: '所属代理商',
            align: 'center',
          },
          {
            prop: 'schoolName',
            label: '所属幼儿园',
            align: 'center',
          },
          {
            prop: 'orderId',
            label: '订单号',
            align: 'center',
          },
          {
            prop: 'create_user',
            label: '支付用户',
            align: 'center',
          },
          {
            prop: 'mobile',
            label: '手机号码',
            align: 'center',
          },
          {
            prop: 'payTime',
            label: '购买时间',
            align: 'center',
          },
          {
            prop: 'productType',
            label: '商品类型',
            align: 'center',
          },
          {
            prop: 'productName',
            label: '商品名称',
            align: 'center',
          },
          {
            prop: 'amount',
            label: '金额',
            align: 'center',
          },
          {
            prop: 'orderStatus',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{this.getType(scope.row.orderStatus, 1)}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'payGatewayType',
            label: '支付方式',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{this.getType(scope.row.payGatewayType, 2)}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'orderSourse',
            label: '订单来源',
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
                      on-click={() => {
                        this.getOrder(scope.row)
                      }}
                    >
                      查看详情
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
      this.setType()
      this.list()
    },
    methods: {
      ...mapActions({
        ac_getPayStatus: 'code_list/ac_getPayStatus',
        ac_getPayType: 'code_list/ac_getPayType',
      }),
      //获取支付和状态类型
      async setType() {
        // this.payStatus = []
        // this.payType = []
        // getPayType().then((res) => {
        //   if (+res.code == 0) {
        //     this.payType = res.data
        //   }
        // })
        // getStatusType().then((res) => {
        //   if (+res.code == 0) {
        //     this.payStatus = res.data
        //   }
        // })
        this.ac_getPayStatus()
        this.ac_getPayType()
      },
      //返回支付和状态类型
      getType(data, index) {
        let name = ''
        if (data) {
          if (index === 1) {
            for (let status of this.payStatus) {
              if (data.index == status.index) {
                name = status.describe
              }
            }
          } else {
            for (let type of this.payType) {
              if (data.index == type.index) {
                name = type.describe
              }
            }
          }
        }
        return name
      },
      //查询订单详情
      getOrder(data) {
        this.showInfo = false
        this.selectData = {}
        if (data) {
          getOrderInfo(data.orderId).then((res) => {
            if (+res.code == 0) {
              if (res.data.list.length) {
                this.showInfo = true
                this.selectData = res.data.list[0]
              } else {
                this.$message({
                  type: 'warning',
                  message: '暂无订单详情数据!',
                })
              }
            } else {
              this.$message({
                type: 'warning',
                message: '订单信息查询失败!',
              })
            }
          })
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
  }
</style>
