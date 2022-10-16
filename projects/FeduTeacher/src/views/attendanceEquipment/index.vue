<template>
  <div class="attendanceEquipment">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <div class="headBox">
        <el-form
          :model="queryForm"
          inline
          label-position="left"
          label-width="70px"
        >
          <el-form-item label="设备号">
            <ui-input v-model="queryForm.id"></ui-input>
          </el-form-item>
          <el-form-item>
            <ui-button type="primary" @click="query">查询</ui-button>
            <ui-button style="margin-left: 10px" @click="reset">重置</ui-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <ui-table :data="list">
          <ui-table-column label="设备名称" prop="name"></ui-table-column>
          <ui-table-column label="设备号" prop="id"></ui-table-column>
          <ui-table-column label="mac地址" prop="macAddress"></ui-table-column>
          <ui-table-column label="设备IP" prop="deviceIp"></ui-table-column>
          <ui-table-column label="设备时间" prop="deviceTime"></ui-table-column>
          <ui-table-column
            label="同步时间"
            prop="synchroTime"
          ></ui-table-column>
          <ui-table-column label="同步状态">
            <template #default="{ row }">
              <el-tag
                :type="
                  row.deviceSynStatus.describe === '已完成' ? 'success' : ''
                "
              >
                {{ row.deviceSynStatus.describe }}
              </el-tag>
            </template>
          </ui-table-column>
          <ui-table-column label="设备状态">
            <template #default="{ row }">
              <el-tag
                :type="row.actionType.describe === '离线' ? 'danger' : ''"
              >
                {{ row.actionType.describe }}
              </el-tag>
            </template>
          </ui-table-column>
          <ui-table-column label="操作" align="right" width="340">
            <template #default="{ row }">
              <div
                v-if="!!row.schoolId"
                style="display: inline-block; margin-left: 10px"
              >
                <el-button
                  type="text"
                  style="margin-right: 10px"
                  @click="deviceSynTimes(row)"
                >
                  刷新时间
                </el-button>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  title="确定重启设备吗？"
                  @confirm="reDevices(row)"
                >
                  <template #reference>
                    <el-button style="margin-right: 10px" type="text">
                      重启设备
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  title="确定重启应用吗？"
                  @confirm="reAppDevices(row)"
                >
                  <template #reference>
                    <el-button style="margin-right: 10px" type="text">
                      重启应用
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  title="确定同步用户吗？"
                  @confirm="syncDeviceUsers(row)"
                >
                  <template #reference>
                    <el-button style="margin-right: 10px" type="text">
                      同步用户
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </ui-table-column>
        </ui-table>
        <ui-pagination
          :total="pageForm.totalNum"
          :currentPage="pageForm.pageNo"
          :pageSize="pageForm.pageSize"
          @handleCurrentChange="pageChange"
          @handleSizeChange="pageSizeChange"
        >
        </ui-pagination>
      </div>
    </ui-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import {
  deviceSynTime,
  QueryAttendanceMachine,
  reAppDevice,
  reDevice,
  syncDeviceUser,
} from "@/api/attendanceManagement";
import Message from "@/themes/message/index";
import type { PageForm } from "@/api/interface";

export default defineComponent({
  name: "attendanceEquipment",
  setup() {
    const route = useRoute();
    const pageForm = reactive<PageForm>({
      pageNo: 1,
      pageSize: 20,
      totalNum: 0,
    });
    type Device = {
      id: string;
      macAddress: string;
      deviceIp: string;
      relName: string;
      relTelephone: string;
      deviceTime: string;
      synchroTime: string;
    };
    type Form = {
      id: string;
      schoolId: string;
      firmName: string;
    };
    const queryForm = reactive<Form>({
      id: "",
      schoolId: sessionStorage.getItem("schoolId") as string,
      firmName: "HIOT_HAIOU",
    });
    let list = ref<Device[]>([]);
    const reset = () => {
      queryForm.id = "";
      query();
    };

    /**
     * 翻页
     * @param page
     */
    const pageChange = (page: number) => {
      pageForm.pageNo = page;
      query();
    };

    /**
     * pageSize修改
     * @param pageSize
     */
    const pageSizeChange = (pageSize: number) => {
      pageForm.pageSize = pageSize;
      query();
    };

    interface DeviceParams {
      macAddress: string;
    }

    const deviceSynTimes = (item: DeviceParams) => {
      deviceSynTime({
        macAddr: item.macAddress,
      }).then((res) => {
        if (+res.code === 0) {
          Message.success("刷新时间成功");
          query();
        } else {
          Message.warning(res.msg);
        }
      });
    };

    const reAppDevices = (item: DeviceParams) => {
      reAppDevice({
        macAddr: item.macAddress,
      }).then((res) => {
        if (+res.code === 0) {
          Message.success("重启应用成功");
          query();
        } else {
          Message.warning(res.msg);
        }
      });
    };

    const reDevices = (item: DeviceParams) => {
      reDevice({
        macAddr: item.macAddress,
      }).then((res) => {
        if (+res.code === 0) {
          Message.success("重启设备成功");
          query();
        } else {
          Message.warning(res.msg);
        }
      });
    };

    const syncDeviceUsers = (item: DeviceParams) => {
      syncDeviceUser({
        macAddr: item.macAddress,
      }).then((res) => {
        if (+res.code === 0) {
          Message.success("修改成功");
          query();
        } else {
          Message.warning(res.msg);
        }
      });
    };

    const query = () => {
      type ParamsData = PageForm & Form;
      const formData: ParamsData = Object.assign(queryForm, pageForm);
      for (const formDataKey in formData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!formData[formDataKey]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete formData[formDataKey];
        }
      }
      QueryAttendanceMachine(formData).then((res) => {
        if (+res.code === 0) {
          list.value = res.data.list;
          pageForm.totalNum = +res.data.page.totalNum;
        }
      });
    };
    query();
    return {
      queryForm,
      pageForm,
      list,
      route,
      reset,
      query,
      pageChange,
      pageSizeChange,
      deviceSynTimes,
      reAppDevices,
      reDevices,
      syncDeviceUsers,
    };
  },
});
</script>

<style scoped lang="less">
.attendanceEquipment {
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 20px;
  }
  .content {
  }
}
</style>
