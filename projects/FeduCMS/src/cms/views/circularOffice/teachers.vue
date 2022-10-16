<template>
  <div class="class common">
    <teacher v-if="isEdit" ref="teacher" @list-refresh="list()"></teacher>
    <div>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="班级">
          <el-select
            v-model="params.clazzId"
            placeholder="请选择"
            @change="clazzChange"
          >
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="classList.length === 0"
            type="primary"
            @click="showTeacher"
          >
            管理老师
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="downloadExcel">下载模板</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectFile">导入教师</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        style="margin-top: 20px"
        :data="tableList"
      >
        <el-table-column
          align="left"
          label="班级名称"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="姓名"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="称谓"
          prop="title"
        ></el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="chooseAder(row)">移除</el-button>
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
</template>

<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import teacher from '@/cms/views/circularOffice/components/teachersEdit'
  import { getAllClass } from '@/cms/api/class'
  import { moveTeacher, STAFFLIST } from '@/cms/api/staff'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import micell from 'micell'
  import axios from 'axios'
  import cookie from 'vue-cookie'

  export default {
    name: 'Teachers',
    components: {
      teacher,
    },
    mixins: [tableMixin, schoolMixin],
    data() {
      return {
        classDialog: false, //控制编辑新增老师的弹框
        classList: [], //年级
        name: '', //储存当前所查询的班级名称
      }
    },
    created() {
      // console.log('teacher 创建')
    },
    mounted() {
      this.queryForm()
    },
    methods: {
      queryForm() {
        const vm = this
        getAllClass(sessionStorage.getItem('zdyjb_schoolId')).then((res) => {
          // console.log(res)
          if (+res.code === 0) {
            vm.classList = res.data.list
            let { clazzId } = vm.$route.query
            if (clazzId) {
              vm.$set(vm.params, 'clazzId', clazzId)
              vm.name = vm.classList.find((item) => item.id === clazzId).name
            } else {
              vm.$set(vm.params, 'clazzId', res.data.list[0].id)
              vm.name = res.data.list[0].name
            }
            vm.list(STAFFLIST) //查询员工
          }
        })
      },
      //选择班级时条件查询table
      clazzChange(e) {
        let vm = this
        console.log(vm.params)
        console.log('~~~~~~~~~~~')
        vm.params.jobStatus = 1
        vm.name = vm.classList.find((item) => item.id === e).name
        vm.params.pageNo = 1
        vm.params.total = 0
        vm.list(STAFFLIST)
      },
      //显示管理老师弹框
      showTeacher(val) {
        const vm = this
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs.teacher.teacherDiag = true
        })
      },
      //处理选择移除
      chooseAder(val) {
        let vm = this
        let p = {
          title: val.title,
          clazzId: vm.params.clazzId,
          employeeId: val.id,
          enableStatus: 9,
          schoolId: sessionStorage.getItem('zdyjb_schoolId'),
        }
        console.log(p)
        moveTeacher(p).then((res) => {
          if (+res.code === 0) {
            vm.$message.success('移除成功')
            val.isChoosed = !val.isChoosed
            vm.list()
          } else {
            vm.$message.warning(res.msg || '接口错误')
          }
        })
      },
      downloadExcel() {
        micell.download('./static/office/教师信息.xlsx', '教师信息.xlsx')
      },
      selectFile() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.xlsx'
        input.onchange = () => {
          console.log(input.files)
          const url = `${
            process.env.VUE_APP_BASE_API
          }/schools/api/schoolEmpRel/importEmps?schoolId=${sessionStorage.getItem(
            'zdyjb_schoolId'
          )}`
          const from = new FormData()
          from.append('empFile', input.files[0])
          axios
            .post(url, from, {
              headers: {
                userId: cookie.get(`${firmId}_user_id`),
                token: cookie.get(`token_${firmId}`),
                schoolId: sessionStorage.getItem('zdyjb_schoolId'),
              },
            })
            .then((res) => {
              console.log(res)
              if (res.data.code === 0) {
                this.queryForm()
              } else {
                this.$message.warning(res.data.data || '接口错误')
              }
            })
        }
        input.click()
      },
    },
  }
</script>

<style scoped></style>
