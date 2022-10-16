<template>
  <div class="attendanceRobot">
    <el-card>
      <el-form inline>
        <el-form-item label="设备编号">
          <el-input />
        </el-form-item>
        <el-form-item label="幼儿园">
          <el-input />
        </el-form-item>
        <el-form-item label="代理商名称">
          <el-input />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" @click="addDevice">新增设备</el-button>
      <el-table style="margin-top: 10px">
        <el-table-column label="设备编号/序列号/ID" />
        <el-table-column label="设备类型" />
        <el-table-column label="设备型号" />
        <el-table-column label="设备名称" />
        <el-table-column label="幼儿园ID" />
        <el-table-column label="幼儿园名称" />
        <el-table-column label="代理商名称" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="openSelectSchool">绑定</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定解除学校绑定吗？"
              @confirm="unbind(row)"
            >
              <el-button slot="reference" type="danger">解绑</el-button>
            </el-popconfirm>
            <el-button type="text">同步数据</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除这个设备吗？"
              @confirm="deleteDevice(row)"
            >
              <el-button slot="reference" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageForm.pageNo"
        :page-size="pageForm.pageSize"
        :total="pageForm.total"
        background
        @current-change="pageChange"
        @size-change="pageSizeChange"
      ></el-pagination>
    </el-card>
    <select-school ref="selectSchool" />
    <add-device ref="addDevice" />
  </div>
</template>

<script>
  import SelectSchool from './components/selectSchool'
  import AddDevice from '@/cms/views/attendanceRobot/components/addDevice'
  export default {
    name: 'Index',
    components: { AddDevice, SelectSchool },
    data() {
      return {
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        list: [],
        formData: {},
      }
    },
    methods: {
      pageChange(page) {
        this.pageForm.pageNo = page
      },
      pageSizeChange(size) {
        this.pageForm.pageSize = size
      },
      openSelectSchool() {
        this.$refs.selectSchool.open()
      },
      unbind(row) {},
      deleteDevice(row) {},
      addDevice() {
        this.$refs.addDevice.open()
      },
    },
  }
</script>

<style scoped></style>
