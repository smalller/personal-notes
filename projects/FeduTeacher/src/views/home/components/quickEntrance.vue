<template>
  <ui-card class="quickEntrance">
    <div class="title">快捷入口</div>
    <div class="content">
      <div @click="jump('幼儿管理')">
        <div class="iconBox" style="background: #5dc4f4">
          <ui-icon icon="icon-a-zu2007"></ui-icon>
        </div>
        <span>幼儿管理</span>
      </div>
      <div class="disabled" @click="jump('评论管理')">
        <div class="iconBox" style="background: #4fa8f9">
          <ui-icon icon="icon-a-24"></ui-icon>
        </div>
        <span>通知发布</span>
      </div>
      <div @click="jump('教职工管理')">
        <div class="iconBox" style="background: #a79fe1">
          <ui-icon icon="icon-a-zu2008"></ui-icon>
        </div>
        <span>老师管理</span>
      </div>
      <div @click="jump('视频管理')">
        <div class="iconBox" style="background: #f56060">
          <ui-icon icon="icon-a-4"></ui-icon>
        </div>
        <span>监控管理</span>
      </div>
      <div class="disabled" @click="jump('考勤卡管理')">
        <div class="iconBox" style="background: #42c7c6">
          <ui-icon icon="icon-a-22"></ui-icon>
        </div>
        <span>考勤卡管理</span>
      </div>
      <div @click="jump('招生计划')">
        <div class="iconBox" style="background: #ffb73b">
          <ui-icon icon="icon-a-zu2013"></ui-icon>
        </div>
        <span>招生宣传</span>
      </div>
    </div>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "quickEntrance",
  setup() {
    const $router = useRouter();
    const jump = (routerName: string): void => {
      $router.push({
        name: routerName,
      });
    };
    return {
      jump,
    };
  },
});
</script>

<style scoped lang="less">
.quickEntrance {
  height: 330px;
  flex: 39;
  box-sizing: border-box;
  margin-left: 24px;
  .title {
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    color: #222222;
  }
  .content {
    margin-top: 22px;
    //display: flex;
    //flex-wrap: wrap;
    //justify-content: space-between;
    display: grid;
    grid-template-rows: repeat(3, 60px);
    grid-template-columns: repeat(2, 48%);
    grid-row-gap: 14px;
    grid-column-gap: 24px;
    > div {
      margin: 0 12px 14px 12px;
      max-width: 268px;
      min-width: 150px;
      height: 60px;
      cursor: pointer;
      background: #ffffff;
      border: 1px solid #f2f2f2;
      border-radius: 4px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      .iconBox {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 14px;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        .icon {
          width: 22px;
          height: 19px;
          fill: #ffffff;
        }
      }
      span {
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: #222222;
      }
      &:hover {
        border-color: #999999;
        span {
          color: #ff9900;
        }
      }
      &.disabled {
        pointer-events: none;
      }
    }
  }
}
</style>
