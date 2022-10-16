<template>
  <transition name="ui-modal">
    <div class="ui-modal" v-if="show">
      <div class="ui-modal-mask" @click="maskClick"></div>
      <div
        class="ui-modal-content"
        ref="UI_MODAL_CONTEXT"
        :style="{ width: width + 'px' }"
      >
        <div class="ui-modal-head">
          <div class="ui-modal-title">{{ title }}</div>
          <div class="ui-modal-btn ui-modal-closeBtn" @click="close">
            <ui-icon icon="icon-a-zu238"></ui-icon>
          </div>
        </div>
        <div>
          <slot></slot>
        </div>

        <div class="ui-modal-footer">
          <slot name="footer">
            <div class="ui-modal-tips">
              <slot name="tips">
                <div v-if="typeof tips === 'boolean' && tips">
                  提示:带
                  <span>*</span>
                  号为必填项
                </div>
                <div v-else>
                  {{ typeof tips === "boolean" ? "" : tips }}
                </div>
              </slot>
            </div>

            <div class="ui-modal-btnBox">
              <ui-button
                class="ui-modal-btn"
                v-show="showClose"
                @click="close()"
              >
                {{ cancelText }}
              </ui-button>
              <ui-button
                v-show="buttonShow"
                @click="ok"
                style="margin-left: 16px"
                type="primary"
                class="ui-modal-btn"
                >{{ okText }}</ui-button
              >
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";

const Component = defineComponent({
  name: "ui-modal",
  // model: {
  //   prop: "visible",
  //   event: "close",
  // },
  props: {
    width: {
      type: Number || String,
      default: 400,
    },
    title: {
      type: String,
      default: "标题",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    maskClose: {
      type: Boolean,
      default: false,
    },
    tips: {
      type: Boolean || String,
      default: true,
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
    buttonShow: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    close: null,
    "update:visible": null,
    ok: null,
    cancel: null,
  },
  setup(props, context) {
    let show = ref(props.visible);
    const UI_MODAL_CONTEXT = ref(null);

    onMounted(() => {
      // const modals = document.querySelectorAll(".ui-modal");
      // // const zIndexs =
      // modals.forEach((item: any) => {
      //   console.log(item.style);
      // });
      // console.log(modals);
    });

    /**
     * 关闭弹窗
     */
    const close = (): void => {
      show.value = false;
      context.emit("close");
      context.emit("update:visible", false);
    };

    /**
     * 点击取消按钮
     */
    const cancel = (): void => {
      context.emit("cancel");
      close();
    };

    /**
     * 点击取消按钮
     */
    const ok = (): void => {
      context.emit("ok");
    };

    /**
     * 点击mask关闭弹窗
     */
    const maskClick = (): void => {
      if (props.maskClose) {
        close();
      }
    };

    watch(
      () => props.visible,
      (newVal: boolean) => {
        show.value = newVal;
      }
    );

    return {
      show,
      close,
      maskClick,
      UI_MODAL_CONTEXT,
      cancel,
      ok,
    };
  },
});

export default Component;
</script>

<style scoped lang="less">
.ui-modal-enter-active,
.ui-modal-leave-active {
  transition: all 0.3s;
  opacity: 1 !important;
}
.ui-modal-enter,
.ui-modal-leave-to {
  opacity: 0 !important;
}
.ui-modal {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3000;
  .ui-modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
  }
  .ui-modal-content {
    padding: 30px;
    box-sizing: border-box;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    .ui-modal-head {
      display: flex;
      margin-bottom: 20px;
      .ui-modal-closeBtn {
        width: 20px;
        height: 20px;
        cursor: pointer;
        position: absolute;
        top: 14px;
        right: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          fill: #999999;
          width: 12px;
          height: 12px;
        }
      }
      .ui-modal-title {
        font-size: 16px;
        font-weight: bold;
        color: #222222;
      }
    }
    .ui-modal-footer {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      .ui-modal-tips {
        font-size: 12px;
        color: #999999;
        display: flex;
        align-items: center;
        span {
          color: #f56060;
        }
      }
    }
    .ui-modal-btnBox {
      display: flex;
    }
  }
}
</style>
