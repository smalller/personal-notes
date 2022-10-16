<template>
  <img
    v-if="isExternal"
    :src="styleExternalIcon"
    class="img-icon"
    v-on="$listeners"
  />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
  import { isExternal } from '@/utils/validate'

  export default {
    name: 'VabColorfulIcon',
    props: {
      icon: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
    },
    computed: {
      isExternal() {
        return isExternal(this.icon)
      },
      iconName() {
        return `#colorful-icon-${this.icon}`
      },
      svgClass() {
        if (this.className) return 'svg-icon ' + this.className
        else return 'svg-icon'
      },
      styleExternalIcon() {
        return this.icon
      },
    },
  }
</script>

<style lang="scss" scoped>
  .remix-icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: middle;
    fill: currentColor;
  }

  .img-icon {
    display: inline-block;
    width: 2em;
    height: 2em;
    vertical-align: middle;
  }
</style>
