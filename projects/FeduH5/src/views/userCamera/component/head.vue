<template>
  <div class="myHead">
    <div class="leftBox" >
      <img src="../assets/back.png" @click="leftBtn" alt="" />
      <img v-if="closeBtn" src="@/assets/image/feedback/close.png" @click="$emit('closeClick')" alt="" />
    </div>
    <div class="centerBox">
      {{ title }}
    </div>
    <div class="rightBox" @click="rightBtn">
      <slot name="right">
      {{ rightText }}

      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "myHead",
  props: {
    title: {
      type: String,
      default: "",
    },
    rightText: {
      type: String,
      default: "",
    },
    closeBtn: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    leftBtn() {
      this.$emit("leftClick");
      // this.$router.back()
    },
    rightBtn() {
      this.$emit("rightClick");
    },
  },
};
</script>

<style scoped lang="less">
.myHead {
  width: 100vw;
  height: 44px;
  display: flex;
  //justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f6f7f9;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 1;
  .centerBox {
    flex: 1;
    text-align: center;
    font-size: 18px;
    color: #1c1c1c;
    font-weight: 500;
    white-space: nowrap;
  }
  .headBtn {
    color: #ff9f3d;
    font-size: 16px;
  }
  .leftBox,
  .rightBox {
    flex: 1;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }
  }
  .leftBox{
    justify-content: flex-start;
  }
  .rightBox {
    justify-content: flex-end;
  }
}
</style>
