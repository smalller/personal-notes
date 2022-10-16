<template>
  <transition name="dialog-box">
    <div
      class="dialog-box"
      v-if="show"
    >
      <div class="dialog-mask"></div>
      <div
        class="dialog-content"
        :style="{ width: width + 'px' }"
      >
        <p class="title">{{title}}</p>
        <div>
          <slot></slot>
        </div>
        <div class="btn-box">
          <button
            v-show="showClose"
            class="cancel"
            @click="close"
          >{{cancelText}}</button>
          <button
            :class="['sure',!showClose ? 'no-cancel' : '']"
            @click="sure"
          >{{okText}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    width: {
      type: Number || String,
      default: 268,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    okText: {
      type: String,
      default: "确认",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
  },
  watch: {
    visible: {
      handler(newVal) {
        this.show = newVal
      },
      deep: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    // 取消按钮
    close() {
      this.show = false;
      this.$emit("close");
    },

    // 确认按钮
    sure() {
      this.$emit("sure");
    }
  },
}
</script>

<style lang="less" scoped>
.dialog-box-enter-active,
.dialog-box-leave-active {
  transition: all 0.3s;
  opacity: 1 !important;
}
.dialog-box-enter,
.dialog-box-leave-to {
  opacity: 0 !important;
}

.dialog-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;

  .dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }

  .dialog-content {
    padding: 24px 16px 16px 16px;
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 14px;

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 8px;
    }

    .btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;

      > button {
        border: none;
        padding: 11px 39px;
        box-sizing: border-box;
        border-radius: 22px;
        font-size: 16px;
      }

      .cancel {
        color: #666666;
        background: #f1f0f5;

        &:active {
          color: #fff;
          background: #cfcece;
        }
      }

      .sure {
        color: #fff;
        background: #ff9f3d;

        &:active {
          background: #f08316;
        }
      }

      .no-cancel {
        width: 100%;
      }
    }
  }
}
</style>