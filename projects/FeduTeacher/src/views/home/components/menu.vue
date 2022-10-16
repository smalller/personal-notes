<template>
  <div class="myMenu">
    <div class="menuHead">
      <div>
        <span></span>
        <p>常用功能</p>
      </div>
      <div>
        <ui-button type="text" @click="openEditMenu">编辑</ui-button>
      </div>
    </div>
    <div class="menuContent">
      <div>
        <div class="menuItemTitle">校务管理</div>
        <div class="menuItemBox">
          <div
            class="menuItem"
            :class="{ disabled: !item.path }"
            v-show="item.show"
            v-for="item in aLIst"
            :key="item.name"
            @click="routeJump(item.path)"
          >
            <div :style="{ background: item.color }">
              <ui-icon :icon="`icon-${item.icon}`" />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="menuItemTitle">信息发布</div>
        <div class="menuItemBox">
          <div
            class="menuItem"
            v-show="item.show"
            @click="routeJump(item.path)"
            :class="{ disabled: !item.path }"
            v-for="item in bLIst"
            :key="item.name"
          >
            <div :style="{ background: item.color }">
              <ui-icon :icon="`icon-${item.icon}`" />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="menuItemTitle">教学备课</div>
        <div class="menuItemBox">
          <div
            class="menuItem"
            :class="{ disabled: !item.path }"
            v-show="item.show"
            @click="routeJump(item.path)"
            v-for="item in cLIst"
            :key="item.name"
          >
            <div :style="{ background: item.color }">
              <ui-icon :icon="`icon-${item.icon}`" />
            </div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      size="480px"
      v-model="visibility"
      title="I am the title"
      :with-header="false"
    >
      <div class="editMenuBox scroll">
        <div class="menuEditHead">
          <div>
            <div>编辑常用功能</div>
            <ui-button type="primary" @click="save">完成</ui-button>
          </div>
          <ui-icon @click="closeEditMenu" icon="icon-a-zu238" />
        </div>
        <div class="menuContent">
          <div>
            <div class="menuItemTitle">校务管理</div>
            <div class="menuItemBox">
              <div
                class="menuItem"
                v-for="item in getMenu('校务管理')"
                :key="item.name"
              >
                <div :style="{ background: item.color }">
                  <ui-icon :icon="`icon-${item.icon}`" />
                  <ui-icon
                    class="xs iconBtn"
                    v-if="!item.show"
                    icon="icon-xs"
                    @click="showMenu(item.name)"
                  />
                  <ui-icon
                    class="yc iconBtn"
                    v-else
                    @click="showMenu(item.name)"
                    icon="icon-yc"
                  />
                </div>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div>
            <div class="menuItemTitle">信息发布</div>
            <div class="menuItemBox">
              <div
                class="menuItem"
                v-for="item in getMenu('信息发布')"
                :key="item.name"
              >
                <div :style="{ background: item.color }">
                  <ui-icon :icon="`icon-${item.icon}`" />
                  <ui-icon
                    class="xs iconBtn"
                    v-if="!item.show"
                    icon="icon-xs"
                    @click="showMenu(item.name)"
                  />
                  <ui-icon
                    class="yc iconBtn"
                    v-else
                    @click="showMenu(item.name)"
                    icon="icon-yc"
                  />
                </div>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div>
            <div class="menuItemTitle">教学备课</div>
            <div class="menuItemBox">
              <div
                class="menuItem"
                v-for="item in getMenu('教学备课')"
                :key="item.name"
              >
                <div :style="{ background: item.color }">
                  <ui-icon :icon="`icon-${item.icon}`" />
                  <ui-icon
                    class="xs iconBtn"
                    v-if="!item.show"
                    icon="icon-xs"
                    @click="showMenu(item.name)"
                  />
                  <ui-icon
                    class="yc iconBtn"
                    v-else
                    @click="showMenu(item.name)"
                    icon="icon-yc"
                  />
                </div>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import menuConfig from "@/base/homeMenu/config";
import { Menu } from "@/base/interface";

export default defineComponent({
  name: "myMenu",
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const visibility = ref(false);
    const menu = computed(() => $store.state.system.menu);
    const saveMenu = ref<Menu[]>([]);

    if (menu.value.length <= 0) {
      $store.dispatch("setMenu", menuConfig);
    }
    const aLIst = computed(() =>
      $store.state.system.menu.filter((item: Menu) => item.title === "校务管理")
    );
    const bLIst = computed(() =>
      $store.state.system.menu.filter((item: Menu) => item.title === "信息发布")
    );
    const cLIst = computed(() =>
      $store.state.system.menu.filter((item: Menu) => item.title === "教学备课")
    );

    const routeJump = (path: string) => {
      const meta = $router.resolve({ name: path }).meta;
      if (meta?.type === "new") {
        const url = $router.resolve({
          name: path,
        }).href;
        window.open(url);
      } else {
        $router.push({ name: path });
      }
    };

    const openEditMenu = () => {
      saveMenu.value = JSON.parse(JSON.stringify(menu.value));
      visibility.value = true;
    };
    const closeEditMenu = () => {
      visibility.value = false;
    };
    const showMenu = (name: string) => {
      saveMenu.value = saveMenu.value.map((menu: Menu) => {
        if (menu.name === name) {
          menu.show = !menu.show;
        }
        return menu;
      });
    };

    const save = () => {
      $store.dispatch("setMenu", saveMenu);
      closeEditMenu();
    };
    const getMenu = (name: string) =>
      saveMenu.value.filter((menu) => menu.title === name);
    return {
      aLIst,
      bLIst,
      cLIst,
      visibility,
      saveMenu,
      routeJump,
      openEditMenu,
      closeEditMenu,
      showMenu,
      save,
      getMenu,
    };
  },
});
</script>

<style scoped lang="less">
.myMenu {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  .menuHead {
    height: 70px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    > div {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        width: 6px;
        height: 22px;
        background: #ffb73b;
        border-radius: 3px;
        margin-right: 10px;
      }
      p {
        font-size: 20px;
        color: #222222;
      }
    }
  }
  .editMenuBox {
    height: 100%;
    overflow-y: auto;
    padding: 0 20px;
  }
  .menuEditHead {
    padding: 0 40px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;
      padding: 20px 0 10px;
    }
    > .icon {
      fill: #999999;
      width: 13px;
      height: 13px;
      cursor: pointer;
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
  .menuContent {
    padding: 20px 40px;
    > div {
      padding-bottom: 40px;
      &:last-child {
        padding-bottom: 0;
      }
    }
    .menuItemTitle {
      margin-bottom: 16px;
      color: #222222;
      font-size: 18px;
      font-weight: 400;
    }
    .menuItemBox {
      display: grid;
      grid-template-rows: repeat(auto-fill, 85px);
      grid-template-columns: repeat(4, 60px);
      grid-row-gap: 26px;
      grid-column-gap: 40px;

      .menuItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        &.disabled {
          pointer-events: none;
        }
        > div {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .icon {
            width: 32px;
            height: 32px;
            fill: #ffffff;
          }
          .iconBtn {
            width: 20px;
            height: 20px;
            cursor: pointer;
            border: 2px solid #ffffff;
            border-radius: 50%;
            position: absolute;
            top: -10px;
            right: -10px;
            background: #ffffff;
            &.xs {
              fill: #4fa8f9;
            }
            &.yc {
              fill: #cccccc;
            }
          }
        }
        > span {
          margin-top: 6px;
          color: #222222;
          font-size: 14px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
