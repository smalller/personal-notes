<script>
  export default {
    props: {
      data: {
        type: Array,
        required: true,
        defalut: () => [],
      },
      colums: {
        type: Array,
        default: () => [],
      },
      border: {
        type: Boolean,
        defalut: false,
      },
      isPage: {
        type: Boolean,
        default: true,
      },
      pageConfig: {
        type: Object,
        default: () => ({
          pageNo: 1, //页码
          pageSize: 20, //条数
          totalNum: 0, //总数
        }),
      },
      listLoading: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      renderColums(colums) {
        return colums.map((item) => {
          return (
            <el-table-column
              prop={item.prop}
              label={item.label}
              min-width={item.minWidth}
              width={item.width}
              scopedSlots={item.scopedSlots}
              show-overflow-tooltip={item.overflow}
              align={item.align}
              type={item.type}
            >
              {item.children &&
                item.children.length &&
                renderColums(item.children)}
            </el-table-column>
          )
        })
      },
      sizeChange(size) {
        // console.log(size)
        this.$emit('sizeChange', size)
      },
      currentChange(page) {
        this.$emit('currentChange', page)
      },
    },
    render() {
      let {
        renderColums,
        colums,
        data,
        border,
        isPage,
        pageConfig,
        sizeChange,
        currentChange,
      } = this
      let { pageNo, pageSize, total } = pageConfig
      // console.log(pageNo, pageSize, total, '--')
      return (
        <div>
          <el-table data={data} border={border} v-loading={this.listLoading}>
            {renderColums(colums)}
          </el-table>
          {isPage && (
            <el-pagination
              on-size-change={sizeChange}
              on-current-change={currentChange}
              current-page={pageNo}
              page-sizes={[10, 20, 30, 40, 50, 100]}
              page-size={pageSize}
              layout="total, sizes, prev, pager, next, jumper"
              total={total}
            ></el-pagination>
          )}
        </div>
      )
    },
  }
</script>
