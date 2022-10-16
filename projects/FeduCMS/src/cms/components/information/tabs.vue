<template>
  <div class="type-box">
    <div
      v-for="item in topTypeList"
      :key="item.value"
      :class="['type-item', +currentType === item.value ? 'is-selected' : '']"
      @click="handleClick(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      topTypeList: {
        type: Array,
        required: true,
      },
      // current: {
      //   type: Number,
      // },
    },
    data() {
      return {
        currentType: 1,
      }
    },
    methods: {
      handleClick(item) {
        this.currentType = item.value
        this.$emit('changeTopType', item)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .type-box {
    display: flex;

    .type-item {
      font-size: 16px;
      color: #222;
      margin-right: 32px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      padding-bottom: 4px;
    }

    .is-selected {
      color: #1890ff;
      border-bottom: 2px solid #1890ff;
    }
  }
</style>
