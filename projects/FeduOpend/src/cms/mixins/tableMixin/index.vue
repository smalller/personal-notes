<!--table列表 mixin混入管理-->
<script>
  import request from '@/utils/request'
  export default {
    data() {
      return {
        params: {
          pageNo: 1, //页码
          pageSize: 20, //条数
          total: 0, //总数
          // schoolId: sessionStorage.getItem('zdyjb_schoolId'),
          // isVip: '',
          // bindStudent: '',
        },
        headers: {},
        listLoading: false, //加载动画
        tableUrl: '', //查询列表地址
        tableList: [], //表格数据
        isEdit: false, //是否为编辑或新增页面
        searchContent: {},
      }
    },
    created() {},
    methods: {
      //  table列表查询
      list(url) {
        const self = this
        self.listLoading = true //默认开启加载动画
        url = url ? url : self.tableUrl
        self.tableUrl = url
        // console.log('查询的参数', self.params)
        let params = { ...self.params, ...self.searchContent }
        if (!params.id) {
          delete params.id
        }
        return request({ url, method: 'GET', params })
          .then((list) => {
            self.listLoading = false
            // console.log('查询的列表', list)
            //处理列表数据逻辑
            if (+list.code === 0) {
              self.tableList = list.data.list || []
              self.params.total = +list.data.page.totalNum || 0
            }
          })
          .finally(() => {
            self.listLoading = false
          })
      },
      // 查询
      search(val) {
        const self = this
        self.$set(self.params, 'pageNo', 1) // 初始化页码
        this.searchContent = val
        // console.log(self.params, '查询内容')
        self.list()
      },
      //删除
      del(url, data, msg = '是否确定删除？', method = 'post') {
        const self = this
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            request({ url, data, method }).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                this.list()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
      //处理翻页
      pageChange(val) {
        const self = this
        self.params.pageNo = val
        self.list()
      },
      //每页条数改变
      pageSizeChange(val) {
        const self = this
        self.params.pageSize = val
        self.list()
      },
      //查询limit改变
      sizeChange(val) {
        const self = this
        self.params.pageSize = val
        self.list()
      },
      //重置
      reset(data) {
        const self = this
        for (const paramsKey in self.params) {
          self.params[paramsKey] = ''
        }
        self.params = Object.assign(self.params, {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        })
        self.searchContent = data ? data : {}
        self.list()
      },
    },
  }
</script>

<style scoped></style>
