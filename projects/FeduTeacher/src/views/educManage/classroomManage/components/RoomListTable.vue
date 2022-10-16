<template>
  <ui-table :data="TABLE_DATA" @selectChange="selectChange" :checkbox="true">
    <ui-table-column prop="name" label="教室名称"> </ui-table-column>
    <ui-table-column prop="number" label="教室编号"></ui-table-column>
    <ui-table-column prop="capacity" label="容纳人数"></ui-table-column>
    <ui-table-column prop="capacity" label="状态">
      <template #default="{ row }">
        <span v-if="row.isUse === 1">启用中</span>
        <span v-else style="color: #f56060">停用中</span>
      </template>
    </ui-table-column>

    <ui-table-column label="操作" align="right">
      <template #default="{ row }">
        <ul class="handle-box">
          <li>
            <ui-button type="text-blue" @click="handleEdit(row)"
              >修改</ui-button
            >
          </li>
          <li>
            <ui-button type="text-blue" @click="handleChangeStatus(row)">{{
              row.isUse === 1 ? "停用" : "启用"
            }}</ui-button>
          </li>
        </ul>
      </template>
    </ui-table-column>
  </ui-table>
  <editRoom ref="editRoomCom"></editRoom>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    title="确定要停用该教室吗？"
    :tips="false"
  >
    <div class="body-text-box">停用后新的课程将不能选择使用，请慎重！</div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import micell from "micell";
import { ListRow } from "../index";
import Message from "@/themes/message";
import editRoom from "./EditRoom.vue";
import { forbidden } from "@/api/classroomManage";

export default defineComponent({
  components: {
    editRoom,
  },
  props: {
    data: {
      type: Array,
    },
  },
  emits: ["selectChange", "updateList"],
  setup(props, cxt) {
    const modalStatus = ref(false);
    const TABLE_DATA = computed(() => props.data);
    const editRoomCom = ref(null);
    const targetId = ref("");

    // 勾选行事件
    const selectChange = (res: ListRow): void => {
      cxt.emit("selectChange", res);
    };

    // 修改教室
    function handleEdit(res: ListRow) {
      (editRoomCom.value as any).handleOpen(2, res);
    }

    // 修改启停状态
    function handleChangeStatus(res: ListRow) {
      targetId.value = res.id;
      if (+res.isUse === 1) {
        modalStatus.value = true;
      } else {
        handleSure();
      }
    }

    // 确认按钮
    const handleSure = async (): Promise<void> => {
      const { code, msg } = await forbidden(targetId.value);
      if (+code === 0) {
        cxt.emit("updateList");
        Message.success(msg);
        modalStatus.value = false;
      }
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    return {
      selectChange,
      TABLE_DATA,
      editRoomCom,
      micell,
      handleEdit,
      handleChangeStatus,
      modalStatus,
      handleSure,
      handleClose,
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

.body-text-box {
  margin: 28px 0 40px 0;
  font-size: 14px;
  color: #f56060;
  margin-bottom: 10px;
}
</style>
