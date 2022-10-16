<template>
  <div class="navContainer" :style="{ paddingLeft: isDrawer ? '0' : '220px' }">
    <div v-if="!isDrawer" class="nav scroll">
      <ul class="navBox">
        <li
          v-for="item in menu_item"
          :key="item.meta.uuid"
          v-show="!item.meta?.hidden"
          :class="{
            activeNav:
              item?.children?.length <= 1 && item.meta.uuid === activeLink,
          }"
        >
          <div @click="toLink(item.path, item.meta.uuid, item.meta)">
            <div>
              <ui-icon class="icons" :icon="item.meta?.icon"></ui-icon
              ><span>{{ item.name }}</span>
            </div>
            <ui-icon
              class="iconss"
              icon="icon-a-9"
              v-show="
                routerLinks.indexOf(item.meta.uuid) > -1 &&
                item?.children?.length > 1
              "
            ></ui-icon
            ><ui-icon
              class="iconss"
              icon="icon-a-51"
              v-show="
                routerLinks.indexOf(item.meta.uuid) === -1 &&
                item?.children?.length > 1
              "
            ></ui-icon>
          </div>
          <el-collapse-transition>
            <div
              v-if="
                routerLinks.indexOf(item.meta.uuid) > -1 &&
                item?.children?.length > 1
              "
            >
              <ul class="navItemBox">
                <li
                  v-for="inner in item.children"
                  v-show="!inner.meta?.hidden"
                  :key="inner.meta.uuid"
                  :class="{
                    activeNav: inner.meta.uuid === activeLinkTwo,
                  }"
                >
                  <!-- <ui-icon :icon="inner.meta?.icon"></ui-icon> -->
                  <span
                    v-if="!inner.meta?.hidden"
                    @click="
                      toLinkTwo(item.path + '/' + inner.path, inner.meta.uuid)
                    "
                    >{{ inner.name }}</span
                  >
                </li>
              </ul>
            </div>
          </el-collapse-transition>
        </li>
      </ul>
    </div>
    <el-drawer
      v-else
      direction="ltr"
      v-model="drawer"
      size="244"
      custom-class="nav-drawer"
      :show-close="false"
      @close="closeNav"
    >
      <div class="nav">
        <div class="navHead">
          <ui-icon icon="icon-a-zu1984" @click="closeNav"></ui-icon>
          <logo></logo>
        </div>
        <ul class="navBox">
          <li
            v-for="item in menu_item"
            :key="item.meta.uuid"
            v-show="!item.meta?.hidden"
          >
            <!--            :class="{ activeNav: item.meta.uuid === activeLink }"-->
            <div @click="toLink(item.path, item.meta.uuid)">
              <div>
                <ui-icon class="icons" :icon="item.meta?.icon"></ui-icon
                ><span>{{ item.name }}</span>
              </div>
              <ui-icon
                class="iconss"
                icon="icon-a-9"
                v-show="
                  item.meta.uuid !== activeLink && item?.children?.length > 1
                "
              ></ui-icon
              ><ui-icon
                class="iconss"
                icon="icon-a-51"
                v-show="
                  item.meta.uuid === activeLink && item?.children?.length > 1
                "
              ></ui-icon>
            </div>
            <el-collapse-transition
              ><div
                v-if="item?.children?.length > 1"
                v-show="item.meta.uuid === activeLink"
              >
                <ul class="navItemBox">
                  <li
                    v-for="inner in item.children"
                    v-show="!inner.meta?.hidden"
                    :key="inner.meta.uuid"
                    :class="{
                      activeNav: inner.meta.uuid === activeLinkTwo,
                    }"
                  >
                    <!-- <ui-icon :icon="inner.meta?.icon"></ui-icon> --><span
                      @click="
                        toLinkTwo(item.path + '/' + inner.path, inner.meta.uuid)
                      "
                      >{{ inner.name }}</span
                    >
                  </li>
                </ul>
              </div>
            </el-collapse-transition>
          </li>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import "element-plus/lib/theme-chalk/base.css";
