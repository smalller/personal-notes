<!--table列表 mixin混入管理-->
<script>
  import request from '@/utils/request'
  import cookie from 'vue-cookie'
  let vm
  export default {
    data() {
      return {
        params: {
          pageNo: 1, //页码
          pageSize: 20, //条数
          total: 0, //总数
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        },
        listLoading: false, //加载动画
        tableUrl: '', //查询列表地址
        tableList: [], //表格数据
        isEdit: false, //是否为编辑或新增页面
      }
    },
    created() {
      vm = this
    },
    methods: {
      //  table列表查询
      list(url) {
        const vm = this
        vm.listLoading = true //默认开启加载动画
        url = url ? url : vm.tableUrl
        vm.tableUrl = url
        // console.log('查询的参数', vm.params)
        return request({ url, method: 'GET', params: vm.params }).then(
          (list) => {
            vm.listLoading = false
            // console.log('查询的列表', list)
            //处理列表数据逻辑
            if (+list.code === 0) {
              vm.tableList = list.data.list || []
              vm.params.total = +list.data.page.totalNum || 0
            }
          }
        )
      },
      // 查询
      search() {
        this.$set(vm.params, 'pageNo', 1) // 初始化页码
        this.list()
      },
      //删除
      del(url, data) {
        return request({ url, data })
      },
      //处理翻页
      pageChange(val) {
        this.params.pageNo = val
        this.list()
      },
      //查询limit改变
      sizeChange(val) {
        this.params.pageSize = val
        this.list()
      },
      //重置
      reset() {
        vm.params = {
          pageNo: 1,
          pageSize: 20,
          total: 0, //总数
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        }
        vm.list()
      },
    },
  }
</script>

<style scoped></style>
