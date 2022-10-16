<script>
  import request from '@/utils/request'
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
        tableList: [], //表格数据
        tableUrl: '', //查询列表地址
      }
    },
    methods: {
      // table列表查询
      list(url) {
        url = url ? url : this.tableUrl
        this.tableUrl = url
        this.listLoading = true
        return request({ url, method: 'GET', params: this.params })
          .then((res) => {
            if (+res.code === 0) {
              this.tableList = res.data.list
              this.params.total = res.data.page.totalNum
            }
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      // 查询
      search() {
        this.$set(this.params, 'pageNo', 1) // 初始化页码
        this.list()
      },
      // 翻页
      pageChange(val) {
        this.params.pageNo = val
        this.list()
      },
      // 改变页长
      sizeChange(val) {
        this.params.pageSize = val
        this.list()
      },
      //重置
      reset() {
        this.params = {
          pageNo: 1,
          pageSize: 20,
          total: 0,
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        }
        this.list()
      },
    },
  }
</script>
