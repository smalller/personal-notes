<template>
  <schoolRollDetail ref="schoolRollDetailCom" index="2"></schoolRollDetail>
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
    <ui-table-column label="幼儿寸照">
      <template #default="{ row }">
        <ui-tag :type="+row.setSchoolRoll === 1 ? 'success' : 'danger'">{{
          +row.setSchoolRoll === 1 ? "已提交" : "未提交"
        }}</ui-tag>
      </template>
    </ui-table-column>
    <ui-table-column label="学籍信息">
      <template #default="{ row }">
        <ui-tag :type="+row.setSchoolRoll === 1 ? 'success' : 'danger'">{{
          +row.setSchoolRoll === 1 ? "已提交" : "未提交"
        }}</ui-tag>
      </template>
    </ui-table-column>
    <ui-table-column prop="age" label="操作" align="right">
      <template #default="{ row }">
        <ul class="handle-box">
          <li v-if="+row.setSchoolRoll === 1">
            <ui-button type="text-blue" @click="viewSchoolRollDetail(row)"
              >学籍详情</ui-button
            >
          </li>
          <li v-else>-</li>
        </ul>
      </template>
    </ui-table-column>
  </ui-table>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import schoolRollDetail from "./SchoolRollDetail.vue";
import micell from "micell";
import { InfantTableList } from "../index";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    schoolRollDetail,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange"],
  setup(props, cxt) {
    const TABLE_DATA = computed(() => props.data);
    const schoolRollDetailCom = ref(null);

    // 勾选行事件
    const selectChange = (res: InfantTableList): void => {
      cxt.emit("selectChange", res);
    };

    // 学籍信息
    const viewSchoolRollDetail = (res: InfantTableList): void => {
      (schoolRollDetailCom.value as any).handleOpen(res);
    };

    return {
      viewSchoolRollDetail,
      selectChange,
      TABLE_DATA,
      schoolRollDetailCom,
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
