<template>
  <div class="screenStudent">
    <div>
      <img src="../images/user1.png" alt="" />
      <div>
        <span>+12</span>
        <span>昨日转入学生</span>
      </div>
    </div>
    <div>
      <img src="../images/user2.png" alt="" />
      <div>
        <span>0</span>
        <span>昨日转出学生</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup(props) {
    return {};
  },
});
</script>
<style lang="less" scoped>
.screenStudent {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  > div {
    height: 100%;
    width: 3.9rem;
    background: rgba(210, 230, 255, 0.08);
    border: 0.01px solid #0091ff74;
    display: flex;
    align-items: center;
    img {
      width: 0.38rem;
      height: 0.73rem;
      margin-left: 0.56rem;
    }
    > div {
      margin-left: 0.29rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span {
        &:first-child {
          font-size: 0.46rem;
          color: #4aeceb;
        }
        &:last-child {
          color: #acd3fc;
          font-size: 0.19rem;
        }
      }
    }
    &:last-child {
      > div {
        &:last-child {
          span:first-child {
            color: #fb9e89;
          }
        }
      }
    }
  }
}
</style>
