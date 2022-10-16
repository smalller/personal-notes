<template>
  <el-dropdown v-if="theme.showLanguage" @command="handleCommand">
    <vab-remix-icon icon="translate" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh">中文简体</el-dropdown-item>
      <el-dropdown-item command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import getPageTitle from '@/utils/pageTitle'

  export default {
    name: 'Language',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      ...mapActions({
        changeLanguage: 'settings/changeLanguage',
      }),
      async handleCommand(command) {
        this.changeLanguage(command)
        this.$i18n.locale = command
        document.title = await getPageTitle(this.$route.meta.title)
      },
    },
  }
</script>
