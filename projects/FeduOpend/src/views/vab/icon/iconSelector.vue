<template>
  <div class="icon-selector-container">
    <el-alert
      :closable="false"
      title="图标选择器演示"
      show-icon
      type="success"
    ></el-alert>
    <el-popover popper-class="icon-selector-popper" width="292" trigger="hover">
      <el-button slot="reference">
        <vab-remix-icon :icon="icon" />
        图标选择器
        <vab-remix-icon icon="arrow-down-s-line" />
      </el-button>
      <icon-table @handle-icon="handleIcon"></icon-table>
    </el-popover>
  </div>
</template>

<script>
  import IconTable from '@/extra/VabIconSelector'
  export default {
    name: 'IconSelector',
    components: { IconTable },
    data() {
      return {
        icon: '24-hours-fill',
      }
    },
    methods: {
      handleIcon(item) {
        this.icon = item
      },
    },
  }
</script>
