<template>
  <div class="garden_warpper">
    <manage
      v-if="isManage"
      :school="schoolData"
      :class-list="classList"
      :active-name="selectType"
      @back="back"
    ></manage>
    <div v-else>
      <Edit
        v-if="isEdit"
        ref="edit"
        :type="type"
        :row="row"
        @success="success"
        @close="isEdit = false"
      ></Edit>
      <div v-else>
        <el-form ref="myForm" :inline="true" @submit.native.prevent>
          <el-form-item label="园所名称" prop="name">
            <el-input
              v-model="params.name"
              placeholder="请输入园所名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="园所ID" prop="id">
            <el-input v-model="params.id" placeholder="请输入园所ID"></el-input>
          </el-form-item>
          <el-form-item label="代理商" prop="keyword">
            <el-input
              v-model="params.keyword"
              placeholder="请输入姓名或电话号码"
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
        <el-button
          type="primary"
          style="margin-bottom: 20px"
          @click="addGarden(0, {})"
        >
          新增
        </el-button>
        <el-table ref="tableSort" v-loading="listLoading" :data="tableList">
          <el-table-column
            prop="id"
            label="园所ID"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="园所名称"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contactName"
            label="联系人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contactMobile"
            label="联系方式"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="address"
            label="所在区域"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="agentContactName"
            label="所属代理商"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contacts"
            label="代理商电话"
            align="center"
          ></el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <div>
                <el-button
                  :type="+scope.row.forbid === 1 ? 'danger' : 'success'"
                >
                  {{ +scope.row.forbid === 1 ? '已关停' : '使用中' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="beginDate"
            label="开通时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="action"
            label="操作"
            align="center"
            width="280px"
          >
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="setGarden(scope.row)">
                  设置
                </el-button>
                <el-button type="text" @click="addGarden(1, scope.row)">
                  编辑
                </el-button>
                <!--                <el-button-->
                <!--                  type="text"-->
                <!--                  @click="changeStatus(scope.row, scope.$index)"-->
                <!--                >-->
                <!--                  {{ row.forbid == 0 ? '禁用' : '启用' }}-->
                <!--                </el-button>-->
                <el-button type="text" @click="manageData(scope.row, 'child')">
                  用户信息
                </el-button>
                <el-button
                  type="text"
                  style="margin-right: 10px"
                  @click="openAttendanceSettings(scope.row)"
                >
                  考勤设置
                </el-button>
                <!--                <el-button type="text" @click="manageData(scope.row, 'child')">-->
                <!--                  幼儿-->
                <!--                </el-button>-->
                <!--                <el-button type="text" @click="manageData(scope.row, 'parent')">-->
                <!--                  家长-->
                <!--                </el-button>-->
                <!--                <el-button type="text" @click="manageData(scope.row, 'staff')">-->
                <!--                  员工-->
                <!--                </el-button>-->
                <!--                <el-button type="text">登入</el-button>-->
                <el-popconfirm
                  :title="`确定要${
                    +scope.row.forbid === 1 ? '启用' : '关停'
                  }园所吗?`"
                  @confirm="changeStatus(scope.row, scope.$index)"
                >
                  <el-button slot="reference" type="text">
                    园所{{ +scope.row.forbid === 1 ? '启用' : '关停' }}
                  </el-button>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="+params.pageNo"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :page-size="+params.pageSize"
          :total="+params.total"
          background
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="监控权益设置"
      :visible.sync="showCamera"
      width="20%"
      center
    >
      <el-form>
        <el-form-item label="限制开通数" prop="cameraTime">
          <el-input
            v-model="cameraNum"
            style="width: 40%"
            placeholder="请输入开通数量"
          ></el-input>
          <span style="margin-left: 10px">已开通：{{ cameraInfo }} 人</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="setCamera">确定</el-button>
        <el-button type="primary" @click="showCamera = false">关闭</el-button>
      </div>
    </el-dialog>
    <attendance-settings ref="attendanceSettings" @success="search()" />
  </div>
</template>

<script>
  import {
    ForbidGarden,
    OpenGarden,
    GetSchoolClass,
    GetSchoolCamera,
    SetSchoolCamera,
  } from '@/api/garden'
  // import Table from '@/cms/components/table'
  import Edit from './components/GardenEdit'
  import tableMinix from '@/cms/mixins/tableMixin'
  import manage from './components/Manage'
  import AttendanceSettings from '@/cms/views/gardenList/components/attendanceSettings'
  export default {
    components: {
      AttendanceSettings,
      // Table,
      Edit,
      manage,
    },
    mixins: [tableMinix],
    data() {
      return {
        isEdit: false,
        tableList: [],
        tableUrl: '/schools/api/school/query',
        params: {},
        searchContent: {},
        type: 0, //确定是否修改和新增
        row: {},
        schoolData: {},
        isManage: false,
        selectType: '',
        classList: [],
        queryData: {
          pageSize: 20,
          pageNo: 1,
        },
        showCamera: false,
        cameraNum: 0,
        cameraInfo: 0,
        selectedInfo: {},
      }
    },
    computed: {},

    created() {
      let data = this.$route.query.contactName
      if (data) {
        this.params = {
          keyword: data,
        }
        this.list(this.tableUrl)
      } else {
        this.list()
      }
    },
    methods: {
      //打开考勤设置
      openAttendanceSettings(row) {
        this.$refs.attendanceSettings.open(row)
      },
      setGarden(data) {
        console.log(data)
        this.cameraNum = 0
        this.selectedInfo = {}
        if (data.id) {
          this.selectedInfo = { ...data }
          this.showCamera = true
          GetSchoolCamera(data.id).then((res) => {
            if (+res.code == 0) {
              console.log(res)
              this.cameraInfo = res.data.cameraNum
              this.cameraNum = res.data.setNum
            }
          })
        }
      },
      setCamera() {
        if (this.cameraNum) {
          SetSchoolCamera(this.cameraNum, this.selectedInfo.id).then((res) => {
            if (+res.code == 0) {
              this.$message({
                type: 'success',
                message: '设置成功!',
              })
              this.showCamera = false
              this.cameraNum = 0
            }
          })
        } else {
          this.$message({
            type: 'info',
            message: '请先填写监控数量',
          })
        }
      },
      changeStatus(params, index) {
        if (+params.forbid == 0) {
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
      addGarden(type = 1, row = {}) {
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
        that.isEdit = false
        that.$forceUpdate()
        that.list()
      },
      manageData(data, type) {
        this.isManage = false
        this.selectType = ''
        this.classLsit = []
        if (data.id) {
          this.selectType = type
          this.schoolData = { ...data }
          GetSchoolClass(data.id).then((res) => {
            if (+res.code == 0) {
              console.log(res)
              this.classList = [...res.data]
              this.isManage = true
            }
          })
        }
      },
      back() {
        this.isManage = false
        this.list(this.tableUrl)
      },
      pageChange(data) {
        console.log(data)
        this.queryData.pageNo = data
        this.params.pageNo = this.queryData.pageNo
        this.params.pageSize = this.queryData.pageSize
        this.list()
      },
      sizeChange(data) {
        this.queryData.pageSize = data
        this.params = {
          pageNo: 1,
          pageSize: this.queryData.pageSize,
        }
        this.list()
      },

      search() {
        const vm = this
        vm.list(vm.tableUrl)
      },
      reset() {
        const vm = this
        vm.$set((vm.params = {}), 'pageNo', 1) // 初始化页码
        vm.list(vm.tableUrl)
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
