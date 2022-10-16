<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    title="监控到期时间"
    width="498"
    okText="保存"
    :tips="true"
  >
    <div class="body-text-box">
      <ui-form
        :model="ruleForm"
        :rules="rules"
        ref="formCheck"
        label-width="70"
      >
        <ui-form-item label="到期时间" prop="expireDate">
          <ui-date-picker
            style="width: 100%"
            v-model="ruleForm.expireDate"
            type="date"
            placeholder="选择监控到期时间"
          >
          </ui-date-picker>
        </ui-form-item>
      </ui-form>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import Message from "@/themes/message";
import bus from "@/Layout/bus";
import { onCamera } from "@/api/parentManage";
import micell from "micell";
import { OnCamera, RowInfo } from "../index";

export default defineComponent({
  setup() {
    const $store = useStore();
    const classList = $store.state.commonData.classList; // 班级列表
    const formCheck = ref(null);
    let checkRowInfo = ref([] as Array<RowInfo>); // 已勾选的行信息
    const modalStatus = ref(false);
    let ruleForm = ref({
      expireDate: "",
    });
    const rules = ref({
      expireDate: [
        {
          type: "date",
          required: true,
          message: "请选择监控到期时间",
          trigger: "blur",
        },
      ],
    });

    // 打开模态框
    const handleOpen = (res: Array<RowInfo>, index?: number) => {
      // 如果是通过点击表格中的监控到期时间进来的
      if (index === 1) {
        ruleForm.value.expireDate = res[0].cameraExpireTime;
      }
      checkRowInfo.value = res;
      modalStatus.value = true;
    };

    const handleClose = () => {
      modalStatus.value = false;
      ruleForm.value.expireDate = "";
    };

    // 转换时间格式
    const selectDate = () => {
      if (ruleForm.value.expireDate) {
        ruleForm.value.expireDate = micell.date.format(
          ruleForm.value.expireDate as Date | string,
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    };

    // 设置监控时间
    const handleSetMonDate = async (): Promise<void> => {
      let arr: Array<OnCamera> = [];
      checkRowInfo.value.forEach((item) => {
        let obj = {
          cameraStatus: true,
          expireTime: ruleForm.value.expireDate,
          userId: item.userId,
        };
        arr.push(obj);
      });
      const { code } = await onCamera(arr);
      if (+code === 0) {
        Message.success("开通成功");
        modalStatus.value = false;
        bus.$emit("editParentComplete", true); // 通知更新表格
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          selectDate();
          handleSetMonDate();
          ruleForm.value.expireDate = "";
          console.log("验证成功");
        } else {
          console.log("验证失败");
        }
      });
    };

    return {
      handleClose,
      handleSure,
      handleOpen,
      classList,
      rules,
      formCheck,
      modalStatus,
      ruleForm,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  margin: 20px 0 40px 0;
  // display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
