<!--schooldId混入 绝大多数地方会用到schooldId 与 shooldId数组列表 单独用mixin混入处理-->
<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        school: 'user/school', //当前默认学校id
        schoolId: 'user/schoolId', //学校id数组 为以后做切换准备
      }),
    },
  }
</script>

<style scoped></style>
