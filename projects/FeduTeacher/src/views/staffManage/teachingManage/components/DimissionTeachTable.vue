<template>
  <EditStaff ref="editStaffCom"></EditStaff>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">点击确定后需要重新编辑相关信息和权限</div>
  </ui-modal>
  <ui-table :data="TABLE_DATA" @selectChange="selectChange" :checkbox="true">
    <ui-table-column label="教职工姓名">
      <template #default="{ row }">
        <div class="name-box">
          <img
            class="avatar"
            :src="
              row.headPortraitUrl
                ? row.headPortraitUrl
                : require('@/assets/staff-avatar.png')
            "
            alt=""
          />
          <span>{{ row.name || "-" }}</span>
        </div>
      </template>
    </ui-table-column>
    <ui-table-column prop="mobile" label="手机号"> </ui-table-column>
    <ui-table-column prop="title" label="称谓"></ui-table-column>
    <ui-table-column label="角色">
      <template #default="{ row }">
        <span v-for="(item, index) in row.roleNames" :key="index">{{
          index == row.roleNames.length - 1 ? item : item + "、"
        }}</span>
      </template>
    </ui-table-column>
    <ui-table-column label="所在班级">
      <template #default="{ row }">
        <span v-for="(item, index) in row.clazzes" :key="item.clazzId">{{
          index == row.clazzes.length - 1
            ? item.clazzName
            : item.clazzName + "、"
        }}</span>
      </template>
    </ui-table-column>
    <ui-table-column label="电脑端登录">
      <template #default="{ row }">
        <ui-tag :type="+row.allowLoginPC === 1 ? 'success' : 'danger'">{{
          +row.allowLoginPC === 1 ? "允许" : "禁止"
        }}</ui-tag>
      </template>
    </ui-table-column>
    <ui-table-column label="开通权限">
      <template #default="{ row }">
        <div class="limits-box">
          <span v-if="row.noticeDynamicScope == 1">发动态</span>
          <span v-if="row.noticeClazzScope == 1">发班级通知</span>
          <span v-if="row.noticeScope == 1">发全园通知</span>
        </div>
      </template>
    </ui-table-column>
    <ui-table-column label="入驻App" tips=" ">
      <template #default="{ row }">
        <ui-tag :type="row.settleApp === '1' ? 'success' : 'danger'">
          {{ row.settleApp === "1" ? "已入驻" : "未入驻" }}
        </ui-tag>
      </template>
    </ui-table-column>
    <ui-table-column prop="onboard" label="入职时间"></ui-table-column>
    <ui-table-column prop="resignationTime" label="离职时间"></ui-table-column>
    <ui-table-column label="操作" align="right">
      <template #default="{ row }">
        <ul class="handle-box">
          <li>
            <ui-button type="text-blue" @click="handleAnewEntry(row)"
              >重新入职</ui-button
            >
          </li>
        </ul>
      </template>
    </ui-table-column>
  </ui-table>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import EditStaff from "./EditStaff.vue";
import { updateStaff } from "@/api/teachingManage";
import { StaffTableList } from "../util";
import bus from "@/Layout/bus";
import Message from "@/themes/message";

export default defineComponent({
  components: { EditStaff },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);
    const modalStatus = ref(false);
    const editStaffCom = ref(null);
    const rowInfo = ref({} as StaffTableList); // 行信息
    let title = ref("");

    // 勾选行事件
    const selectChange = (res: Array<StaffTableList>): void => {
      cxt.emit("selectChange", res);
    };

    // 重新入职操作
    const handleBackIntoJob = async (data: StaffTableList): Promise<void> => {
      const { code } = await updateStaff(data);
      if (+code === 0) {
        bus.$emit("editStaffComplete", true); // 通知更新表格
        Message.success("成功重新入职");
        (editStaffCom.value as any).handleOpen(2, rowInfo.value);
        modalStatus.value = false;
      }
    };

    // 重新入职
    const handleAnewEntry = (res: StaffTableList): void => {
      title.value = `确认将 ${res.name} 重新入职吗？`;
      modalStatus.value = true;
      res.jobStatus = "1";
      rowInfo.value = res;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 确认按钮
    const handleSure = () => {
      handleBackIntoJob(rowInfo.value);
    };

    return {
      handleAnewEntry,
      selectChange,
      editStaffCom,
      TABLE_DATA,
      modalStatus,
      handleClose,
      handleSure,
      title,
    };
  },
});
</script>
<style lang="less" scoped>
.handle-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > li {
    margin-left: 16px;
  }
}
.body-text-box {
  margin: 28px 0 40px 0;
  font-size: 14px;
  color: #f56060;
}

.limits-box {
  > span {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.name-box {
  display: flex;
  align-items: center;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
