<template>
  <div class="user-layout">
    <div class="bg-top"></div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute } from 'vue-router';
import { getRouteItem, RoutesDataItem, vueRoutes } from '@/utils/routes';
import UserLayoutRoutes from './routes';
import useTitle from '@/composables/useTitle';

export default defineComponent({
  name: 'UserLayout',
  setup() {
    const route = useRoute();

    // 所有菜单路由
    const menuData = ref<RoutesDataItem[]>(vueRoutes(UserLayoutRoutes, '/user'));

    // 当前路由 item
    const routeItem = computed<RoutesDataItem>(() => getRouteItem(route.path, menuData.value as RoutesDataItem[]));

    // 设置title
    useTitle(routeItem);

  }
})
</script>
<style lang="scss" scoped>
.user-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 500px;
  overflow: auto;
  background-image: url("../../assets/images/bg-smooth.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  align-items: center;

  .bg-top {
    background-image: url('../../assets/images/bg-top.png');
    width: 880px;
    height: 140px;
    position: fixed;
    top: 24px;
    left: 80px;
  }

  .lang {
    position: absolute;
    top: 20px;
    right: 50px;

    ::v-deep(.el-dropdown) {
      .dropDown {

        i,
        .svg-icon {
          color: #ffffff;
          font-size: 16px;
        }
      }
    }
  }
}
</style>