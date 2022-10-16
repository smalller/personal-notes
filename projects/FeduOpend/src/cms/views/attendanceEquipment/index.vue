<template>
  <div class="attendanceEquipment">
    <div class="head">
      <el-form
        :model="queryForm"
        inline
        label-position="left"
        label-width="70px"
      >
        <div>
          <el-form-item label="设备号">
            <el-input v-model="queryForm.id"></el-input>
          </el-form-item>
          <el-form-item label="园所ID">
            <el-input v-model="queryForm.schoolId"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="list">
        <el-table-column label="设备号" prop="id"></el-table-column>
        <el-table-column label="mac地址" prop="macAddress"></el-table-column>
        <el-table-column label="设备IP" prop="deviceIp"></el-table-column>
        <el-table-column label="园所ID" prop="schoolId"></el-table-column>
        <el-table-column label="园所名称" prop="schoolName"></el-table-column>
        <el-table-column label="代理商名称" prop="relName"></el-table-column>
        <el-table-column
          label="代理商电话"
          prop="relTelephone"
        ></el-table-column>
        <el-table-column label="设备时间" prop="deviceTime"></el-table-column>
        <el-table-column label="同步时间" prop="synchroTime"></el-table-column>
        <el-table-column
          label="同步状态"
          prop="synchroStatus.describe"
        ></el-table-column>
        <el-table-column
          label="设备状态"
          prop="actionType.describe"
        ></el-table-column>
        <el-table-column label="操作" align="right" width="340">
          <template #default="{ row }">
            <!--            <el-button-->
            <!--              :type="row.upStatus ? 'danger' : 'primary'"-->
            <!--              @click="upOrDownAds(row.id, row.upStatus)"-->
            <!--            >-->
            <!--              {{ row.upStatus ? '下架' : '上架' }}-->
            <!--            </el-button>-->
            <el-button type="text" @click="bindSchool(row)">
              {{ !row.schoolId ? '绑定学校' : '更改学校' }}
            </el-button>
            <div
              v-if="!!row.schoolId"
              style="display: inline-block; margin-left: 10px"
            >
              <el-button
                type="text"
                style="margin-right: 10px"
                @click="deviceSynTime(row)"
              >
                刷新时间
              </el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                title="确定重启设备吗？"
                @confirm="reDevice(row)"
              >
                <el-button
                  slot="reference"
                  style="margin-right: 10px"
                  type="text"
                >
                  重启设备
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                title="确定重启应用吗？"
                @confirm="reAppDevice(row)"
              >
                <el-button
                  slot="reference"
                  style="margin-right: 10px"
                  type="text"
                >
                  重启应用
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                title="确定同步用户吗？"
                @confirm="syncDeviceUser(row)"
              >
                <el-button
                  slot="reference"
                  style="margin-right: 10px"
                  type="text"
                >
                  同步用户
                </el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page="+pageForm.pageNo"
      :layout="'total, sizes, prev, pager, next, jumper'"
      :page-size="+pageForm.pageSize"
      :total="+pageForm.totalNum"
      background
      @current-change="pageChange"
      @size-change="sizeChange"
    ></el-pagination>
    <school-select ref="schoolSelect" @select="select"></school-select>
  </div>
</template>

<script>
  import {
    ChangeAttendanceMachine,
    deviceSynTime,
    QueryAttendanceMachine,
    reAppDevice,
    reDevice,
    syncDeviceUser,
  } from '@/cms/api/attendanceMachine'
  import SchoolSelect from '@/cms/views/attendanceEquipment/components/schoolSelect'

  export default {
    name: 'Index',
    components: { SchoolSelect },
    data() {
      return {
        queryForm: {
          firmName: 'HIOT_HAIOU',
        },
        pageForm: {
          pageNo: 1,
          pageSize: 20,
        },
        list: [],
      }
    },
    created() {
      this.query()
    },
    methods: {
      select(opt) {
        const formData = {
          schoolId: opt.school.id,
          schoolName: opt.school.name,
          relName: opt.school.agentContactName,
          relTelephone: opt.school.contacts,
          id: opt.data.id,
          firmName: opt.data.firmName,
          machineNo: opt.data.id,
          // machineNo: opt.data.machineNo,
          machineVersion: opt.data.machineVersion,
          name: opt.data.name,
        }
        ChangeAttendanceMachine(formData).then((res) => {
          if (+res.code === 0) {
            this.query()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      pageChange(page) {
        this.pageForm.pageNo = page
        this.query()
      },
      sizeChange(size) {
        this.pageForm.pageSize = size
        this.query()
      },
      bindSchool(item) {
        this.$refs.schoolSelect.open(item)
      },
      reset() {
        this.queryForm = {
          firmName: 'HIOT_HAIOU',
        }
        this.pageForm.pageNo = 1
        this.pageForm.pageSize = 20
        this.query()
      },
      query() {
        if (!!this.queryForm.schoolId) {
          this.queryForm.schoolId = this.queryForm.schoolId.trim()
        }
        const formData = Object.assign(this.queryForm, this.pageForm)
        for (const formDataKey in formData) {
          if (!formData[formDataKey]) {
            delete formData[formDataKey]
          }
        }
        QueryAttendanceMachine(formData).then((res) => {
          if (+res.code === 0) {
            console.log(res)
            this.list = res.data.list
            this.pageForm.totalNum = res.data.page.totalNum
          }
        })
      },
      deviceSynTime(item) {
        deviceSynTime({
          macAddr: item.macAddress,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('刷新时间成功')
            this.query()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      reAppDevice(item) {
        reAppDevice({
          macAddr: item.macAddress,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('重启应用成功')
            this.query()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      reDevice(item) {
        reDevice({
          macAddr: item.macAddress,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('重启设备成功')
            this.query()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
      syncDeviceUser(item) {
        syncDeviceUser({
          macAddr: item.macAddress,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('修改成功')
            this.query()
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .attendanceEquipment {
    > div {
      box-sizing: border-box;
      padding: 30px 30px 0;
    }
    .head {
    }
    .content {
    }
  }
</style>
