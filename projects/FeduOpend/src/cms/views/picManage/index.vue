<template>
  <div>
    <Layout>
      <template #search>
        <search-filter @search="search" @resetes="resetPic"></search-filter>
      </template>
      <template #table>
        <Table
          :colums="colums"
          :data="tableList"
          :page-config="params"
          :list-loading="listLoading"
          @sizeChange="pageSizeChange"
          @currentChange="pageChange"
        ></Table>
      </template>
    </Layout>
  </div>
</template>

<script>
  import { DeletePicture } from '@/api/picture'
  import tableMixin from '@/cms/mixins/tableMixin'
  import Table from '@/cms/components/table'
  import Layout from '@/cms/components/Layout'
  import SearchFilter from './components/SearchFilter'
  export default {
    components: {
      Layout,
      SearchFilter,
      Table,
      Layout,
    },
    mixins: [tableMixin],
    data() {
      return {
        tableList: [],
        tableUrl: '/mamserver/api/picture/query',
        searchContent: {
          status: 1,
          bizTypes: 'album,Header,article,Recipes,Attendance,Pay',
        },
        params: {},
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'id',
            label: '图片ID',
            align: 'center',
          },
          {
            prop: 'originalName',
            label: '图片名称',
            align: 'center',
          },
          {
            prop: 'relativePath',
            label: '内容',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return (
                  <div>
                    <el-image
                      style="width: 60px; height: 50px"
                      src={scope.row.relativePath}
                      fit="scale-down"
                      preview-src-list={[scope.row.relativePath]}
                    ></el-image>
                  </div>
                )
              },
            },
          },
          {
            prop: 'createTime',
            label: '上传时间',
            align: 'center',
          },
          {
            prop: 'e',
            label: '上传人编号',
            align: 'center',
          },
          {
            prop: 'userType',
            label: '上传人角色',
            align: 'center',
          },
          {
            prop: 'username',
            label: '上传人名称',
            align: 'center',
          },
          {
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => this.deletePic(scope.row)}
                    >
                      删除
                    </el-button>
                  </div>
                )
              },
            },
          },
        ]
      },
    },
    created() {
      this.list()
    },
    methods: {
      //删除图片
      deletePic(data) {
        if (data !== undefined) {
          DeletePicture(data.id).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '图片删除成功!',
              })
              this.list()
            }
          })
        }
      },
      resetPic() {
        this.params = {}
        this.searchContent = {
          status: 1,
          bizTypes: 'album,Header,article,Recipes,Attendance,Pay',
        }
        this.list()
      },
    },
  }
</script>

<style lang="scss" scoped></style>
