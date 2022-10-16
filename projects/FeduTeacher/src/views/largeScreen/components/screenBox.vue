<template>
  <div class="screenBox">
    <div class="alltitle" v-show="headShows">
      <span @click="titleClick"> {{ titles }}</span>
      <div class="pulll_right" v-show="rightBtnShow">
        <span @click="subTitleClick">
          更多
          <img src="../images/more.png" alt="" />
        </span>
      </div>
    </div>
    <slot></slot>
    <div class="boxfoot"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    headShow: {
      type: Boolean,
      default: true,
    },
    rightBtn: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    titleClick: null,
    subTitleClick: null,
  },
  setup(props, ctx) {
    const titles = computed(() => props.title);
    const headShows = computed(() => props.headShow);
    const rightBtnShow = computed(() => props.rightBtn);
    const titleClick = () => {
      ctx.emit("titleClick");
    };
    const subTitleClick = () => {
      ctx.emit("subTitleClick");
    };
    return { titles, titleClick, subTitleClick, headShows };
  },
});
</script>

<style scoped lang="less">
.screenBox {
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: rgba(255, 255, 255, 0.04) url(../images/line.png);
  background-size: 100% auto;
  position: relative;
  // margin-bottom: 0.15rem;
  z-index: 10;
  box-sizing: border-box;
  padding: 0.16rem 0.21rem;
  .alltitle {
    color: #fff;
    //border-bottom: 1px dotted rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      font-size: 0.21rem;
      border-left: 2px solid #0ec2ee;
      padding-left: 10px;
      user-select: none;
    }
    .pointer {
      cursor: pointer;
    }
    .pulll_right {
      span {
        font-size: 0.13rem;
        color: #acd3fc;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        img {
          margin-left: 0.05rem;
          width: 0.13rem;
          height: 0.09rem;
        }
      }
    }
  }
  &:before,
  &:after {
    position: absolute;
    width: 0.1rem;
    height: 0.1rem;
    content: "";
    border-top: 2px solid #02a6b5;
    top: 0;
  }
  &:before {
    border-left: 2px solid #02a6b5;
    left: 0;
  }

  &:after {
    border-right: 2px solid #02a6b5;
    right: 0;
  }
  .boxfoot {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    &:before,
    &:after {
      position: absolute;
      width: 0.1rem;
      height: 0.1rem;
      content: "";
      border-bottom: 2px solid #02a6b5;
      bottom: 0;
    }
    &:before {
      border-left: 2px solid #02a6b5;
      left: 0;
    }
    &:after {
      border-right: 2px solid #02a6b5;
      right: 0;
    }
  }
}
</style>
