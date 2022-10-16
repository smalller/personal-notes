<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  ref,
  onUnmounted,
  onBeforeUnmount,
  inject,
} from "vue";
import { CallBack, FormItemInfo } from "./token";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "ui-form",

  props: {
    model: Object,
    rules: Object,
    labelWidth: String,
  },

  setup(props) {
    // 暴露所有props属性
    provide("formProps", props);

    const formItemArr = ref<FormItemInfo[]>([]);

    // 订阅所有子组件form-item中的属性与验证方法，并且筛选出要验证的item
    bus.$on("formItemInfo", (res: FormItemInfo) => {
      if (res.prop) {
        formItemArr.value.push(res);
      }
    });

    // 当form-item销毁时，跟着把formItemArr里对应的值也给删掉
    function deleteFormItemArr(): void {
      formItemArr.value.forEach((it, index) => {
        if (it.label === "教室名称" && formItemArr.value.length !== 1) {
          formItemArr.value.splice(index, 1);
        }
      });
    }

    onUnmounted(() => {
      formItemArr.value = [];
      bus.$off("formItemInfo");
    });

    // 统一表单验证方法（挨个执行每个form-item中的验证方法）
    const validate = (cb: CallBack) => {
      deleteFormItemArr();

      const promises = formItemArr.value.map((item: FormItemInfo) =>
        item.validate()
      );
      Promise.all(promises)
        .then(() => cb(true))
        .catch(() => cb(false));
    };

    return {
      validate,
    };
  },
});
</script>

<style scoped lang="less"></style>