import { ElCollapseTransition } from "element-plus";
import { createRoute } from "@/router";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Logo from "@/components/logo.vue";
export default defineComponent({
  name: "Nav",
  components: {
    Logo,
    ElCollapseTransition,
  },
  setup() {
    const $store = useStore();
    const activeLink = computed(() => $store.state.nav.activeRouter);
    const activeLinkTwo = computed(() => $store.state.nav.activeRouterChild);
    const isDrawer = computed(() => $store.state.nav.isDrawer);
    const drawers = computed(() => $store.state.nav.drawer);
    const drawer = ref(false);

    const routerLinks = ref<string[]>([]);

    watch(drawers, () => {
      drawer.value = drawers.value;
    });

    const menu_item = computed(() => {
      return useRouter().options.routes;
    });
    const router = useRouter();
    const theCreateRoute = () => {
      return createRoute();
    };
    const resizeNav = () => {
      if (window.innerWidth <= 768) {
        if (!isDrawer.value) {
          $store.dispatch("changeIsDrawer", true);
        }
      } else {
        if (isDrawer.value) {
          $store.dispatch("changeIsDrawer", false);
          closeNav();
        }
      }
    };
    window.onresize = () => {
      resizeNav();
    };

    onMounted(() => {
      resizeNav();
    });

    /**
     * 关闭导航弹窗
     */
    const closeNav = () => {
      $store.dispatch("changeDrawer", false);
    };

    interface Meta {
      uuid: string;
      type?: string;
    }

    const toLink = (link: string, uuid: string, meta: Meta) => {
      if (routerLinks.value.indexOf(uuid) > -1) {
        routerLinks.value = routerLinks.value.filter((id) => id !== uuid);
      } else {
        routerLinks.value.push(uuid);
      }
      if (uuid !== activeLink.value) {
        console.log(meta);
        if (meta.type && meta.type === "new") {
          const url = router.resolve({
            path: link,
          }).href;
          window.open(url);
        } else {
          router.push({ path: link });
        }
      }
    };

    const toLinkTwo = (link: string) => {
      router.push({ path: link });
    };

    return {
      toLinkTwo,
      toLink,
      router,
      theCreateRoute,
      menu_item,
      activeLink,
      activeLinkTwo,
      drawer,
      isDrawer,
      closeNav,
      routerLinks,
    };
  },
});
</script>

<style scoped lang="less">
.nav-enter-active,
.nav-leave-active {
  transition: all 0.3s;
  //transform: scale(1);
  // opacity: 1 !important;
  height: 100px;
}
.nav-enter,
.nav-leave-to {
  // opacity: 0 !important;
  //left: 100vw !important;
  //transform: scale(0) !important;
  height: 0;
}
.nav-drawer {
  padding-right: 24px !important;
  background: #f8f8f8 !important;
  .navBox {
    padding-left: 0 !important;
  }
}
.navContainer {
  .el-overlay {
    background: rgba(0, 0, 0, 0) !important;
  }
  .nav-drawer {
    .nav {
      position: unset;
    }
  }
}

.nav {
  width: 220px;
  padding-left: 24px;
  background: #f8f8f8;
  box-sizing: border-box;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  * {
    user-select: none;
  }
  .navBox li div {
    display: flex;
  }
  .navHead {
    display: flex;
    align-items: center;
    padding: 10px 0 20px 0;
    .icon {
      width: 18px;
      height: 18px;
      fill: #707070;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .navBox {
    padding-left: 16px;
    > li {
      font-size: 16px;
      min-height: 54px;
      padding-right: 16px;
      > div:nth-child(1) {
        height: 54px;
        cursor: pointer;
        width: 100%;
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        .icon {
          //margin-left: 16px;
          margin-right: 10px;
        }
      }
      &.activeNav {
        > div {
          > div {
            > .icons {
              fill: #ff9900;
            }
            > span {
              color: #ff9900;
            }
          }
        }
      }
    }
    padding-bottom: 5px;
  }
  .navItemBox {
    li {
      width: 156px;
      height: 36px;
      font-size: 14px;
      padding-left: 30px;
      display: flex;
      align-items: center;
      &.activeNav {
        span {
          color: #ff9900;
        }
      }
    }
  }
  li {
    list-style: none;
    color: #222222;
    .icons {
      width: 20px;
      height: 20px;
      fill: #aaaaaa;
    }
    .iconss {
      fill: #aaaaaa;
      width: 12px;
      height: 7px;
    }
    span {
      cursor: pointer;
    }
  }
}
</style>
