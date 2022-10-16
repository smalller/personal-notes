import { defineComponent } from "vue";

<template>
  <div class="loginInfo">
    <div class="userNameBox" @click="openModal">
      <img :src="userInfo.userPortait || userIcon" alt="" />
      <span>{{ schoolDetails?.name || "" }}</span>
    </div>
    <transition name="el-zoom-in-top">
      <div
        class="loginModal"
        v-show="modalShow"
        @mousemove="mouseEvent"
        @mouseleave="mouseOut"
      >
        <div class="loginTips">
          <div>
            <p>
              {{ getTime() }}, {{ schoolDetails?.name || "" }}
              {{ schoolDetails?.title || "" }}
            </p>
            <span v-if="userInfo.lastLoginTime"
              >上次登录 {{ getTimeFormat(userInfo.lastLoginTime) }}</span
            >
            <span v-if="!userInfo.lastLoginTime">上次登录 首次登录</span>
          </div>
        </div>
        <div class="btnBox">
          <div>
            <ui-icon class="icon" icon="icon-a-6"></ui-icon>
            <span>设置</span>
          </div>
          <div @click="loginOut">
            <ui-icon class="icon" icon="icon-a-53"></ui-icon>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import micell from "micell";
import { UserInfo } from "@/store/user/state";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const userIcon = ref("");
    userIcon.value = require("../assets/images/user/userIcon.png");
    const $store = useStore();

    const userInfo = computed<UserInfo>(() => $store.state.user.userInfo);
    const schoolDetails = computed(() => {
      return $store.state.user.schoolList.find((item: any) => {
        if ($store.state.user.schoolId === item.schoolId) {
          return item;
        }
      });
    });

    const getTimeFormat = (time: string): string => {
      return micell.date.timeAgo.format(dayjs(time).toDate(), "zh_CN");
    };

    const modalShow = ref(false);
    let timer: number | null;

    bus.$on("schoolChanged", () => {
      openModal();
    });

    /**
     *  打开弹窗
     * */
    const openModal = (): void => {
      modalShow.value = true;
      closeModal();
    };

    /**
     * 延迟关闭弹窗
     */
    const closeModal = (): void => {
      timer = setTimeout(() => {
        modalShow.value = false;
        timer = null;
      }, 3000);
    };

    /**
     * 监听鼠标移出
     */
    const mouseOut = (): void => {
      if (timer) {
        clearTimeout(timer);
        modalShow.value = false;
        timer = null;
      }
    };

    /**监听鼠标移动 */
    const mouseEvent = (): void => {
      if (timer) {
        clearTimeout(timer);
        closeModal();
      }
    };

    /**
     * 退出登录
     */
    const loginOut = (): void => {
      $store.dispatch("loginOut");
    };

    /**判断当前时间段 */
    const getTime = (): string => {
      const hour: number = dayjs().toDate().getHours();
      if (hour >= 6 && hour < 8) {
        return "早上好";
      } else if (hour >= 8 && hour < 11) {
        return "上午好";
      } else if (hour >= 11 && hour < 13) {
        return "中午好";
      } else if (hour >= 13 && hour < 18) {
        return "下午好";
      } else {
        return "晚上好";
      }
    };

    onMounted(() => {
      // startLoginTime();
    });

    return {
      schoolDetails,
      userInfo,
      modalShow,
      userIcon,
      openModal,
      mouseEvent,
      loginOut,
      getTime,
      mouseOut,
      getTimeFormat,
    };
  },
});
</script>

<style scoped lang="less">
.loginInfo {
  position: relative;
  z-index: 98;
  * {
    user-select: none;
  }
  .userNameBox {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      border-radius: 50%;
      width: 32px;
      height: 32px;
    }
    span {
      margin-left: 10px;
      font-size: 14px;
      color: #656565;
    }
    &:hover {
      span {
        color: #222222;
      }
    }
  }
  .loginModal {
    position: absolute;
    top: 50px;
    right: 0;
    width: 298px;
    height: 213px;
    background: #ffffff;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    opacity: 1;
    border-radius: 3px;
    display: flex;
    flex-direction: column;

    .loginTips {
      padding: 0 24px;
      > div {
        padding-top: 22px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e8e8e8;
      }
      p {
        font-size: 20px;
        color: #222222;
      }
      span {
        margin-top: 5px;
        font-size: 14px;
        color: #999999;
      }
    }
    .btnBox {
      padding: 15px 0;
      display: flex;
      flex-direction: column;
      > div {
        padding: 0 24px;
        cursor: pointer;
        height: 44px;
        display: flex;
        align-items: center;
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          fill: #999999;
        }
        span {
          font-size: 14px;
          color: #222222;
        }
        &:hover {
          background: #f0f0f0;
        }
        &.disabled {
          pointer-events: none;
          .icon {
            fill: #d9d9d9;
          }
          span {
            color: #d9d9d9;
          }
        }
      }
    }
  }
}
</style>
