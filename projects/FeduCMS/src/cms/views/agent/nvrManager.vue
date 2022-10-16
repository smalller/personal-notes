<template>
  <div class="class common">
    <cameraManager v-show="seen" ref="cameraManager"></cameraManager>
    <el-dialog width="800" title="监控预览" :visible.sync="showPre">
      <iframe
        class="show-pre"
        scrolling="auto"
        :src="selecteInfo.playbackAddress"
        frameborder="0"
      ></iframe>
    </el-dialog>
    <div v-show="!seen">
      <edit
        v-if="addSeen"
        ref="edit"
        @close=";(addSeen = false), list()"
      ></edit>
      <camer
        v-else-if="isCamer"
        ref="camer"
        @close=";(isCamer = false), list()"
      ></camer>
      <ev v-else-if="isEv" ref="ev" @close=";(isEv = false), list()"></ev>
      <div v-else>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="摄像头类型">
            <el-select
              v-model="cameraType"
              placeholder="请选择"
              @change="reset"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="园所名称">
            <el-input v-model="params.schoolName"></el-input>
          </el-form-item>
          <el-form-item label="园所ID">
            <el-input v-model="params.schoolId"></el-input>
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
          <el-form-item>
            <el-button
              v-if="+cameraType === 1"
              native-type="submit"
              type="primary"
              @click="insert"
            >
              开通NVR
            </el-button>
            <el-button
              v-if="+cameraType === 1"
              native-type="submit"
              type="primary"
              @click="addCamer"
            >
              开通摄像头
            </el-button>
            <el-button
              v-if="+cameraType === 0"
              native-type="submit"
              type="primary"
              @click="addEv"
            >
              开通萤石摄像头
            </el-button>
            <el-button
              v-if="+cameraType === 0"
              type="primary"
              @click="refreshEv()"
            >
              刷新
            </el-button>
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
          ></el-table-column>
          <el-table-column
            align="center"
            label="所在地区"
            prop="address"
          ></el-table-column>
          <el-table-column
            align="center"
            label="摄像头名称"
            prop="name"
          ></el-table-column>
          <el-table-column align="center" label="摄像头编号">
            <template #default="{ row }">
              {{ +cameraType === 0 ? row.id : row.gbId }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="+cameraType === 1"
            align="center"
            label="最大通道数"
            prop="maxChannels"
          ></el-table-column>
          <el-table-column
            v-if="+cameraType === 1"
            align="center"
            label="已开通的通道数"
            prop="openChannels"
          ></el-table-column>
          <el-table-column
            v-if="+cameraType === 1"
            align="center"
            label="在线数量"
            prop="onlines"
          ></el-table-column>
          <el-table-column
            align="right"
            label="申请人"
            prop="applyUserName"
          ></el-table-column>
          <el-table-column
            align="right"
            label="申请人手机号"
            prop="applyUserMobile"
            width="130"
          ></el-table-column>
          <el-table-column
            align="center"
            label="申请日期"
            width="200"
            prop="createTime"
          ></el-table-column>
          <el-table-column align="center" label="状态" prop="status">
            <template #default="{ row }">
              {{ +cameraType === 1 ? changeStatus(row.status) : '使用中' }}
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" width="430px">
            <template #default="{ row }">
              <el-button
                v-show="row.status == 0"
                v-if="+cameraType === 1"
                type="primary"
                @click="cameraManage(row)"
              >
                管理摄像头
              </el-button>
              <el-button
                v-show="row.status == 0"
                v-if="+cameraType === 1"
                type="primary"
                @click="insertTd(row)"
              >
                增加通道
              </el-button>
              <el-button
                v-show="row.status == 2"
                v-if="+cameraType === 1"
                type="primary"
                @click="insertTdTwo(row)"
              >
                重新申请
              </el-button>
              <el-button
                v-show="row.status == 0 || row.status == 3 || row.status == 4"
                type="primary"
                @click="look(row)"
              >
                查看参数
              </el-button>
              <el-button
                v-show="row.status == 5"
                type="primary"
                @click="delFuc(row)"
              >
                删除
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
                v-if="+cameraType === 1"
                type="primary"
                @click="refresh(row)"
              >
                刷新
              </el-button>
              <el-button
                v-if="+cameraType === 0"
                type="primary"
                @click="view(row)"
              >
                预览
              </el-button>
              <el-button
                v-if="+cameraType === 0"
                type="primary"
                @click="editEv(row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="+cameraType === 0"
                type="danger"
                @click="delEv(row)"
              >
                删除
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
  import edit from './components/nvrManagerEdit'
  import camer from './components/nvrCamerEdit.vue'
  import ev from './components/nvrEvEdit.vue'
  import cameraManager from './cameraManager'
  import nvrDialog from './components/nvrDialog'
  import tableMixin from '@/cms/mixins/tableMixin'
  import {
    QUERYNVRDEVICE,
    DEVICEDELETE,
    STOPDEVICE,
    STARTDEVICE,
    EVLIST,
    DELEV,
  } from '@/cms/api/nvr'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import request from '@/utils/request'
  export default {
    name: 'Order',
    components: {
      edit,
      nvrDialog,
      cameraManager,
      camer,
      ev,
    },
    mixins: [schoolMixin, tableMixin],
    data() {
      return {
        options: [
          {
            value: '0',
            label: '萤石',
          },
          {
            value: '1',
            label: '其它',
          },
        ],
        cameraType: '0',
        seen: false,
        addSeen: false,
        isCamer: false,
        isEv: false,
        showPre: false,
        orderStateList: [], // 订单状态
        gatewayTypeList: [], // 支付方式
        selecteInfo: {},
      }
    },
    mounted() {
      const vm = this
      vm.params.agentCompanyId = vm.$cookie.get(`${firmId}_company_id`)
      vm.params.schoolId = ''
      //加载列表数据
      vm.list(+this.cameraType === 0 ? EVLIST : QUERYNVRDEVICE)
      console.log('55555555555555')
    },
    methods: {
      delEv(row) {
        if (row) {
          request({
            url: `${DELEV}/${row.id}`,
            method: 'DELETE',
          }).then((res) => {
            if (+res.code === 0) {
              this.$message.success('删除成功！')
              this.list(+this.cameraType === 0 ? EVLIST : QUERYNVRDEVICE)
            }
          })
        }
      },
      look(row) {
        this.$refs.nvrDialog.init(row)
      },
      stopFuc(row, type) {
        console.log(row, '1111111111111')
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
            method: 'put',
            params: {
              id: row.id,
            },
          }).then((res) => {
            if (+res.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!',
              })
              this.list(+this.cameraType === 0 ? EVLIST : QUERYNVRDEVICE)
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
          schoolId: '',
          agentCompanyId: vm.$cookie.get(`${firmId}_company_id`),
        }
        vm.list(+this.cameraType === 0 ? EVLIST : QUERYNVRDEVICE)
      },
      editEv(row) {
        if (row) {
          this.isEv = true
          this.$nextTick(() => {
            this.$refs.ev.init(row)
          })
        }
      },

      refreshEv() {
        request({
          url: '/facility/api/ezviz/refreshName',
          method: 'post',
          params: {
            agentCompanyId: this.$cookie.get(`${firmId}_company_id`),
          },
        }).then((res) => {
          if (+res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            this.list(+this.cameraType === 0 ? EVLIST : QUERYNVRDEVICE)
          }
        })
      },

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
            this.list(+this.cameraType === 0 ? EVLIST : QUERYNVRDEVICE)
          }
        })
      },
      view(data) {
        this.showPre = false
        if (data) {
          this.selecteInfo = { ...data }
          this.showPre = true
        }
      },
      // getList(val) {
      //   request({
      //     url: '/facility/api/ezviz/queryEzvizDeviceBySchool',
      //     method: 'get',
      //     params: {
      //       agentCompanyId: this.$cookie.get(`${firmId}_company_id`),
      //     },
      //   }).then((res) => {
      //     if (+res.code === 0) {
      //       this.tableList = this.tableList.concat(res.data.list)
      //       console.log(this.tableList, '3333333333333333333333333')
      //     }
      //   })
      // },
      // 管理摄像头
      cameraManage(row) {
        console.log(row)
        this.seen = true
        this.$refs.cameraManager.init(row)
      },
      insert() {
        this.addSeen = true
        this.$nextTick(() => {
          this.$refs.edit.init()
        })
      },
      addCamer() {
        this.isCamer = true
        this.$nextTick(() => {
          this.$refs.camer.init()
        })
      },
      addEv() {
        this.isEv = true
        this.$nextTick(() => {
          this.$refs.ev.init()
        })
      },
      insertTd(val) {
        this.addSeen = true
        this.$nextTick(() => {
          this.$refs.edit.init2(val)
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
        }
        return val
      },
    },
  }
</script>

<style scoped>
  .show-pre {
    width: 900px;
    height: 500px;
  }
</style>
