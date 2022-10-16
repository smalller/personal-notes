<template>
  <component :is="menuComponent" v-if="!item.hidden" :item-or-menu="itemOrMenu">
    <template v-if="item.children && item.children.length">
      <el-scrollbar
        v-if="layout === 'horizontal' && item.children.length > 18"
        style="height: 86vh"
      >
        <vab-menu
          v-for="route in item.children"
          :key="route.path"
          :item="route"
        />
      </el-scrollbar>
      <template v-else>
        <vab-menu
          v-for="route in item.children"
          :key="route.path"
          :item="route"
        />
      </template>
    </template>
  </component>
</template>

<script>
  export default {
    name: 'VabMenu',
    props: {
      item: {
        type: Object,
        required: true,
      },
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        itemOrMenu: this.item,
        menuComponent: 'MenuItem',
      }
    },
    created() {
      const showChildren = this.handleChildren(this.item.children)
      if (showChildren.length) {
        if (showChildren.length === 1 && this.item.alwaysShow !== true)
          this.itemOrMenu = this.item.children[0]
        else this.menuComponent = 'Submenu'
      }
    },
    methods: {
      handleChildren(children = []) {
        if (!children) return []
        return children.filter((item) => {
          return item.hidden !== true
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-tag {
      float: right;
      height: 16px;
      padding-right: 4px;
      padding-left: 4px;
      margin-top: calc((#{$base-menu-item-height} - 16px) / 2 + 1px);
      line-height: 16px;
      border: 0;
    }
  }
</style>
