<template>
  <div class="schoolNumber">
    <div class="bar">
      <div class="barbox">
        <ul class="clearfix">
          <li class="pulll_left counter">{{ sNum }}</li>
          <li class="pulll_left counter">{{ tNum }}</li>
          <li class="pulll_left counter">{{ cNum }}</li>
        </ul>
      </div>
      <div class="barbox2">
        <ul class="clearfix">
          <li class="pulll_left">幼儿总人数</li>
          <li class="pulll_left">教职工总人数</li>
          <li class="pulll_left">班级总数</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { getHomePageNowBySchoolId } from "@/api/home";
import { numAutoAdd } from "@/base/common";

export default defineComponent({
  setup() {
    const sNum = ref(0);
    const tNum = ref(0);
    const cNum = ref(0);

    const query = () => {
      getHomePageNowBySchoolId().then((res) => {
        if (res.code === 0 && res.data?.length > 0) {
          console.log(res);
          numAutoAdd(
            res.data[0].stu_num || 0,
            (num) => {
              sNum.value = num;
            },
            300
          );
          numAutoAdd(
            res.data[0].emp_num || 0,
            (num) => {
              tNum.value = num;
            },
            300
          );
          numAutoAdd(
            res.data[0].cla_num || 0,
            (num) => {
              cNum.value = num;
            },
            300
          );
        }
      });
    };
    query();
    return {
      sNum,
      tNum,
      cNum,
    };
  },
});
</script>

<style scoped lang="less">
.schoolNumber {
  position: relative;
  width: 100%;
  z-index: 100;
  @font-face {
    font-family: electronicFont;
    src: url(../font/DS-DIGIT.TTF);
  }
  .pulll_left {
    float: left;
  }
  .clearfix:after,
  .clearfix:before {
    display: table;
    content: " ";
  }
  .clearfix:after {
    clear: both;
  }
  .bar {
    background: rgba(101, 132, 226, 0.1);
    padding: 0.15rem;
    height: 100%;
    box-sizing: border-box;
  }
  .barbox li,
  .barbox2 li {
    width: 33.33333%;
    text-align: center;
    position: relative;
  }
  .barbox:before,
  .barbox:after {
    position: absolute;
    width: 0.3rem;
    height: 0.1rem;
    content: "";
  }
  .barbox:before {
    border-left: 2px solid #02a6b5;
    left: 0;
    border-top: 2px solid #02a6b5;
  }
  .barbox:after {
    border-right: 2px solid #02a6b5;
    right: 0;
    bottom: 0;
    border-bottom: 2px solid #02a6b5;
  }

  .barbox li:before {
    position: absolute;
    content: "";
    height: 50%;
    width: 1px;
    background: rgba(255, 255, 255, 0.2);
    right: 0;
    top: 25%;
  }

  .barbox {
    border: 1px solid rgba(25, 186, 139, 0.17);
    position: relative;
    height: 0.94rem;
  }
  .barbox li {
    font-size: 0.667rem;
    color: #ffeb7b;
    padding: 0.05rem 0;
    font-family: Gotham, "Helvetica Neue", Helvetica, Arial, "sans-serif";
    font-weight: bold;
    font-family: electronicFont;
  }
  .barbox2 li {
    margin-top: 0.1rem;
    font-size: 0.19rem;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
