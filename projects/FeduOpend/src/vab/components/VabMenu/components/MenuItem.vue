<template>
  <el-menu-item :index="itemOrMenu.path" @click="handleLink">
    <vab-remix-icon
      v-if="itemOrMenu.meta && itemOrMenu.meta.remixIcon"
      :is-custom-svg="itemOrMenu.meta.isCustomSvgIcon"
      :icon="itemOrMenu.meta.remixIcon"
      class="vab-remix-icon"
    />
    <span>{{ translateTitle(itemOrMenu.meta.title) }}</span>
    <el-tag
      v-if="itemOrMenu.meta && itemOrMenu.meta.badge"
      effect="dark"
      type="danger"
    >
      {{ itemOrMenu.meta.badge }}
    </el-tag>
  </el-menu-item>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { isExternal } from '@/utils/validate'

  export default {
    name: 'MenuItem',
    props: {
      itemOrMenu: {
        type: Object,
        default() {
          return null
        },
      },
    },
    methods: {
      translateTitle,
      handleLink() {
        console.log('handleLink', this.itemOrMenu)
        const routePath = this.itemOrMenu.path
        const target = this.itemOrMenu.meta.target
        if (target === '_blank') {
          if (isExternal(routePath)) window.open(routePath)
          else if (this.$route.path !== routePath) window.open(routePath.href)
        } else {
          if (isExternal(routePath)) window.location.href = routePath
          else if (this.$route.path !== routePath) this.$router.push(routePath)
        }
      },
    },
  }
</script>
