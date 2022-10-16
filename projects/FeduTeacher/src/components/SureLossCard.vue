<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="'确定挂失考勤卡 ' + userInfo.outNumber + ' 吗？'"
    :maskClose="true"
    :tips="false"
  >
    <div class="text-box">
      <p>已绑定的账号：{{ userInfo.name }} {{ userInfo.phone }}</p>
      <p>挂失后考勤卡将无法使用，若再次使用需重新恢复</p>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { closeCard } from "@/api/common";
import Message from "@/themes/message";

interface UserInfo {
  outNumber: string;
  name: string;
  phone: string;
}

export default defineComponent({
  emits: ["updateCardList"],
  setup(props, { emit }) {
    const modalStatus = ref(false);
    const userInfo = ref({} as UserInfo);

    async function handleChangeCradStatus(): Promise<void> {
      const { code } = await closeCard({ outNumber: userInfo.value.outNumber });
      if (+code === 0) {
        emit("updateCardList");
        Message.success("挂失成功");
        modalStatus.value = false;
      }
    }

    // 打开模态框
    const handleOpen = (res: any) => {
      userInfo.value = res;
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 确认按钮
    const handleSure = () => {
      handleChangeCradStatus();
    };

    return {
      modalStatus,
      userInfo,
      handleClose,
      handleSure,
      handleOpen,
    };
  },
});
</script>

<style lang="less" scoped>
.text-box {
  margin: 28px 0 40px 0;
  color: #f56060;
  font-size: 14px;
}
</style>
