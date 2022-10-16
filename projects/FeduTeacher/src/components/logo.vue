import { defineComponent } from "vue";

<template>
  <div class="logo" @click="backHOme">
    <img src="@/assets/logo.png" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const logo = ref("");
    const router = useRouter();

    const backHOme = () => {
      router.push("/");
    };
    return {
      logo,
      backHOme,
    };
  },
});
</script>
<style lang="less" scoped>
.logo {
  height: 40px;
  cursor: pointer;
  img {
    height: 100%;
  }
}
</style>
