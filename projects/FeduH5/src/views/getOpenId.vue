<template>
<div class="getOpenId"></div>
</template>

<script>
import openId from "@/pay/openId";

export default {
  name: "getOpenId",
  mixins: [openId],
  methods: {},
  created() {
    console.log(this.$route.query)
  }
}
</script>

<style scoped>

</style>
