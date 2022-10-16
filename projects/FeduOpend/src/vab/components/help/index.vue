<template>
  <div class="help">
    <!--    <span @click="goToHelp">帮助中心</span>-->
    <!--    <div @click="goToHelp">-->
    <!--      <img-->
    <!--        src="../../../cms/assets/images/help.svg"-->
    <!--        onload="SVGInject(this)"-->
    <!--        alt="帮助中心"-->
    <!--        title="帮助中心"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script>
  export default {
    name: 'Help',
    methods: {
      goToHelp() {
        window.open('https://www.zhidiansaas.com/help')
      },
    },
  }
</script>

<style lang="scss">
  .help {
    i {
      cursor: pointer;
    }
    span {
      cursor: pointer;
    }
    div {
      cursor: pointer;
      &:hover {
        svg {
          path {
            fill: #1865de;
          }
        }
      }
    }
  }
</style>
