<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    :width="width"
    :tips="true"
  >
    <div class="body-text-box">
      <ui-form
        :model="ruleForm"
        :rules="rules"
        ref="formCheck"
        label-width="70"
      >
        <ui-form-item label="转入班级" prop="changedClass">
          <ui-select
            filterable
            style="width: 100%"
            v-model="ruleForm.changedClass"
            placeholder="请选择要转入的班级"
            class="select-box"
          >
            <ui-select-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </ui-select-option>
          </ui-select>
        </ui-form-item>
      </ui-form>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { useStore } from "vuex";
import { infantChangeClass } from "@/api/infantManage";
import Message from "@/themes/message";
import bus from "@/Layout/bus";

interface logoutIdentityBaseDate {
  modalStatus: boolean;
  title: string;
  ruleForm: {
    changedClass: string;
  };
}

export default defineComponent({
  props: {
    width: {
      type: [String, Number],
    },
  },

  setup(props, ctx) {
    const $store = useStore();
    const classList = $store.state.commonData.classList; // 班级列表
    const formCheck = ref(null);
    let checkRowInfo = ref<any[]>([]); // 已勾选的行信息

    const baseData: logoutIdentityBaseDate = reactive({
      modalStatus: false,
      title: "",
      ruleForm: {
        changedClass: "",
      },
    });

    const rules = ref({
      changedClass: [
        { required: true, message: "请选择班级", trigger: "blur" },
      ],
    });

    // 打开模态框
    const handleOpen = (res: Array<any>) => {
      if (res.length === 1) {
        baseData.title = `确认将勾选的 ${res[0].name} 幼儿转班？`;
      } else {
        baseData.title = `确认将勾选的${res.length}个幼儿转班？`;
      }
      checkRowInfo.value = res;
      baseData.modalStatus = true;
    };

    // 取消按钮
    const handleClose = () => {
      baseData.modalStatus = false;
    };

    // 转班操作
    const handleInfantChangeClass = async (): Promise<void> => {
      const ids = checkRowInfo.value.map((item) => item.id).join(",");
      const { code } = await infantChangeClass(
        baseData.ruleForm.changedClass,
        ids
      );
      if (+code === 0) {
        Message.success("转班成功");
        // eslint-disable-next-line require-atomic-updates
        baseData.modalStatus = false;
        bus.$emit("editInfantComplete", true); // 通知更新表格
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          handleInfantChangeClass();
          console.log("验证成功");
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
      classList,
      rules,
      formCheck,
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
