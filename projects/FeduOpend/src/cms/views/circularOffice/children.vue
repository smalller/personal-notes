<template>
  <!-- 幼儿管理 -->
  <div class="children common">
    <edit v-if="isEdit" ref="dialog" @close=";(isEdit = false), list()"></edit>
    <div v-else>
      <el-form ref="form" :inline="true" @submit.native.prevent>
        <el-form-item label="姓名">
          <el-input v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="params.mobile"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="columnId">
          <el-select v-model="params.clazz" placeholder="请选择">
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
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            :action="fileAction"
            :headers="header"
            :on-success="success"
            :show-file-list="false"
          >
            <el-button type="primary">批量导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="excelExport">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="isEdit = true">新增幼儿</el-button>
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
          label="幼儿姓名"
          prop="name"
        ></el-table-column>
        <el-table-column
          align="center"
          label="家长电话"
          prop="contacts"
        ></el-table-column>
        <el-table-column align="center" label="性别">
          <template #default="{ row }">
            {{ +row.sex === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="所在班级"
          prop="clazzName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="出生年月"
          prop="birthTime"
        ></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            <el-tag :type="+row.stuStatus === 0 ? 'danger' : 'success'">
              {{ +row.stuStatus === 0 ? '未入园' : '已入圆' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="edit(row)">编辑</el-button>
            <!--            <el-button type="text" @click="lookInfo(row)">查看家长</el-button>-->
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
    <el-dialog title="家长信息" :visible.sync="parentDialog">
      <div class="content">
        <div v-for="(item, index) in family" :key="index" class="content-item">
          <span class="header-name"></span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let vm
  import { getAllClass } from '@/cms/api/class'
  import { outExcel } from '@/cms/utils/excel'
  import tableMixin from '@/cms/mixins/tableMixin'
  import uploadMixin from '@/cms/mixins/uploadMixin'
  import schoolMixin from '@/cms/mixins/schoolIdMixin'
  import edit from '@/cms/views/circularOffice/components/childrenEdit'
  import { CHILDLIST, BATCHCHILDREN, searchFamily } from '@/cms/api/children'
  export default {
    name: 'Children',
    components: {
      edit,
    },
    mixins: [tableMixin, uploadMixin, schoolMixin],
    data() {
      return {
        classList: [], //班级列表数据
        parentDialog: false, //查看家长的弹框
        family: [], //储存所查看家长信息
      }
    },
    mounted() {
      vm = this
      vm.fileAction = `${process.env.VUE_APP_BASE_API}${BATCHCHILDREN}`
      getAllClass(sessionStorage.getItem('zdyjb_schoolId')).then((res) => {
        if (+res.code === 0) {
          vm.classList = res.data.list
          let { clazzId } = vm.$route.query
          if (clazzId) {
            vm.$set(vm.params, 'clazz', clazzId)
          }
        }
        vm.list(CHILDLIST)
      })
    },
    methods: {
      //编辑
      edit(val) {
        vm.isEdit = true
        vm.$nextTick(() => {
          vm.$refs.dialog.init(val)
        })
      },
      // 选中上传文件的回调
      success(data) {
        console.log('文件上传信息', data)
        if (+data.code === 0) {
          vm.$message.success(data.msg)
          vm.list()
        } else {
          vm.$message.error(data.msg)
        }
      },
      //查询学生家长
      lookInfo(row) {
        searchFamily(row.id).then((res) => {
          console.log('查询的家长', res)
          if (+res.code === 0) {
            this.family = res.data
            if (this.family.length) {
              this.parentDialog = true
            } else {
              this.$message.warning('该幼儿')
            }
          }
        })
      },
      //导出
      excelExport() {},
    },
  }
</script>

<style scoped lang="scss">
  .content {
    min-height: 200px;
  }
</style>
