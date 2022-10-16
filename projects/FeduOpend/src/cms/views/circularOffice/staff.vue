<template>
  <div class="staff common">
    <edit v-if="isEdit" ref="editRef" @close=";(isEdit = false), list()"></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="姓名">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="params.phone"></el-input>
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
        <el-form-item>
          <el-button type="primary">批量导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="excelExport">导出</el-button>
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
        <el-table-column align="center" label="角色" prop="roleName">
          <template #default="{ row }">
            {{ row.roleNames.join(',') }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <el-tag :type="+row.jobStatus === 9 ? 'danger' : 'success'">
              {{ +row.jobStatus === 9 ? '离职' : '在职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="300px">
          <template #default="{ row }">
            <el-button type="primary" @click="edit(row)">编辑</el-button>
            <el-button type="primary" @click="password(row)">
              重置密码
            </el-button>
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
        <img :src="img" style="margin-bottom: 5px" />
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
  export default {
    name: 'Staff',
    components: {
      edit,
    },
    mixins: [tableMixin, schoolMixin],
    data() {
      return {
        classList: [], //班级列表
        passShow: false, //重置密码弹框
        img: '', //图形验证图片
        mobile: '', //储存所点击的手机号
        editForm: { captchaCode: '' },
      }
    },
    mounted() {
      const vm = this
      //获取所有班级
      getAllClass(sessionStorage.getItem('zdyjb_schoolId')).then((res) => {
        if (+res.code === 0) {
          vm.classList = res.data.list
        }
      })
      vm.list(STAFFLIST)
    },
    methods: {
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
            })
          }
        })
      },
      //获取验证码
      getYzmImg() {
        let uuid = new Date().getTime()
        this.img = `${process.env.VUE_APP_BASE_API}${YZMURL}?uuid=${uuid}`
        console.log(this.img)
      },
      //編輯員工
      edit(val) {
        let vm = this
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs.editRef.init(val)
        })
      },
      //导出
      excelExport() {},
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
