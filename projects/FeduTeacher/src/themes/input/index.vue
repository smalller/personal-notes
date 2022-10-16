<template>
  <div
    :class="[
      'ui-input',
      {
        'is-disabled': disabled,
      },
    ]"
  >
    <template v-if="type !== 'textarea'">
      <input
        :type="type"
        :class="[
          {
            'is-disabled': disabled,
          },
        ]"
        :value="modelValue"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        :maxlength="maxlength"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        @change="onChange"
      />
      <!-- @keydown="onKeydown" -->
      <span class="ui-input-icon-box">
        <!-- <i :class="['ui-input-icon', 'iconfont ' + icon]"></i> -->
        <ui-icon
          v-if="inputStatus"
          icon="icon-a-73"
          @click="clearInput"
          class="icon-left"
        ></ui-icon>
        <ui-icon
          v-if="icon"
          :icon="icon"
          @click="iconClick"
          class="icon-right"
        ></ui-icon>
      </span>
    </template>
    <textarea
      v-else
      :class="[
        {
          'is-disabled': disabled,
        },
      ]"
      :style="{
        maxWidth: WIDTH,
        minWidth: WIDTH,
        minHeight: HEIGHT,
        height: HEIGHT,
      }"
      :value="modelValue"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="textareaMaxlength"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      @change="onChange"
    >
    </textarea>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from "vue";
import { Validate } from "./token";

export default defineComponent({
  name: "ui-input",

  model: {
    event: "update",
  },

  props: {
    type: String,
    modelValue: [String, Number],
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    icon: String,
    maxlength: {
      type: Number || String,
      default: 40,
    },
    textareaMaxlength: {
      type: Number || String,
    },
    width: [String, Number],
    height: [String, Number],
  },

  setup(props, ctx) {
    const WIDTH = computed(() => {
      let width = "";
      if (props.width) {
        if (typeof props.width === "string") {
          if (
            props.width.indexOf("px") !== -1 ||
            props.width.indexOf("%") !== -1
          ) {
            width = props.width;
          } else {
            width = props.width + "px";
          }
        } else {
          width = props.width + "px";
        }
      } else {
        width = "507px";
      }
      return width;
    });

    const HEIGHT = computed(() => {
      let height = "";
      if (props.height) {
        if (typeof props.height === "string") {
          if (
            props.height.indexOf("px") !== -1 ||
            props.height.indexOf("%") !== -1
          ) {
            height = props.height;
          } else {
            height = props.height + "px";
          }
        } else {
          height = props.height + "px";
        }
      } else {
        height = "240px";
      }
      return height;
    });

    // 清除按钮显示与否
    const inputStatus = ref(false);

    // 注入父组件form-item中的验证函数
    const validate = inject("validate") as Validate;

    // 清除输入框事件
    const clearInput = (e: Event) => {
      inputStatus.value = false;
      ctx.emit("update:modelValue", "");
      ctx.emit("clearClick", e);
    };

    const onInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      ctx.emit("update:modelValue", value); // 将输入的值派发出去
      // 如果输入框有值，就显示删除按钮，否则就隐藏
      if (value) {
        inputStatus.value = true;
      } else {
        inputStatus.value = false;
      }
      validate && validate();
    };

    const onBlur = (e: Event) => {
      ctx.emit("blur", e);
      validate && validate();
    };

    const onChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      ctx.emit("change", value);
    };

    const onFocus = (e: Event) => {
      ctx.emit("focus", e);
    };

    // 右边小图标事件
    const iconClick = (e: Event) => {
      ctx.emit("iconClick", e);
    };

    return {
      onInput,
      onBlur,
      onFocus,
      onChange,
      WIDTH,
      HEIGHT,
      iconClick,
      inputStatus,
      clearInput,
    };
  },
});
</script>

<style lang="less" scoped>
.ui-input {
  display: inline-block;
  position: relative;
  width: 100%;

  &:hover .icon-right {
    transition: all 0.3s;
    color: #999;
  }

  &:hover .icon-left {
    display: inline-block;
    transition: all 0.3s;
    color: #999;
  }

  > input {
    width: 100%;
    height: 32px;
    outline: none;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    box-sizing: border-box;
    padding: 0 30px 0 10px;
    font-size: 14px;

    &:hover {
      transition: all 0.3s;
      border-color: #999;
    }

    &:focus {
      transition: all 0.3s;
      border-color: #999;
    }
  }

  > textarea {
    outline: none;
    background-color: #fff;
    color: #222;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    box-sizing: border-box;
    padding: 6px 10px;
    font-size: 14px;
    width: 100% !important;
    height: 100% !important;
    min-width: 200px !important;
    min-height: 100px !important;
    &:hover {
      transition: all 0.3s;
      border-color: #999;
    }

    &:focus {
      transition: all 0.3s;
      border-color: #999;
    }
  }
}

.is-disabled {
  pointer-events: none;
  cursor: not-allowed;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #bfbfbf;
  font-size: 14px;
}

input::-ms-input-placeholder,
textarea::-ms-input-placeholder {
  color: #bfbfbf;
  font-size: 14px;
}

input::-moz-input-placeholder,
textarea::-moz-input-placeholder {
  color: #bfbfbf;
  font-size: 14px;
}

input[disabled],
textarea[disabled] {
  color: #d9d9d9;
}

input[disabled]::-webkit-input-placeholder,
textarea[disabled]::-webkit-input-placeholder {
  color: #d9d9d9;
}

input[disabled]::-ms-input-placeholder,
textarea[disabled]::-ms-input-placeholder {
  color: #d9d9d9;
}

input[disabled]::-moz-input-placeholder,
textarea[disabled]::-moz-input-placeholder {
  color: #d9d9d9;
}

.is-disabled .ui-input-icon-box {
  color: #d9d9d9;
}

.is-error {
  border: 1px solid #f00;
}

.ui-input-icon-box {
  height: 100%;
  position: absolute;
  right: 8px;
  color: #bfbfbf;
  line-height: 32px;

  .icon-left,
  .icon-right {
    cursor: pointer;
  }

  .icon-left {
    display: none;
  }

  .icon-right {
    margin-left: 16px;
  }
}
</style>
