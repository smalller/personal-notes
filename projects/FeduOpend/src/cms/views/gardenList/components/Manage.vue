<template>
  <div class="manage">
    <div class="manage-title">
      <span>{{ school.address }} {{ school.name }}</span>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-arrow-left"
        style="float: right; margin-right: 10px"
        @click="back()"
      >
        返回
      </el-button>
    </div>
    <div class="manage-table">
      <el-tabs v-model="active">
        <el-tab-pane label="家长列表" name="parent">
          <parentList
            v-if="active === 'parent'"
            :school="school"
            :stu-class="classList"
          ></parentList>
        </el-tab-pane>
        <el-tab-pane label="幼儿列表" name="child">
          <childrenList
            v-if="active === 'child'"
            :school="school"
            :stu-class="classList"
          ></childrenList>
        </el-tab-pane>
        <el-tab-pane label="员工列表" name="staff">
          <staffList
            v-if="active === 'staff'"
            :school="school"
            :stu-class="classList"
          ></staffList>
        </el-tab-pane>
        <el-tab-pane label="监控开通记录" name="camera">
          <openList
            v-if="active === 'camera'"
            :school="school"
            :stu-class="classList"
          ></openList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { ForbidGarden, OpenGarden } from '@/api/garden'
  import tableMinix from '@/cms/mixins/tableMixin'
  import childrenList from './childrenList.vue'
  import parentList from './ParentList.vue'
  import staffList from './staffList.vue'
  import openList from './videoList.vue'
  export default {
    components: {
      openList,
      parentList,
      childrenList,
      staffList,
    },
    mixins: [tableMinix],
    props: {
      school: {
        type: Object,
        default: () => {
          return {}
        },
      },
      activeName: {
        type: String,
        default: () => {
          return 'parent'
        },
      },
      classList: {
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
        tableUrl: '/schools/student/query',
        searchContent: {
          schoolId: this.school.id,
        },
        active: this.activeName ? this.activeName : 'parent',
        type: 0, //确定是否修改和新增
        row: {},
        schoolData: {},
      }
    },
    computed: {
      colums() {
        return [
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
            prop: 'clazzName',
            label: '所在班级',
            align: 'center',
          },
          {
            prop: 'birthTime',
            label: '出生年月',
            align: 'center',
          },
          {
            prop: 'agentContactName',
            label: '是否下载',
            align: 'center',
          },
          {
            prop: 'contacts',
            label: '是否开通',
            align: 'center',
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
                        this.addGarden(1, scope.row)
                      }}
                    >
                      开通VIP
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
      console.log(this.school)
      // this.list()
    },
    methods: {
      changeStatus(params, index) {
        if (+params.forbid == 0) {
          //开启-》禁用需要提示
          this.$confirm('是否需要禁用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              ForbidGarden(params.id).then((res) => {
                if (+res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '禁用成功!',
                  })
                  this.tableList[index].forbid = 1
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消禁用',
              })
            })
        } else {
          OpenGarden(params.id).then((res) => {
            if (+res.code == 0) {
              this.$message({
                type: 'success',
                message: '开启成功!',
              })
              this.tableList[index].forbid = 0
            }
          })
        }
      },
      addGarden(type = 0, row = {}) {
        this.isEdit = true
        this.type = type
        if (Object.keys(row).length) {
          this.row = row
          setTimeout(() => {
            this.$refs.edit.init({
              ...row,
            })
          })
        }
      },
      //添加成功
      async success() {
        let that = this
        that.list()
        that.$forceUpdate()
        that.isEdit = false
      },
      async manageChildren(data) {
        this.schoolData = {}
        if (data) {
          this.schoolData = { ...data }
          this.isEditChildren = true
        }
      },
      async manageCarme(data) {
        this.schoolData = {}
        if (data) {
          this.schoolData = { ...data }
          this.isEditCamera = true
        }
      },
      back() {
        this.$emit('back')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .manage {
    .manage-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
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
