<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    width="498"
    title="新增职位"
    tips="提示：新增的职位可在【设置中心】编辑或删除"
  >
    <div class="body-text-box">
      <ui-form
        :model="ruleForm"
        :rules="rules"
        ref="formCheck"
        label-width="110"
      >
        <ui-form-item label="职位名称" prop="postName">
          <ui-input
            maxlength="40"
            v-model="ruleForm.postName"
            placeholder="请输入职位名称"
          ></ui-input>
        </ui-form-item>
      </ui-form>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";

export default defineComponent({
  name: "",

  setup(props, ctx) {
    const formCheck = ref(null);

    const baseData = reactive({
      modalStatus: false,
      ruleForm: {
        postName: "",
      },
    });

    const rules = ref({
      postName: [
        { required: true, message: "请输入职位名称", trigger: "blur" },
      ],
    });

    // 打开模态框
    const handleOpen = () => {
      baseData.modalStatus = true;
    };

    // 初始化数据
    const initData = (): void => {
      baseData.ruleForm = {
        postName: "",
      };
    };

    // 取消按钮
    const handleClose = () => {
      baseData.modalStatus = false;
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          console.log(baseData.ruleForm);
          baseData.modalStatus = false;
          initData();
        } else {
          console.log("验证失败");
        }
      });
    };

    return {
      ...toRefs(baseData),
      handleClose,
      handleSure,
      handleOpen,
      rules,
      formCheck,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  margin: 28px 0 40px 0;
}
</style>
