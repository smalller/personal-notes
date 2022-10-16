<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="`确定将 ${title} 毕业吗？`"
    width="420"
    :tips="false"
  >
    <div class="body-text-box">
      <p>毕业后相关幼儿考勤卡将无法使用</p>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { infantGraduate } from "@/api/infantManage";
import bus from "@/Layout/bus";
import Message from "@/themes/message";

export default defineComponent({
  name: "",
  setup() {
    const modalStatus = ref(false);
    const title = ref("");
    const studentId = ref("");

    // 打开模态框
    const handleOpen = (res: any) => {
      title.value = res.name;
      studentId.value = res.id;
      modalStatus.value = true;
    };

    const handleGraduate = async (id: string): Promise<void> => {
      const { code } = await infantGraduate(id);
      if (+code === 0) {
        bus.$emit("editInfantComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("操作成功");
      }
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 确认操作
    const handleSure = () => {
      handleGraduate(studentId.value);
    };

    return {
      handleOpen,
      handleClose,
      modalStatus,
      handleSure,
      title,
    };
  },
});
</script>
<style lang="less" scoped>
.body-text-box {
  margin: 28px 0 40px 0;
  color: #f56060;
  font-size: 14px;
}
</style>
