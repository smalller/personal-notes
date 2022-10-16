<template>
  <div class="common_warpper">
    <slot name="search"></slot>
    <div class="common_btn">
      <slot name="btn"></slot>
    </div>
    <slot name="table"></slot>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss" scoped>
  .common_warpper {
    padding: 20px;
    .common_btn {
      margin-bottom: 20px;
    }
  }
</style>
