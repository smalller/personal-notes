<template>
  <ui-card class="activeTeacher">
    <div class="title">老师活跃</div>
    <div class="content">
      <div class="activeItem">
        <div>
          <ui-icon icon="icon-a-10"></ui-icon>
          <img src="" class="userIcon" alt="" />
          <img
            src="@/assets/images/active/active2.svg"
            class="itemImg"
            alt=""
          />
        </div>
        <div>
          <p>张晓华</p>
          <span>128 活跃值</span>
        </div>
      </div>
      <div class="activeItem">
        <div>
          <ui-icon icon="icon-a-10"></ui-icon>
          <img src="" class="userIcon" alt="" />
          <img
            src="@/assets/images/active/active1.svg"
            class="itemImg"
            alt=""
          />
        </div>
        <div>
          <p>张晓华</p>
          <span>128 活跃值</span>
        </div>
      </div>
      <div class="activeItem">
        <div>
          <ui-icon icon="icon-a-10"></ui-icon>
          <img src="" class="userIcon" alt="" />
          <img
            src="@/assets/images/active/active3.svg"
            class="itemImg"
            alt=""
          />
        </div>
        <div>
          <p>张晓华</p>
          <span>128 活跃值</span>
        </div>
      </div>
    </div>
  </ui-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "activeTeacher",
});
</script>

<style scoped lang="less">
.activeTeacher {
  //max-width: 640px;
  flex: 39;
  height: 360px;
  box-sizing: border-box;
  .title {
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    color: #222222;
  }
  .content {
    width: 100%;
    display: flex;
    align-items: flex-end;
    margin-top: 57px;
    justify-content: space-around;
    .activeItem {
      > div {
        &:first-child {
          position: relative;
          width: 100px;
          height: 100px;
          .icon {
            width: 62px;
            height: 59px;
            fill: #ffc540;
            position: absolute;
            top: -27px;
            left: -13px;
            z-index: 1;
          }
          .userIcon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 2px solid #ffc540;
            border-radius: 50%;
          }
          .itemImg {
            width: 72px;
            height: 42px;
            z-index: 1;
            position: absolute;
            bottom: -19px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        &:last-child {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          p {
            font-size: 18px;
            color: #222222;
          }
          span {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 400;
            color: #ff7c19;
          }
        }
      }
      &:nth-child(1) {
        > div {
          &:first-child {
            width: 80px;
            height: 80px;
            .icon {
              width: 48px;
              height: 46px;
              top: -19px;
              left: -11px;
              fill: #bcccdc;
            }
            .userIcon {
              border-color: #bcccdc;
            }
            .itemImg {
              width: 62px;
              height: 38px;
              bottom: -16px;
            }
          }
        }
      }
      &:nth-child(3) {
        > div {
          &:first-child {
            width: 80px;
            height: 80px;
            .icon {
              width: 48px;
              height: 46px;
              top: -19px;
              left: -11px;
              fill: #d4ac6d;
            }
            .userIcon {
              border-color: #d4ac6d;
            }
            .itemImg {
              width: 62px;
              height: 38px;
              bottom: -16px;
            }
          }
        }
      }
    }
  }
}
</style>
