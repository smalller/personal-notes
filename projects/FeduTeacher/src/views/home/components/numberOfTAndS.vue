<template>
  <ui-card class="numberOfTAndS">
    <div class="title">在园师生</div>
    <div class="content">
      <div class="numberOfTAndSItem" @click="jump('幼儿管理')">
        <div>
          <ui-icon icon="icon-a-zu2007"></ui-icon>
        </div>
        <span>幼儿</span>
        <p>
          {{ num1 }}
          <span>人</span>
        </p>
      </div>
      <div class="numberOfTAndSItem" @click="jump('教职工管理')">
        <div>
          <ui-icon icon="icon-a-zu2008"></ui-icon>
        </div>
        <span>教职工</span>
        <p>
          {{ num2 }}
          <span>人</span>
        </p>
      </div>
      <div class="numberOfTAndSItem" @click="jump('班级管理')">
        <div>
          <ui-icon icon="icon-a-zu2006"></ui-icon>
        </div>
        <span>班级</span>
        <p>
          {{ num3 }}
          <span>个</span>
        </p>
      </div>
    </div>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { numAutoAdd } from "@/base/common";
import { getHomePageNowBySchoolId } from "@/api/home";
import bus from "@/Layout/bus";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "numberOfTAndS",
  setup() {
    const num1 = ref(0);
    const num2 = ref(0);
    const num3 = ref(0);
    onMounted(() => {
      querySchoolINfo();
    });
    bus.$on("schoolChanged", () => {
      querySchoolINfo();
    });

    onUnmounted(() => {
      bus.$off("schoolChanged");
    });

    const $router = useRouter();
    const jump = (routerName: string): void => {
      $router.push({
        name: routerName,
      });
    };

    /**
     * 查询在校师生班级数量
     */
    const querySchoolINfo = () => {
      getHomePageNowBySchoolId().then((res) => {
        if (res.code === 0 && res.data?.length > 0) {
          console.log(res);
          numAutoAdd(
            res.data[0].stu_num || 0,
            (num) => {
              num1.value = num;
            },
            300
          );
          numAutoAdd(
            res.data[0].emp_num || 0,
            (num) => {
              num2.value = num;
            },
            300
          );
          numAutoAdd(
            res.data[0].cla_num || 0,
            (num) => {
              num3.value = num;
            },
            300
          );
        }
      });
    };

    return {
      num1,
      num2,
      num3,
      jump,
    };
  },
});
</script>

<style scoped lang="less">
.numberOfTAndS {
  flex: 59;
  height: 330px;
  box-sizing: border-box;
  .title {
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    color: #222222;
  }
  .content {
    margin-top: 22px;
    display: flex;
    justify-content: space-around;
    //flex-wrap: wrap;
    .numberOfTAndSItem {
      //width: 276px;
      min-width: 100px;
      height: 210px;
      flex: 31;
      opacity: 1;
      background: #ecf6ff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 12px;
      > div {
        width: 90px;
        height: 90px;
        background: #5dc4f4;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
        .icon {
          fill: #ffffff;
          width: 51px;
          height: 44px;
        }
      }
      span {
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        color: #222222;
      }
      p {
        margin-top: 6px;
        font-size: 32px;
        font-weight: 800;
        text-align: center;
        color: #222222;
        span {
          font-size: 14px;
        }
      }
      &:nth-child(1) {
        background: #ecf6ff;
        > div {
          background: #5dc4f4;
        }
        &:hover {
          background: #d2eaff;
        }
      }
      &:nth-child(2) {
        background: #eef2ff;
        > div {
          background: #a79fe1;
        }
        &:hover {
          background: #d5dfff;
        }
      }
      &:nth-child(3) {
        background: #fff6e1;
        > div {
          background: #ffb73b;
        }
        &:hover {
          background: #ffedc4;
        }
      }
    }
  }
}
</style>
