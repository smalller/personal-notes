<template>
  <transition name="down">
    <div
      v-show="visible"
      :id="messageInfo.id"
      :class="`message-item ${setClass(messageInfo.type)}`"
    >
      <icon class="icon" :icon="setIcon(messageInfo.type)"></icon>
      {{ messageInfo.title }}
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "vue";
import icon from "@/themes/icon/icon.vue";
// :style="customStyle"
export default defineComponent({
  components: {
    icon,
  },

  props: {
    messageInfo: {
      type: Object,
    },
  },

  setup(props) {
    // 渲染message出来的位置
    const customStyle = computed(() => {
      return {
        top: `${(props.messageInfo as any).top}px`,
      };
    });

    const visible = ref(false);
    onMounted(() => {
      visible.value = true;
    });

    function setClass(type: string) {
      switch (type) {
        case "success":
          return "message-success-item";
        case "error":
          return "message-error-item";
        case "warning":
          return "message-warning-item";
      }
    }

    function setIcon(type: string) {
      switch (type) {
        case "success":
          return "icon-a-jianqu4";
        case "error":
          return "icon-a-jianqu5";
        case "warning":
          return "icon-a-zu2511";
      }
    }

    return {
      setClass,
      setIcon,
      customStyle,
      visible,
    };
  },
});
</script>

<style lang="less" scoped>
.down-enter-from {
  transform: translate3d(0, -75px, 0);
  opacity: 0;
}
.down-enter-active {
  transition: all 0.5s;
}
.down-enter-to {
  transform: none;
  opacity: 1;
}

@keyframes fadeIn {
  0% {
    top: 0px;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.message-item {
  //position: fixed;
  //left: 50%;
  // top: 36px;
  z-index: 1000;
  //transform: translateX(-50%);
  padding: 14px 16px;
  margin-bottom: 14px;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
  // animation: fadeIn 0.5s;

  .icon {
    margin-right: 6px;
  }
}
.message-success-item {
  color: #222222;
  .icon {
    color: #42c7c6;
  }
}
.message-error-item {
  color: #f56060;
  .icon {
    color: #f56060;
  }
}

.message-warning-item {
  color: #ff9900;
  .icon {
    color: #ff9900;
  }
}
</style>
