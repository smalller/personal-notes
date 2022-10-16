<template>
  <BindTimeCard ref="bindTimeCardCom"></BindTimeCard>
  <EditStaff ref="editStaffCom"></EditStaff>
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
          <span>{{ row.name }}</span>
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
    <ui-table-column label="入职时间">
      <template #default="{ row }">
        <span>{{
          row.onboard ? dayjs(row.onboard).format("YYYY-MM-DD") : ""
        }}</span>
      </template>
    </ui-table-column>
    <ui-table-column label="操作" align="right">
      <template #default="{ row }">
        <ul class="handle-box">
          <li>
            <ui-button type="text-blue" @click="handleEdit(row)"
              >编辑</ui-button
            >
          </li>
          <li>
            <ui-button type="text-blue" @click="bindTimeCard(row)"
              >绑定考勤卡</ui-button
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
import BindTimeCard from "@/components/BindTimeCard.vue";
import micell from "micell";
import { StaffTableList } from "../util";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    EditStaff,
    BindTimeCard,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);

    const editStaffCom = ref(null);
    const bindTimeCardCom = ref(null);

    // 勾选行事件
    const selectChange = (res: Array<StaffTableList>): void => {
      cxt.emit("selectChange", res);
    };

    // 编辑员工
    const handleEdit = (res: StaffTableList): void => {
      (editStaffCom.value as any).handleOpen(2, res);
    };

    // 绑定考勤卡
    const bindTimeCard = (res: StaffTableList): void => {
      (bindTimeCardCom.value as any).handleOpen(1, res);
    };

    return {
      handleEdit,
      bindTimeCard,
      selectChange,
      editStaffCom,
      bindTimeCardCom,
      TABLE_DATA,
      micell,
      dayjs,
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
