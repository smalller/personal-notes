<template>
  <el-drawer
    custom-class="drawer-box"
    v-model="drawerStatus"
    :before-close="handleClose"
    destroy-on-close
    z-index="99"
  >
    <div class="init-sched-course-wrap">
      <TopType
        :topTypeList="staticData.initSchedCourseTopTypeList"
        @changeTopType="changeTopType"
      ></TopType>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import TopType from "@/components/TopType.vue";
import { staticData } from "../index";

export default defineComponent({
  name: "",
  components: {
    TopType,
  },
  setup() {
    const drawerStatus = ref(false);
    const targetTopType = ref(1);

    // 关闭抽屉回调
    const handleClose = (): void => {
      drawerStatus.value = false;
    };

    // 打开抽屉
    const handleOpen = (res: any): void => {
      drawerStatus.value = true;
    };

    // 切换菜单栏
    const changeTopType = (res: any): void => {
      console.log(res);
      targetTopType.value = res.value;
    };

    return {
      drawerStatus,
      handleClose,
      handleOpen,
      staticData,
      changeTopType,
      targetTopType,
    };
  },
});
</script>
<style lang="less">
.drawer-box {
  width: 960px !important;
  .init-sched-course-wrap {
    padding: 0 40px 40px 40px;
  }
}
</style>
