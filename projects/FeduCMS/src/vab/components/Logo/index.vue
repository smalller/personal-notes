<template>
  <div class="logoBox" :class="'logo-container-' + theme.layout">
    <router-link to="/">
      <span class="logo">
        <!-- 使用内置svg示例 -->
        <img v-if="url" :src="url" alt="" />
        <!-- 使用自定义svg示例 -->
        <!-- <vab-remix-icon v-if="logo" :icon="logo" is-custom-svg /> -->
      </span>
      <span
        :class="{ 'hidden-xs-only': theme.layout === 'horizontal' }"
        class="title"
      >
        {{ titles ? titles : title }}
      </span>
    </router-link>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import request from '@/utils/request'
  export default {
    name: 'Logo',
    data() {
      return {
        url: require('../../../assets/logo.png'),
        titles: '',
      }
    },
    computed: {
      ...mapGetters({
        logo: 'settings/logo',
        title: 'settings/title',
        theme: 'settings/theme',
      }),
    },
    created() {
      // this.getLogo()
      // this.findName()
    },
    methods: {
      ...mapMutations({
        setTitle: 'settings/setTitle',
      }),
      // 后管logo
      // getLogo() {
      //   request({
      //     url: `/home/unAccess/ad/list?type=300416`,
      //     method: 'post',
      //     data: {},
      //   }).then((res) => {
      //     if (res.data) {
      //       this.url = res.data.list[0].imgUrl
      //     }
      //   })
      // },
      // // 查询机构名称
      // findName() {
      //   request({
      //     url: '/home/unAccess/share/getFirmName',
      //     method: 'GET',
      //   }).then((res) => {
      //     if (+res.code === 0) {
      //       document.title = res.data
      //       this.setTitle(res.data)
      //       this.titles = res.data
      //       // this.setIco()
      //     }
      //   })
      // },
    },
  }
</script>
<style lang="scss" scoped>
  @mixin container {
    position: relative;
    height: $base-top-bar-height;
    overflow: hidden;
    line-height: $base-top-bar-height;
    background: transparent;
  }
  .logoBox {
    .logo {
      img {
        width: 94px !important;
        height: 36px !important;
        margin-right: 20px !important;
      }
    }
  }

  @mixin logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    color: $base-title-color;
    vertical-align: middle;
  }

  @mixin title {
    display: inline-block;
    overflow: hidden;
    font-size: 18px;
    line-height: 55px;
    color: $base-title-color;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .logo-container-horizontal,
  .logo-container-common {
    @include container;

    .logo {
      svg,
      img {
        @include logo;
      }
    }

    .title {
      @include title;
    }
  }

  .logo-container-vertical,
  .logo-container-gallery,
  .logo-container-comprehensive {
    @include container;

    height: $base-logo-height;
    line-height: $base-logo-height;
    text-align: center;

    .logo {
      svg,
      img {
        @include logo;
      }
    }

    .title {
      @include title;
      max-width: calc(#{$base-left-menu-width} - 60px);
    }
  }

  .logo-container-gallery {
    background: $base-gallery-second-menu-background !important;

    .logo {
      position: fixed;
      top: 0;
      display: block;
      width: $base-left-menu-width-min;
      height: $base-logo-height;
      margin: 0;
      background: $base-gallery-first-menu-background;
    }

    .title {
      padding-right: 15px;
      padding-left: 15px;
      margin-left: $base-left-menu-width-min;
      color: $base-color-black !important;
      background: $base-gallery-second-menu-background !important;
      @include title;
    }
  }
</style>
