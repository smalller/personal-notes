<template>
  <div class="staff common">
    <edit v-if="isEdit" ref="editRef" @close=";(isEdit = false), list()"></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="姓名">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="params.mobile"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="columnId">
          <el-select v-model="params.clazzId" placeholder="请选择">
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
            icon="el-icon-search"
            native-type="submit"
            type="primary"
            @click="search()"
          >
            查询
          </el-button>
          <el-button type="primary" @click="isEdit = true">新增员工</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-upload
            class="avatar-uploader"
            :action="fileAction"
            :headers="header"
            :on-success="success"
            :show-file-list="false"
          >
            <el-button type="primary">批量导入</el-button>
          </el-upload>
        </el-form-item> -->
        <el-form-item>
          <download-excel
            style="float: right"
            class="export-excel-wrapper"
            :data="tableList"
            :fields="json_fields"
            name="worker.xls"
          >
            <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
            <el-button type="primary" size="small">导出</el-button>
          </download-excel>
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
          label="姓名"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          align="center"
          label="称谓"
          prop="title"
        ></el-table-column>
        <el-table-column align="center" label="电脑端登录" prop="usageAmount">
          <template #default="{ row }">
            <el-tag :type="+row.allowLoginPC === 0 ? 'danger' : 'success'">
              {{ +row.allowLoginPC === 0 ? '禁止' : '允许' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发送全员通知" prop="usageAmount">
          <template #default="{ row }">
            <el-tag :type="+row.noticeScope === 1 ? 'danger' : 'success'">
              {{ +row.noticeScope === 1 ? '禁止' : '允许' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="角色"
          prop="roleName"
        ></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <el-tag :type="+row.jobStatus === 9 ? 'danger' : 'success'">
              {{ +row.jobStatus === 9 ? '离职' : '在职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="400px">
          <template #default="{ row }">
            <el-button type="primary" @click="edit(row)">编辑</el-button>
            <!-- <el-button type="primary" @click="password(row)">
              重置密码
            </el-button> -->
            <el-button
              type="primary"
              :style="{
                'background-color': +row.jobStatus === 1 ? '#f56c6c' : '',
                border: +row.jobStatus === 1 ? 'none' : '',
              }"
              @click="offLine(row)"
            >
              {{ +row.jobStatus === 1 ? '离职' : '上岗' }}
            </el-button>
            <!-- <el-button type="primary" @click="open(row)">绑定考勤卡</el-button> -->
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
    <el-dialog
      ref="editRef"
      title="重置密码"
      :visible.sync="passShow"
      width="25%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div>
        <img :src="img" style="margin-bottom: 5px" @click="getYzmImg" />
        <el-form ref="dialogForm" :model="editForm">
          <el-form-item
            prop="captchaCode"
            :rules="filterRules({ required: true, msg: '验证码不可为空' })"
          >
            <el-input
              v-model="editForm.captchaCode"
              placeholder="请输入图形验证码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click=";(passShow = false), (editForm = { captchaCode: '' })"
        >
          取 消
        </el-button>
        <el-button type="primary" @click="send">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import edit from '@/cms/views/circularOffice/components/staffEdit'
  import tableMixin from '@/cms/mixins/tableMixin'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import { STAFFLIST, staffOff } from '@/cms/api/staff'
  import { YZMURL, resetPass } from '@/cms/api/login/login'
  import { getAllClass } from '@/cms/api/class'
  import { BATCHCHILDREN } from '@/cms/api/children'
  import uploadMixin from '@/cms/mixins/uploadMixin'
  import micell from 'micell'
  import axios from 'axios'
  import cookie from 'vue-cookie'
  export default {
    name: 'Staff',
    components: {
      edit,
    },
    mixins: [tableMixin, uploadMixin, schoolMixin],
    data() {
      return {
        fileAction: '',
        json_fields: {
          姓名: 'name',
          手机号: 'mobile',
          称谓: 'title',
          角色: 'roleName',
        },
        classList: [], //班级列表
        passShow: false, //重置密码弹框
        img: '', //图形验证图片
        mobile: '', //储存所点击的手机号
        editForm: { captchaCode: '' },
      }
    },
    mounted() {
      this.queryForm()
    },
    methods: {
      queryForm() {
        const vm = this
        vm.fileAction = `${process.env.VUE_APP_BASE_API}${BATCHCHILDREN}`
        //获取所有班级
        getAllClass(sessionStorage.getItem('zdyjb_schoolId')).then((res) => {
          if (+res.code === 0) {
            vm.classList = res.data.list
          }
        })
        vm.list(STAFFLIST)
      },
      open(row) {
        this.$prompt('请输入邮箱', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          // request({})
        })
      },
      success(data) {
        console.log('文件上传信息', data)
        if (+data.code === 0) {
          vm.$message.success(data.msg)
          vm.list()
        } else {
          vm.$message.error(data.msg)
        }
      },
      //弹框重置密码
      password(val) {
        let vm = this
        vm.passShow = true
        vm.mobile = val.mobile
        vm.getYzmImg()
      },
      //确认重置密码
      send() {
        let vm = this
        vm.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let obj = Object.assign({ uuid: new Date().getTime() }, vm.editForm)
            console.log(obj)
            resetPass(obj, vm.mobile).then((res) => {
              console.log(res)
              if (+res.code === 0) {
                vm.passShow = false
                vm.$message.success('操作成功')
              } else {
                vm.$message.success(res.msg)
              }
            })
          }
        })
      },
      //获取验证码
      getYzmImg() {
        let uuid = new Date().getTime()
        this.img = `${process.env.VUE_APP_BASE_API}${YZMURL}?uuid=${uuid}`
      },
      //編輯員工
      edit(val) {
        let vm = this
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs.editRef.init(val)
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
              },
            })
            .then((res) => {
              console.log(res)
              if (res.data.code === 0) {
                this.$message.success('导入成功')
                this.queryForm()
              } else {
                this.$message.warning(res.data.data || '接口错误')
              }
            })
        }
        input.click()
      },
      //员工离职
      offLine(val) {
        let vm = this
        let id = val.id
        let status = +val.jobStatus === 1 ? 9 : 1
        let msg = +val.jobStatus === 1 ? '是否确认离职' : '是否确认上岗'
        vm.$baseConfirm(msg, null, () => {
          staffOff(id, vm.school, status).then((res) => {
            console.log(res)
            if (+res.code === 0) {
              vm.$message.success(res.msg || '操作成功')
              val.jobStatus = status
            } else {
              vm.$message.warning(res.msg || '接口错误')
            }
          })
        })
      },
    },
  }
</script>

<style scoped></style>
