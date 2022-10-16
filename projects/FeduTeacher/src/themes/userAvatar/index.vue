<template>
  <div
    class="ui-user-avatar"
    :style="{
      height: size + 'px',
      width: size + 'px',
      lineHeight: size + 'px',
      borderRadius: shape + 'px',
    }"
    @mouseenter="visible"
    @mouseleave="invisible"
  >
    <transition name="img">
      <div
        v-if="show || !src"
        class="fix-avatar"
        :style="{
          height: size + 'px',
          width: size + 'px',
          borderRadius: shape + 'px',
        }"
      >
        <ui-icon
          :icon="icons"
          :style="{ fontSize: 30 + 'px', color: '#ffff' }"
        ></ui-icon>
        <!-- <i
        :class="['iconfont', 'icon-a-1']"
        :style="{ fontSize: 30 + 'px', color: '#ffff' }"
      ></i> -->
      </div>
    </transition>

    <img
      :class="avatarClass"
      v-if="src && !hasLoadError"
      :src="src"
      :style="{
        height: size + 'px',
        width: size + 'px',
        lineHeight: size + 'px',
        borderRadius: shape + 'px',
      }"
      @error="handleError"
    />
    <i v-else-if="icon" :class="icon"></i>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, toRef } from "vue";

const Component = defineComponent({
  name: "ui-user-avatar",
  props: {
    src: {
      type: String,
      default: "",
    },
    size: {
      type: [Number, String],
      default: 0,
    },
    shape: {
      type: [Number, String],
      default: 0,
    },
    icon: String,
  },
  emits: {
    error: null,
  },
  setup(props, context) {
    const hasLoadError = ref(false);

    const src = toRef(props, "src");
    watch(src, () => {
      hasLoadError.value = false;
    });
    const avatarClass = computed(() => {
      const classList = ["ui-avatar"];
      return classList;
    });
    let show = ref(false);
    function visible() {
      show.value = true;
    }
    function invisible() {
      show.value = false;
    }
    function handleError(e: Event) {
      hasLoadError.value = true;
      context.emit("error", e);
    }
    const icons = "icon-a-1";
    return {
      handleError,
      hasLoadError,
      avatarClass,
      visible,
      invisible,
      show,
      icons,
    };
  },
});

export default Component;
</script>

<style scoped lang="less">
.ui-avatar {
  // border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.10196078431372549);
}
.fix-avatar {
  position: absolute;
  text-align: center;
  opacity: 0.2;
  cursor: pointer;
  background: #000000;
}
.img-enter {
  opacity: 0.1;
}
.img-enter-to {
  opacity: 0.5;
}
.img-enter-active {
  transition: opacity 2s;
}
// .img-leave-to {
//   opacity: 0;
// }
// .img-leave-active {
//   transition: opacity 2s;
// }
</style>
