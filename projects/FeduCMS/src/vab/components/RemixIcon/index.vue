<template>
  <svg
    v-if="isCustomSvg"
    :class="svgClass"
    aria-hidden="true"
    v-on="$listeners"
  >
    <use :xlink:href="iconName" />
  </svg>
  <svg v-else-if="isDefaultSvg" class="remix-icon ri-*" v-on="$listeners">
    <use :xlink:href="remixIconPath + '#ri-' + icon"></use>
  </svg>
  <i v-else :class="'ri-' + icon" aria-hidden="true" v-on="$listeners"></i>
</template>
<script>
  import 'remixicon/fonts/remixicon.css'
  import { isExternal } from '@/utils/validate'

  export default {
    name: 'VabRemixIcon',
    props: {
      isCustomSvg: {
        type: Boolean,
        default: false,
      },
      isDefaultSvg: {
        type: Boolean,
        default: false,
      },
      icon: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        remixIconPath: require('remixicon/fonts/remixicon.symbol.svg'),
      }
    },
    computed: {
      isExternal() {
        return isExternal(this.icon)
      },
      iconName() {
        return `#remix-icon-${this.icon}`
      },
      svgClass() {
        if (this.className) {
          return 'remix-icon ' + this.className
        } else {
          return 'remix-icon'
        }
      },
      styleExternalIcon() {
        return this.icon
      },
    },
  }
</script>

<style lang="scss" scoped>
  [class*='ri'] {
    font-size: 16px;
    vertical-align: -3.5px;
  }

  .remix-icon {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: middle;
    fill: currentColor;
  }
</style>
