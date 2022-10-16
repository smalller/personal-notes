<template>
  <ui-modal
    v-model:visible="visible"
    okText="保存"
    :tips="false"
    :title="isEdit ? '编辑行程' : '新增行程'"
    @close="close"
    @ok="addOrEditTrip"
    width="580"
  >
    <ui-form ref="form" :model="formData" :rules="rules" label-width="82px">
      <ui-form-item label="行程名称" prop="name">
        <ui-input
          style="width: 274px"
          v-model="formData.name"
          placeholder="输入行程名称"
        />
      </ui-form-item>
      <ui-form-item label="行程描述">
        <ui-input
          v-model="formData.description"
          style="width: 432px; height: 100px"
          placeholder="输入行程描述"
          type="textarea"
        />
      </ui-form-item>
    </ui-form>
  </ui-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, reactive, ref } from "vue";
import { CreateOrEditTripParams } from "@/views/bus/tripManagement/interface";
import { createOrEditTrip } from "@/api/bus";
import { ElMessage } from "element-plus";

const $emit = defineEmits(["success"]);

const isEdit = ref(false);
const visible = ref(false);

const formData = reactive<CreateOrEditTripParams>({
  name: "",
  description: "",
});

const rules = reactive({
  name: [{ required: true, message: "请输入行程名称", trigger: "blur" }],
});

const form = ref(null);

const addOrEditTrip = () => {
  (form.value as any)?.validate((valid: boolean) => {
    if (valid) {
      createOrEditTrip(formData).then((res) => {
        if (+res.code === 0) {
          close();
          $emit("success");
          ElMessage.success("保存成功");
        } else {
          ElMessage.warning(res.msg);
        }
      });
    }
  });
};

const open = (data: any) => {
  isEdit.value = false;
  if (data) {
    isEdit.value = true;
    formData.name = data.name;
    formData.description = data.description;
    formData.id = data.id;
  }
  visible.value = true;
};
const close = () => {
  visible.value = false;
  reset();
};
const reset = () => {
  formData.name = "";
  formData.description = "";
  delete formData.id;
};

defineExpose({
  open,
});
</script>

<style scoped></style>
