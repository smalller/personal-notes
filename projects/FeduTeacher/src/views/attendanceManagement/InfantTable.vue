<template>
  <ui-table :data="TABLE_DATA">
    <ui-table-column prop="contacts">
      <template #default="{ row }">
        <ui-radio
          v-model="checkedRow.id"
          :label="row.id"
          @click="handleCheckRow(row)"
          >{{}}</ui-radio
        >
      </template>
    </ui-table-column>
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
    <ui-table-column prop="clazzName" label="所在班级"></ui-table-column>
    <ui-table-column label="绑定状态">
      <template #default="{ row }">
        <ui-tag :type="row.faceId ? 'success' : 'danger'">
          {{ row.faceId ? "已绑定" : "未绑定" }}
        </ui-tag>
      </template>
    </ui-table-column>
  </ui-table>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { InfantTableList } from "../staffManage/infantManage/util";

export default defineComponent({
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["getCheckedRow"],
  setup(props, { emit }) {
    const TABLE_DATA = computed(() => props.data);
    let checkedRow = ref({} as InfantTableList);

    function handleCheckRow(row: InfantTableList) {
      checkedRow.value = row;
      emit("getCheckedRow", row);
    }

    return {
      TABLE_DATA,
      checkedRow,
      handleCheckRow,
    };
  },
});
</script>
<style lang="less" scoped>
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
