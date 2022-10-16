<template>
  <div class="class common">
    <div>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="订单号">
          <el-input v-model="params.orderId"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="params.orderName"></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="params.status" placeholder="请选择">
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="params.orderWay" placeholder="请选择">
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买时间">
          <el-date-picker
            v-model="params.twoTime"
            type="datetimerange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
          <el-button>重置</el-button>
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
          label="所属幼儿园"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单号"
          prop="gradeLabel"
        ></el-table-column>
        <el-table-column
          align="center"
          label="购买时间"
          prop="teachers"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商户类型"
          prop="studentNum"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品名称"
          prop="studentNum"
        ></el-table-column>
        <el-table-column
          align="center"
          label="金额"
          prop="studentNum"
        ></el-table-column>
        <el-table-column
          align="center"
          label="状态"
          prop="studentNum"
        ></el-table-column>
        <el-table-column
          align="center"
          label="支付方式"
          prop="studentNum"
        ></el-table-column>
        <el-table-column
          align="right"
          label="订单来源"
          prop="studentNum"
        ></el-table-column>
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
      :title="+key === 0 ? '新增班级' : '修改班级'"
      :visible.sync="classDialog"
      width="25%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div>
        <el-form ref="dialogForm" :model="editForm">
          <el-form-item
            prop="grade"
            :rules="filterRules({ required: true, msg: '年级不可为空' })"
          >
            <el-select v-model="editForm.grade" placeholder="请选择年级">
              <el-option
                v-for="(item, index) in class_code"
                :key="index"
                :label="item.codeInfoName"
                :value="+item.codeInfoValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="name"
            label="班级名称"
            :rules="filterRules({ required: true, msg: '班级名称不可为空' })"
          >
            <el-input
              v-model="editForm.name"
              placeholder="请输入班级名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click=";(classDialog = false), (editForm = { name: '', grade: '' })"
        >
          取 消
        </el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import { CLASSLIST, addClass, editClass } from '@/cms/api/class'
  import { mapGetters } from 'vuex'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import { STAFFLIST } from '@/cms/api/staff'
  export default {
    name: 'Order',
    mixins: [schoolMixin, tableMixin],
    data() {
      return {
        classDialog: false, //控制编辑新增班级的弹框
        editForm: {
          name: '', //班级名称
          grade: '', //班级value
        }, //提交新增修改的数据
        yearList: [], //年级
        classList: [], //班级
        key: 0, //0 默认新增班级 1 修改班级
      }
    },
    computed: {
      ...mapGetters({
        class_code: 'code_list/class_code',
      }),
    },
    mounted() {
      const vm = this
      vm.list(CLASSLIST)
    },
    methods: {
      //编辑
      edit(val) {
        const vm = this
        vm.classDialog = true
        vm.key = 1
        Object.assign(vm.editForm, val)
      },
      //编辑或新增班级
      saveEdit() {
        const vm = this
        vm.$refs.dialogForm.validate((valid) => {
          if (valid) {
            let { codeInfoName } = vm.class_code.find(
              (item) => +item.codeInfoValue === +vm.editForm.grade
            )
            let obj = Object.assign(
              { gradeLabel: codeInfoName, schoolId: vm.school },
              vm.editForm
            )
            if (+vm.key === 0) {
              addClass(obj).then((res) => {
                if (+res.code === 0) {
                  vm.classDialog = false
                  vm.$message.success(res.msg)
                  vm.params.pageNo = 1
                  vm.params.total = 0
                  vm.list()
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            } else {
              editClass(obj, obj.id).then((res) => {
                if (+res.code === 0) {
                  vm.classDialog = false
                  vm.$message.success(res.msg)
                  vm.list()
                } else {
                  vm.$message.warning(res.msg || '接口错误')
                }
              })
            }
          }
        })
      },

      //查看幼儿
      lookChild(val) {
        let clazzId = val.id
        this.$router.push({ path: '/children', query: { clazzId } })
      },
      //查看教师
      lookTeacher(val) {
        let clazzId = val.id
        this.$router.push({ path: '/teachers', query: { clazzId } })
      },
    },
  }
</script>

<style scoped></style>
