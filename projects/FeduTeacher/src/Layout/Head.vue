<template>
  <div class="head">
    <div>
      <ui-icon icon="icon-a-zu1985" v-if="isDrawer" @click="openNav"></ui-icon>
      <logo></logo>
      <school-select></school-select>
    </div>
    <div>
      <login-info></login-info>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import LoginInfo from "../components/loginInfo.vue";
import logo from "../components/logo.vue";
import SchoolSelect from "../components/schoolSelect.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: { logo, SchoolSelect, LoginInfo },
  setup() {
    const $store = useStore();
    const openNav = () => {
      $store.dispatch("changeDrawer", true);
    };
    const isDrawer = computed(() => $store.state.nav.isDrawer);
    const drawers = computed(() => $store.state.nav.drawer);
    return {
      openNav,
      isDrawer,
      drawers,
    };
  },
});
</script>

<style lang="less">
.head {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 40px;
  background: #ffffff;
  user-select: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  > div {
    display: flex;
    align-items: center;
  }
  .icon {
    width: 18px;
    height: 18px;
    margin-right: 20px;
    fill: #707070;
    cursor: pointer;
  }
}
</style>
