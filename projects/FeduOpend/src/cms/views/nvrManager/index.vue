<template>
  <div class="class common">
    <cameraManager v-show="seen" ref="cameraManager"></cameraManager>
    <div v-show="!seen">
      <div>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="园所名称">
            <el-input v-model="params.name"></el-input>
          </el-form-item>
          <el-form-item label="园所ID">
            <el-input v-model="params.school_id"></el-input>
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
            <el-button @click="reset()">重置</el-button>
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
            label="园所ID"
            prop="schoolId"
            width="120px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="所在地区"
            prop="address"
            width="200px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="NVR编号"
            prop="gbId"
          ></el-table-column>
          <el-table-column
            align="center"
            label="最大通道数"
            prop="maxChannels"
            width="100px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="已开"
            prop="openChannels"
            width="60px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="在线"
            prop="onlines"
            width="60px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="申请人"
            prop="applyUserName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="手机号"
            prop="applyUserMobile"
            width="120px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="申请日期"
            prop="createTime"
            width="100px"
          ></el-table-column>
          <el-table-column align="center" label="状态" prop="status">
            <template #default="{ row }">
              {{ changeStatus(row.status) }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作" width="300px">
            <template #default="{ row }">
              <!--              <el-button type="primary" @click="refresh(row)">刷新</el-button>-->
              <el-button
                v-show="+row.status === 1"
                type="primary"
                @click="exa(row, true)"
              >
                通过
              </el-button>
              <el-button
                v-show="+row.status === 1"
                type="primary"
                @click="exa(row, false)"
              >
                不通过
              </el-button>
              <el-button
                v-show="row.status == 0 || row.status == 3 || row.status == 4"
                type="primary"
                @click="look(row)"
              >
                配置
              </el-button>
              <el-button
                v-show="row.status == 0"
                type="primary"
                @click="cameraManage(row)"
              >
                摄像头
              </el-button>

              <el-button
                v-show="row.status == 0"
                type="primary"
                @click="stopFuc(row, 'stop')"
              >
                停用
              </el-button>
              <el-button
                v-show="row.status == 5"
                type="primary"
                @click="stopFuc(row, 'start')"
              >
                启用
              </el-button>
              <el-button
                v-show="row.status == 4"
                type="primary"
                @click="refresh(row)"
              >
                刷新
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <nvrDialog ref="nvrDialog"></nvrDialog>
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
  </div>
</template>

<script>
  import cameraManager from './cameraManager'
  import nvrDialog from './components/nvrDialog'
  import tableMixin from '@/cms/mixins/tableMixin'
  import {
    QUERYNVRDEVICE,
    DEVICEDELETE,
    STOPDEVICE,
    STARTDEVICE,
  } from '@/cms/api/nvr'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import request from '@/utils/request'
  export default {
    name: 'Order',
    components: {
      nvrDialog,
      cameraManager,
    },
    mixins: [schoolMixin, tableMixin],
    data() {
      return {
        seen: false,
        addSeen: false,
        orderStateList: [], // 订单状态
        gatewayTypeList: [], // 支付方式
      }
    },
    mounted() {
      const vm = this
      vm.params.agentCompanyId = vm.$cookie.get(`${firmId}_company_id`)
      //加载列表数据
      vm.list(QUERYNVRDEVICE)
    },
    methods: {
      // shuaxin
      refresh(val) {
        request({
          url: '/facility/api/device/refreshDevice',
          method: 'put',
          params: {
            id: val.id,
          },
        }).then((res) => {
          if (+res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            this.list()
          }
        })
      },
      // 管理摄像头
      cameraManage(row) {
        this.seen = true
        this.$refs.cameraManager.init(row)
      },
      // 审核
      exa(val, flag) {
        const str = flag
          ? '/facility/api/device/passAprov'
          : '/facility/api/device/refuseAprov'
        request({
          url: str,
          method: 'put',
          params: {
            deviceId: val.id,
          },
        }).then((res) => {
          if (+res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            this.list()
          }
        })
      },
      changeStatus(key) {
        let val
        switch (key) {
          case '0':
            val = '使用中'
            break
          case '1':
            val = '待审核'
            break
          case '2':
            val = '未通过'
            break
          case '3':
            val = '未配置'
            break
          case '4':
            val = '接入中'
            break
          case '5':
            val = '已停用'
            break
          case 'NotFound':
            val = '已移除'
            break
        }
        return val
      },
      look(row) {
        this.$refs.nvrDialog.init(row)
      },
      stopFuc(row, type) {
        let str = ''
        if (type === 'start') {
          str = `此操作将启用该数据相关设备, 是否继续?`
        } else {
          str = '停用之后再次启用需要联系总部重新启用，请确认当前操作'
        }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          request({
            url: `${type === 'start' ? STARTDEVICE : STOPDEVICE}`,
            method: 'get',
            params: {
              id: row.id,
            },
          }).then((res) => {
            if (+res.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!',
              })
              this.list()
            }
          })
        })
      },
      delFuc(row) {
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          request({
            url: `${DEVICEDELETE}${row.id}`,
            method: 'delete',
          }).then((res) => {
            if (+res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.list()
            }
          })
        })
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
      sizeChange(val) {
        this.params.pageSize = val
        this.list()
      },
      pageChange(val) {
        this.params.pageNo = val
        this.list()
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
