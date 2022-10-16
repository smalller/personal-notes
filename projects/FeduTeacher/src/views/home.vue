<template>
  <div class="home">
    <ui-image-clip></ui-image-clip>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  setup() {
    const show = ref(false);
    // const data = ref([] as Array<Column>);
    const imgInfo = "";
    const map2 = ref({
      value: "55%",
      isStudent: true,
    });
    const data = ref([
      {
        title: 1,
        name: "a",
      },
      {
        title: 2,
        name: "b",
      },
      {
        title: 3,
        name: "c",
      },
      {
        title: 1,
        name: "d",
      },
    ]);
    const map = {
      title: "已开启",
      name: ["太阳班", "太阳班1", "太阳班2", "太阳班3", "太阳班4", "太阳班5"],
      data: [100, 200, 400, 450, 500, 600],
    };
    watch(show, () => {
      console.log(1);
    });
    // vm.appContext.config.globalProperties.$message.success("fasdasdfas");
    setTimeout(() => {
      show.value = true;
    }, 3000);
    const index = ref(0);
    const getImg = (data: any) => {
      console.log(data);
    };
    return {
      index,
      show,
      data,
      imgInfo,
      map,
      map2,
      getImg,
    };
  },
});
</script>

<style scoped lang="less">
.home {
  // position: absolute;
  width: 100%;
  height: 100%;
}
.test {
  border-radius: 50%;
  height: 200px;
  width: 200px;
  background-color: rgb(233, 19, 19);
  border-radius: 50%;
  /*background: url(1.png) no-repeat;*/
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -moz-transform: scale(0);
  transform: scale(0);
  -webkit-transform-origin: center center 0;
  -moz-transform-origin: center center 0;
  -ms-transform-origin: center center 0;
  transform-origin: center center 0;
  -webkit-transition: all 0.6s ease 0s;
  -moz-transition: all 0.6s ease 0s;
  transition: all 0.6s ease 0s;
}
</style>
