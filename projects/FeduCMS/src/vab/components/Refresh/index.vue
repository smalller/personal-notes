<template>
  <vab-remix-icon
    v-if="theme.showRefresh"
    icon="refresh-line"
    @click="refreshRoute"
  />
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Refresh',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      async refreshRoute() {
        this.$baseEventBus.$emit('reload-router-view')
      },
    },
  }
</script>
