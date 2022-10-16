<template>
  <button
    :class="[
      'ui-button',
      type ? 'ui-button-' + type : 'ui-button-default',
      {
        'is-disabled': disabled,
      },
    ]"
    :disabled="disabled"
  >
    <!-- <i v-if="icon" :class="['ui-button-icon', 'iconfont ' + icon]"></i> -->
    <span v-if="icon !== 'default'" class="ui-button-icon">
      <ui-icon :icon="icon"></ui-icon>
    </span>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from "vue";

export default defineComponent({
  name: "ui-button",
  props: {
    type: {
      type: String,
      default: "default",
    },
    icon: {
      type: String,
      default: "default",
    },
    disabled: Boolean,
  },

  setup(props) {
    const type = ref(props.type);
    const TYPES = [
      "default",
      "primary",
      "primary-review",
      "text",
      "text-primary",
      "text-blue",
      "text-info",
    ];
    watch(
      () => props.type,
      (newVal: string) => {
        type.value = TYPES.includes(newVal) ? newVal : "default";
      }
    );
  },
});
</script>

<style scoped lang="less">
.ui-button {
  font-size: 14px;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 18px;
  background-color: #fff;
  color: #666;
  white-space: nowrap;
  box-sizing: border-box;
  height: 32px;
}

.ui-button-default {
  background-color: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
}

.ui-button-default {
  &:hover {
    transition: all 0.3s;
    border: 1px solid #999;
  }
  &:active {
    border: 1px solid #d9d9d9;
  }
}

.ui-button-primary,
.ui-button-primary-review {
  color: #fff;
  border: 1px solid transparent;
  background-color: #ff9900;
  &:hover {
    background-color: #ffac2e;
  }
  &:active {
    background-color: #ff9900;
  }
}

.ui-button-text,
.ui-button-text-primary,
.ui-button-text-blue,
.ui-button-text-info {
  border: none;
  padding-left: 0;
  padding-right: 0;
  background-color: rgba(0, 0, 0, 0);
}

.ui-button-text {
  color: #222;
  &:hover {
    color: #999;
  }
  &:active {
    color: #222;
  }
}

.ui-button-text-primary {
  color: #ff9900;
  &:hover {
    color: #ec8e00;
  }
  &:active {
    color: #ff9900;
  }
}

.ui-button-text-blue {
  color: #4fa8f9;
  &:hover {
    color: #66b1ff;
  }
  &:active {
    color: #4fa8f9;
  }
}

.ui-button-text-info {
  color: #bfbfbf;
  &:hover {
    color: #999;
  }
  &:active {
    color: #bfbfbf;
  }
}

.ui-button-icon {
  margin-right: 5px;
}

.is-disabled {
  pointer-events: none;
  cursor: not-allowed;
}

.is-disabled.ui-button-default {
  background: #f8f8f8;
  border: 1px solid #d9d9d9;
}

.is-disabled.ui-button-primary {
  background: #f8f8f8;
  border-color: transparent;
}
.is-disabled.ui-button-primary-review {
  background: #ff9900;
  opacity: 0.2;
  border-color: transparent;
}

.is-disabled.ui-button-text,
.is-disabled.ui-button-text-primary,
.is-disabled.ui-button-text-blue,
.is-disabled.ui-button-text-info,
.is-disabled.ui-button-primary,
.is-disabled.ui-button-default {
  color: #d9d9d9;
}
</style>
