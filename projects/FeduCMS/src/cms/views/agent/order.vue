<template>
  <div class="class common">
    <div>
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
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="订单号">
          <el-input v-model="params.orderId"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品名称">
          <el-input v-model="params.productName"></el-input>
        </el-form-item> -->
        <el-form-item label="订单状态">
          <el-select v-model="params.orderStatus" placeholder="请选择">
            <el-option
              v-for="(item, index) in orderStateList"
              :key="index"
              :label="item.describe"
              :value="item.index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="params.payGatewayType" placeholder="请选择">
            <el-option
              v-for="(item, index) in gatewayTypeList"
              :key="index"
              :label="item.describe"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买时间">
          <el-date-picker
            v-model="params.twoTime"
            type="datetimerange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
          <el-button @click="resetOrder()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
      >
        <el-table-column
          align="left"
          label="所属幼儿园"
          prop="schoolName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单号"
          prop="orderId"
        ></el-table-column>
        <el-table-column
          align="center"
          label="支付用户"
          prop="create_user"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          align="center"
          label="购买时间"
          prop="payTime"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品名称"
          prop="productName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="金额"
          prop="amount"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单状态"
          prop="orderStatus.descp"
        ></el-table-column>
        <el-table-column
          align="center"
          label="支付方式"
          prop="payGatewayType.descp"
        ></el-table-column>
        <el-table-column
          align="right"
          label="订单来源"
          prop="orderSourse"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="show(row)">详情</el-button>
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
  </div>
</template>

<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import {
    ORDERLIST,
    getOrderInfo,
    getGatewayType,
    getOrderStatus,
  } from '@/cms/api/order'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  export default {
    name: 'Order',
    mixins: [schoolMixin, tableMixin],
    data() {
      return {
        orderStateList: [], //订单状态
        gatewayTypeList: [], //支付方式
        showInfo: false, //查看详情
        selectData: {},
      }
    },
    mounted() {
      const vm = this
      vm.params.agentCompanyId = vm.$cookie.get(`${firmId}_company_id`)
      //加载支付方式
      getGatewayType().then((res) => {
        if (+res.code === 0) {
          vm.gatewayTypeList = res.data
        }
      })
      //加载订单状态
      getOrderStatus().then((res) => {
        if (+res.code === 0) {
          vm.orderStateList = res.data
        }
      })
      //加载列表数据
      delete vm.params.schoolId
      vm.list(ORDERLIST)
    },
    methods: {
      //重新订单信息，删除schoolId字段
      resetOrder() {
        this.params = {
          agentCompanyId: this.$cookie.get(`${firmId}_company_id`),
        }
        this.list(ORDERLIST)
      },
      //查看详情
      show(data) {
        console.log(data, '24543535413')
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
      //重置
      reset() {
        const vm = this
        vm.params = {
          pageNo: 1,
          pageSize: 20,
          total: 0, //总数
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
          agentCompanyId: vm.$cookie.get(`${firmId}_company_id`),
        }
        vm.list()
      },
      // 查询
      search() {
        const vm = this
        if (vm.params.twoTime) {
          vm.params['startTime'] = vm.params.twoTime[0]
          vm.params['endTime'] = vm.params.twoTime[1]
          vm.params.twoTime = undefined
        }
        vm.$set(vm.params, 'pageNo', 1) // 初始化页码
        vm.list()
      },
    },
  }
</script>

<style scoped></style>
