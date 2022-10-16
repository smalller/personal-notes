<template>
  <div class="nodata">
    <div v-show="+type == 1" class="title">
      <span>没有可分配的老师 </span>
      <p>请先到【教职工管理】页面新增教职工</p>
      <ui-button @click="setRouter('teacher')" class="button"
        >立即前往</ui-button
      >
    </div>
    <div v-show="+type == 2" class="title">
      <span>还没有导入班级幼儿 </span>
      <p>请先到【幼儿管理】页面新增幼儿</p>
      <ui-button @click="setRouter('student')" class="button"
        >立即前往</ui-button
      >
    </div>
    <div v-show="+type == 3" class="title">
      <span>还没有关联班级视频 </span>
      <p>请先到【班级视频管理】页面关联班级视频</p>
      <ui-button @click="setRouter('video')" class="button">立即前往</ui-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {
    type: {
      type: [String, Number],
      default: "",
    },
  },
  setup() {
    const $router = useRouter();
    const setRouter = (type: string) => {
      if (type === "teacher") {
        $router.push({
          name: "教职工管理",
        });
      } else if (type === "student") {
        $router.push({
          name: "幼儿管理",
        });
      } else if (type === "video") {
        $router.push({
          name: "班级视频管理",
        });
      }
    };
    return {
      setRouter,
    };
  },
});
</script>

<style lang="less" scoped>
.nodata {
  width: 100%;
  margin: auto;
  .title {
    text-align: center;
    margin-top: 30px;
    span {
      width: 238px;
      height: 45px;
      font-size: 14px;
      font-weight: 400;
      line-height: 25px;
      color: #666666;
    }
    p {
      // width: 238px;
      height: 45px;
      font-size: 14px;
      font-weight: 400;
      display: block;
      line-height: 25px;
      color: #666666;
      margin: auto;
    }
    .button {
      width: 92px;
      height: 32px;
      background: #ff9900;
      opacity: 1;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>
