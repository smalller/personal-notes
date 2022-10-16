<template>
  <div class="ui-form-item-box">
    <label
      :style="{
        width: labelWidth,
      }"
      :class="[
        'ui-form-item-label',
        {
          'ui-form-item-label-is-prop': prop,
        },
      ]"
      v-if="label"
      >{{ label }}</label
    >
    <div
      class="ui-form-item-content"
      :style="[align === 'line' ? 'display: flex;align-items:center;' : '']"
    >
      <slot></slot>
      <div class="ui-form-item-error" v-if="prop">{{ errMsg }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  inject,
  toRefs,
  provide,
  ref,
  onUnmounted,
} from "vue";
import Validator from "async-validator";
import { Formprops } from "./token";
import bus from "@/Layout/bus";

export default defineComponent({
  name: "ui-form-item",
  props: {
    label: String,
    prop: String,
    align: {
      type: String,
      default: "",
    },
    rules: [Object, Array],
  },
  setup(props) {
    const errMsg = ref("");

    // 注入ui-form组件中的props对象
    const formProps = inject("formProps") as Formprops;
    let labelWidth = "";
    if (formProps.labelWidth) {
      if (typeof formProps.labelWidth === "string") {
        if (formProps.labelWidth.indexOf("px") !== -1) {
          labelWidth = formProps.labelWidth;
        } else {
          labelWidth = formProps.labelWidth + "px";
        }
      } else {
        labelWidth = formProps.labelWidth + "px";
      }
    } else {
      labelWidth = "100px";
    }

    const validate = () => {
      // if (props.prop !== undefined) {
      //   let rules = formProps.rules[props.prop];
      //   let value = formProps.model[props.prop];

      //   // TODO 将传进来的rules合并到父组件中的rules中
      //   if (props.rules) {
      //     rules.concat(props.rules);
      //     console.log(222, rules);
      //   }

      //   console.log(333, rules);

      //   // 获得校验器实例
      //   const validator = new Validator({ [props.prop]: rules });
      //   return validator.validate({ [props.prop]: value }, (err) => {
      //     if (err) {
      //       errMsg.value = err[0].message || "未知错误";
      //     } else {
      //       errMsg.value = "";
      //     }
      //   });
      // }

      // 加载一个校验库，asyc-validator
      // 获取规则和值
      if (props.prop !== undefined) {
        const rules = formProps.rules[props.prop];
        const value = formProps.model[props.prop];

        // 获得校验器实例/
        const validator = new Validator({ [props.prop]: rules });
        return validator.validate({ [props.prop]: value }, (err) => {
          if (err) {
            errMsg.value = err[0].message || "未知错误";
          } else {
            errMsg.value = "";
          }
        });
      }
    };

    let formItemInfo = reactive({
      ...toRefs(props),
      validate,
    });

    // 将该组件中的属性与验证方法派发出去
    bus.$emit("formItemInfo", formItemInfo);

    // 将验证函数暴露出去，方便子组件获取与调用
    provide("validate", validate);

    return {
      labelWidth,
      errMsg,
    };
  },
});
</script>

<style scoped lang="less">
.ui-form-item-box {
  display: flex;
  // align-items: center;
  margin-bottom: 22px;

  &:last-child {
    margin-bottom: 0;
  }

  .ui-form-item-label {
    //display: inline-block;
    //margin-right: 15px;
    text-align: right;
    line-height: 32px;
    font-size: 14px;
    color: #666;
    padding-right: 15px;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
  }

  .ui-form-item-label-is-prop {
    &::before {
      content: "*";
      color: #f56060;
      margin-right: 4px;
    }
  }

  .ui-form-item-content {
    flex-grow: 1;
    // line-height: 32px;
    position: relative;
    display: flex;
    align-items: center;
    .ui-form-item-error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 6px;
      position: absolute;
      //top: 100%;
      left: 0;
      bottom: -16px;
    }
  }
}
</style>
