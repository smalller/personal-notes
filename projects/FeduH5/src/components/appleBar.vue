<template>
<div class="appleBar" v-if="isApple"></div>
</template>

<script>

export default {
  name: "appleBar",
  data() {
    return{
      isApple: micell.ua.isIPhone() || micell.ua.isIPad() || micell.ua.isIOS() || micell.ua.isMacOS(),
    }
  }
}
</script>

<style scoped>
.appleBar {
  height: 34px;
  opacity: 0;
  width: 2px;
}
</style>
