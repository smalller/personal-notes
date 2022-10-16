<template>
  <div class="index-container">
    <!--      <page-header></page-header>-->
    <!--    <div class="title">{{ title }}</div>-->
    <span>
      <img src="./back.png" alt="" />
    </span>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Index',
    components: {},
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        title: 'settings/title',
      }),
    },

    created() {},
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    font-size: 48px;
    font-weight: bold;
    text-align: center;
    background: #fff !important;
    img {
      margin-top: 200px;
    }
  }
</style>
