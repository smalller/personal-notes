<template>
  <div class="garden_warpper">
    <edit
      v-if="isEdit"
      ref="childrenEdit"
      @cancel="isEdit = false"
      @success="success"
    ></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="园所ID">
          <el-input
            v-model="params.schoolId"
            placeholder="请输入幼儿园名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="params.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="params.contacts"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            native-type="submit"
            type="primary"
            @click="search()"
          >
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <Table
        :colums="colums"
        :data="tableList"
        :list-loading="listLoading"
        :page-config="params"
        @sizeChange="pageSizeChange"
        @currentChange="pageChange"
      ></Table>
    </div>
  </div>
</template>

<script>
  import Table from '@/cms/components/table'
  import Edit from './components/editChildren'
  import tableMinix from '@/cms/mixins/tableMixin'
  export default {
    components: {
      Table,
      Edit,
      // SearchFilter,
      // CamerList,
      // childrenList,
    },
    mixins: [tableMinix],
    props: {
      school: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        isEdit: false,
        tableList: [],
        tableUrl: '/schools/api/student/getStudentList',
        searchContent: {},
        params: {},
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'schoolId',
            label: '园所ID',
            align: 'center',
          },
          {
            prop: 'schoolName',
            label: '所在幼儿园',
            align: 'center',
          },
          {
            prop: 'clazzName',
            label: '所在班级',
            align: 'center',
          },
          {
            prop: 'name',
            label: '幼儿姓名',
            align: 'center',
          },
          {
            prop: 'contacts',
            label: '家长电话',
            align: 'center',
          },
          {
            prop: 'sex',
            label: '性别',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{scope.row.sex == 1 ? '男' : '女'}</span>
                  </div>
                )
              },
            },
          },

          {
            prop: 'birthTime',
            label: '出生年月',
            align: 'center',
          },
          {
            prop: 'isBind',
            label: '是否绑定家长',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{+scope.row.isBind == 0 ? '未绑定' : '已绑定'}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'stuStatus',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return (
                  <div>
                    <el-button
                      type={+scope.row.stuStatus == 1 ? 'success' : 'danger'}
                    >
                      {+scope.row.stuStatus == 1 ? '已入园' : '未入园'}
                    </el-button>
                  </div>
                )
              },
            },
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.edit(scope.row)
                      }}
                    >
                      修改
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.manageCustomer(scope.row)
                      }}
                    >
                      查看家长
                    </el-button>
                  </div>
                )
              },
            },
          },
        ]
      },
    },
    mounted() {
      if (this.$route.query.phone) {
        this.searchContent.contacts = this.$route.query.phone
        this.list()
      } else if (this.$route.query.school) {
        this.searchContent.schoolId = this.$route.query.school
        this.list()
      } else {
        this.list()
      }
    },
    methods: {
      edit(data) {
        this.isEdit = true
        let vm = this
        setTimeout(() => {
          vm.$refs.childrenEdit.init(data)
        })
      },
      resets() {
        this.list()
      },
      //添加成功
      async success() {
        let that = this
        that.list()
        that.isEdit = false
      },
      manageCustomer(row) {
        this.$router.push({
          path: '/userManage/customerList',
          query: { phone: row.contacts },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .search_filter {
    margin-bottom: 20px;
  }
  .garden_warpper {
    padding: 20px;
    .add_btn {
      margin: 0 20px;
    }
    .header_title {
      font-size: 14px;
      font-weight: bold;
    }
    .table {
      margin-top: 20px;
    }
  }
</style>
