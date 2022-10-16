<template>
  <ParentsManage ref="parentManageCom" index="2"></ParentsManage>
  <ui-table :data="TABLE_DATA" @selectChange="selectChange" :checkbox="true">
    <ui-table-column label="幼儿姓名">
      <template #default="{ row }">
        <div class="name-box">
          <img
            class="avatar"
            :src="
              row.headerImgUrl
                ? row.headerImgUrl
                : require('@/assets/infant-avatar.png')
            "
            alt=""
          />
          <span>{{ row.name || "-" }}</span>
        </div>
      </template>
    </ui-table-column>
    <ui-table-column prop="contacts" label="家长电话"> </ui-table-column>
    <ui-table-column label="性别">
      <template #default="{ row }">
        <span>{{ row.sex === 1 ? "男" : "女" }}</span>
      </template>
    </ui-table-column>
    <ui-table-column prop="birthTime" label="出生年月"></ui-table-column>
    <ui-table-column prop="clazzName" label="所在班级"></ui-table-column>
    <ui-table-column label="入驻App" tips=" ">
      <template #default="{ row }">
        <ui-tag :type="row.settleApp === '1' ? 'success' : 'danger'">
          {{ row.settleApp === "1" ? "已入驻" : "未入驻" }}
        </ui-tag>
      </template>
    </ui-table-column>
    <ui-table-column label="入园时间">
      <template #default="{ row }">
        <span>{{
          row.createTime ? dayjs(row.createTime).format("YYYY-MM-DD") : ""
        }}</span>
      </template>
    </ui-table-column>
    <ui-table-column label="毕业时间">
      <template #default="{ row }">
        <span>{{
          row.graduateTime ? dayjs(row.graduateTime).format("YYYY-MM-DD") : ""
        }}</span>
      </template>
    </ui-table-column>
    <ui-table-column prop="age" label="操作" align="right">
      <template #default="{ row }">
        <ul class="handle-box">
          <li>
            <ui-button type="text-blue" @click="parentsManage(row)"
              >家长管理</ui-button
            >
          </li>
        </ul>
      </template>
    </ui-table-column>
  </ui-table>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import ParentsManage from "./ParentsManage.vue";
import micell from "micell";
import { InfantTableList } from "../util";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    ParentsManage,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);
    const parentManageCom = ref(null);

    // 勾选行事件
    const selectChange = (res: InfantTableList): void => {
      cxt.emit("selectChange", res);
    };

    // 家长管理
    const parentsManage = (res: InfantTableList): void => {
      (parentManageCom.value as any).handleOpen(res);
    };

    return {
      parentsManage,
      selectChange,
      TABLE_DATA,
      parentManageCom,
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

.not-submit {
  font-size: 14px;
  color: #f56060;
}
</style>
