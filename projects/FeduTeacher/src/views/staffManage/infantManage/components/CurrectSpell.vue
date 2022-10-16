<template>
  <div class="currect-spell-form">
    <ui-modal
      v-model:visible="modalStatus"
      @close="handleClose"
      @ok="handleSure"
      title="正音"
      width="500"
      :tips="false"
    >
      <ui-form
        :model="ruleForm"
        label-width="54"
        :rules="staticData.rules"
        ref="formCheck"
      >
        <ui-form-item label="姓名" prop="name">
          <ui-input
            class="readonly"
            readonly
            style="width: 210px"
            v-model="ruleForm.name"
          ></ui-input>
        </ui-form-item>
        <ui-form-item label="姓名" prop="zhengyin">
          <ui-input style="width: 210px" v-model="ruleForm.zhengyin"></ui-input>
          <span class="ps">注：输入姓名相同读音的字</span>
        </ui-form-item>
      </ui-form>
      <p class="state">
        说明：例如，“杜朝阳”考勤机读作【dù zhāo yáng】，“朝”是多音字，有两个读音
        【 zhāo】和【 cháo】；正音改为“杜巢阳”，读作【dù cháo yáng】。
      </p>
    </ui-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { InfantTableList } from "../util";
import { staticData } from "../util";
import Message from "@/themes/message";
import { updateInfant } from "@/api/infantManage";
import bus from "@/Layout/bus";

export default defineComponent({
  setup() {
    const modalStatus = ref(false);
    const formCheck = ref(null);

    let ruleForm = ref({
      name: "",
      zhengyin: "",
    } as any);

    // 打开模态框
    const handleOpen = (res: InfantTableList) => {
      console.log(res);
      ruleForm.value = Object.assign({}, res);
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 修改正音
    const handleUpdateInfant = async (): Promise<void> => {
      const { code } = await updateInfant(ruleForm.value);
      if (+code === 0) {
        bus.$emit("editInfantComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("修改成功");
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          handleUpdateInfant();
        } else {
          console.log("验证失败");
        }
      });
    };

    return {
      modalStatus,
      handleSure,
      handleOpen,
      handleClose,
      ruleForm,
      staticData,
      formCheck,
    };
  },
});
</script>
<style lang="less">
.currect-spell-form {
  .ps {
    font-size: 14px;
    color: #222222;
    margin-left: 6px;
  }
  .state {
    margin-top: 22px;
    font-size: 12px;
    color: #999999;
  }
  .ui-input.readonly {
    > input {
      background-color: #f7f7f7;
    }
  }
}
</style>
