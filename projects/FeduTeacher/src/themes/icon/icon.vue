<template>
  <!--  <div class="ui-icon"></div>-->
  <svg class="icon ui-icon" aria-hidden="true">
    <use :xlink:href="`#${icon}`"></use>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ui-icon",

  props: {
    icon: {
      type: String,
      default: "",
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
