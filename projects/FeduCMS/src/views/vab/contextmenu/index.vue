<template>
  <div class="contextmenu-container">
    <Vab-contextmenu ref="contextmenu" :theme="theme">
      <Vab-contextmenu-item>
        <vab-remix-icon icon="24-hours-fill" />
        菜单1
      </Vab-contextmenu-item>
      <Vab-contextmenu-item divider></Vab-contextmenu-item>
      <Vab-contextmenu-item>
        <vab-remix-icon icon="4k-line" />
        菜单2
      </Vab-contextmenu-item>
      <Vab-contextmenu-item divider></Vab-contextmenu-item>
      <Vab-contextmenu-submenu title="子菜单">
        <Vab-contextmenu-item>
          <vab-remix-icon icon="a-b" />
          菜单4
        </Vab-contextmenu-item>
      </Vab-contextmenu-submenu>
    </Vab-contextmenu>

    <el-button v-contextmenu:contextmenu>右键点击此按钮</el-button>
  </div>
</template>

<script>
  import {
    directive,
    VabContextmenu,
    VabContextmenuItem,
    VabContextmenuSubmenu,
  } from '@/extra/vabContextmenu'

  export default {
    name: 'Contextmenu',
    directives: {
      contextmenu: directive,
    },
    components: {
      VabContextmenu,
      VabContextmenuItem,
      VabContextmenuSubmenu,
    },
    props: {
      theme: {
        type: String,
        default: 'default',
      },
    },
    data() {
      return {}
    },
  }
</script>
<style lang="scss" scoped>
  ::v-deep {
    .vab-contextmenu-item {
      padding: 10px 14px;
      line-height: 1;
      color: #333;
      border: 0;
    }
  }
</style>
