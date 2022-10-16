<template>
  <div class="schoolList">
    <add-school
      v-if="isEdit"
      ref="schoolEdit"
      @addClick="isEdit = false"
      @success="success"
    ></add-school>
    <div v-else>
      <div>
        <el-form ref="myForm" :inline="true" @submit.native.prevent>
          <el-form-item label="学校名称" prop="name">
            <el-input
              v-model="params.name"
              placeholder="请输入学校名称"
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
          icon="el-icon-plus"
          type="primary"
          style="margin-bottom: 20px"
          @click="isEdit = true"
        >
          新增
        </el-button>
        <el-table ref="tableSort" v-loading="listLoading" :data="tableList">
          <el-table-column
            prop="name"
            label="学校名称"
            width="160"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            prop="contactName"
            label="联系人"
            align="center"
          ></el-table-column> -->
          <el-table-column
            prop="mobile"
            label="联系方式"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            prop="address"
            label="学段"
            align="center"
          ></el-table-column> -->
          <el-table-column label="性质" align="center">
            <template #default="{ row }">
              <div>
                <span>
                  {{ row.schoolNature === 1 ? '公办' : '私办' }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="straightPipeUnit"
            label="直管单位"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="action"
            label="操作"
            align="center"
            width="280px"
          >
            <template #default="{ row }">
              <div>
                <el-button type="text" @click="editSchool(row)">编辑</el-button>
                <el-button type="danger" @click="deleteSchool(row.id)">
                  删除
                </el-button>
                <el-button type="text" @click="copyAdd(row)">复制</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="+pageForm.pageNo"
          :layout="'total, sizes, prev, pager, next, jumper'"
          :page-size="+pageForm.pageSize"
          :total="+pageForm.total"
          background
          @current-change="pageChange"
          @size-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import AddSchool from './compoents/addSchool'
  import { getSchoolList, deleteSchool } from '../../api/school'
  // import tableMinix from '@/cms/mixins/tableMixin'
  export default {
    components: {
      AddSchool,
    },
    mixins: [],
    data() {
      return {
        isEdit: false,
        tableList: [{}],
        list: [],
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        // tableUrl: '/schools/api/Applet/unAccess/query',
        tableUrl: '/schools/api/Applet/unAccess/query',
        params: {},
        searchContent: {},
        type: 0, //确定是否修改和新增
        row: {},
        schoolData: {},
        isManage: false,
        selectType: '',
        listLoading: false,
        classList: [],
        userName: '',
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
      this.pageForm.pageNo = 1
      this.search()
    },
    methods: {
      copyAdd(row = {}) {
        this.isEdit = true
        const data = {
          enrollmentNodePos: row.enrollmentNodePos,
        }

        setTimeout(() => {
          this.$refs.schoolEdit.init({
            ...data,
          })
        })
      },
      editSchool(row = {}) {
        this.isEdit = true
        if (Object.keys(row).length) {
          this.row = row
          setTimeout(() => {
            this.$refs.schoolEdit.init({
              ...row,
            })
          })
        }
      },
      //添加成功
      success() {
        this.isEdit = false
        this.pageForm.pageNo = 1
        this.search()
      },
      //修改图文信息
      edit(row) {},
      setGarden(data) {},
      //添加成功
      // async success() {
      //   let that = this
      //   that.$forceUpdate()
      // },
      back() {
        this.isManage = false
      },
      pageChange(data) {
        console.log(data)
        this.pageForm.pageNo = data
        this.search()
      },
      sizeChange(data) {
        this.pageForm.pageSize = data
        this.search()
      },
      deleteSchool(id) {
        deleteSchool(id).then((res) => {
          if (+res.code === 0) {
            this.reset()
            this.search()
          }
        })
      },
      search() {
        this.listLoading = true
        const params = {
          pageNo: this.pageForm.pageNo,
          pageSize: this.pageForm.pageSize,
          name: this.params.name,
        }
        // this.list(params)
        getSchoolList(params)
          .then((res) => {
            console.log(res)
            this.tableList = [...res.data.list]
            this.pageForm.pageNo = res.data.page.pageNo
            this.pageForm.pageSize = res.data.page.pageSize
            this.pageForm.total = res.data.page.totalNum
          })
          .finally(() => {
            this.listLoading = false
          })
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
  .schoolList {
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
