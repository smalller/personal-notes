<script>
  export default {
    data() {
      return {
        fileAction: '',
        header: {},
      }
    },
    created() {
      let vm = this
      vm.header = {
        firmId: firmId,
        token: vm.$cookie.get(`token_${firmId}`),
        userId: vm.$cookie.get(`${firmId}_user_id`),
      }
    },
  }
</script>

<style scoped></style>
