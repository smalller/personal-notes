<template>
  <div class="childrenList">
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="班级" prop="status">
        <el-select v-model="params.clazzId" clearable placeholder="请选择">
          <el-option
            v-for="item in stuClass"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索" prop="name">
        <el-input v-model="params.name" placeholder="请输入姓名"></el-input>
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
    <el-dialog title="家长详情" :visible.sync="showInfo" width="25%" center>
      <div style="height: 500px; overflow: scroll">
        <el-form
          v-for="(item, index) in userInfo"
          :key="index"
          label-width="80px"
          label-position="left"
        >
          <div
            style="
              border: 2px solid #eeeeee;
              margin-top: 10px;
              padding-left: 10px;
            "
          >
            <el-form-item label="称呼:">
              <span>{{ item.familyRels.describe }}</span>
            </el-form-item>
            <el-form-item label="姓名:">
              <span>{{ item.familyName }}</span>
            </el-form-item>
            <el-form-item label="联系方式:">
              <span>{{ item.familyTelephone }}</span>
            </el-form-item>
            <el-form-item label="生日:">
              <span>{{ item.userBirthday }}</span>
            </el-form-item>
            <el-form-item label="性别:">
              <span>{{ +item.familySex === 1 ? '男' : '女' }}</span>
            </el-form-item>
            <el-form-item label="个性签名:">
              <span>{{ item.personSign }}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="showInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { GetParentInfo } from '@/api/child'
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  export default {
    components: {
      Table,
    },
    mixins: [tableMinix],
    props: {
      school: {
        type: Object,
        default: () => {
          return {}
        },
      },
      stuClass: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        isEdit: false,
        isEditCamera: false,
        isEditChildren: false,
        tableList: [],
        tableUrl: '/schools/api/student/getSchoolStuList',
        searchContent: {},
        params: {
          schoolId: this.school.id,
          stuStatus: 1,
        },
        type: 0, //确定是否修改和新增
        row: {},
        schoolData: {},
        showInfo: false,
        userInfo: [],
      }
    },
    computed: {
      colums() {
        return [
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
            prop: 'sex',
            label: '是否绑定家长',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{scope.row.isBind == 1 ? '已绑定' : '未绑定'}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row, $index } = scope
                return (
                  <div>
                    <el-button
                      type={+row.stuStatus === 1 ? 'success' : 'danger'}
                    >
                      {+row.stuStatus === 1 ? '已入园' : '未入园'}
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
                        this.show(scope.row)
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
      this.list()
    },
    methods: {
      reset() {
        this.params = {
          schoolId: this.school.id,
          pageNo: 1,
          pageSize: 20,
          total: 1,
        }
        this.list()
      },
      show(data) {
        this.userInfo = []
        if (data.schoolId) {
          GetParentInfo(data.schoolId, data.id).then((res) => {
            if (res.code == 0) {
              if (res.data.list.length) {
                this.showInfo = true
                this.userInfo = [...res.data.list]
              } else {
                this.$message({
                  type: 'warning',
                  message: '暂无家长信息!',
                })
              }
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .search_filter {
    margin-bottom: 20px;
  }
  .childrenList {
    // padding: 20px;
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
