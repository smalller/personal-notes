<template>
  <div class="article_warpper">
    <div>
      <el-form ref="myForm" :inline="true" @submit.native.prevent>
        <el-form-item label="称谓" prop="status">
          <el-select v-model="params.title" clearable placeholder="请选择">
            <el-option
              v-for="item in titleList"
              :key="item.codeInfoName"
              :label="item.codeInfoName"
              :value="item.codeInfoName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="搜索" prop="name">
          <el-input v-model="params.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="payTime" width="200">
          <el-date-picker
            v-model="params.startTime"
            type="date"
            placeholder="开始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="params.endTime"
            type="date"
            placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
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
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="tableSort" v-loading="listLoading" :data="tableList">
        <el-table-column
          prop="name"
          label="教职工姓名"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="称谓"
          align="center"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色" align="center">
          <template #default="{ row }">
            {{ row.roleNames.join(',') }}
          </template>
        </el-table-column>
        <el-table-column label="所在班级" align="center">
          <template #default="{ row }">
            <div>
              <span v-for="(item, index) in row.clazzes" :key="index">
                {{ item.clazzName }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="电脑端登录">
          <template #default="{ row }">
            <div>
              <el-button :type="row.allowLoginPC === 1 ? 'success' : 'danger'">
                {{ row.allowLoginPC === 1 ? '允许' : '不允许' }}
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="入驻App">
          <template #default="{ row }">
            <div>
              <el-button :type="+row.settleApp === 1 ? 'success' : 'danger'">
                {{ +row.settleApp === 1 ? '已入驻' : '未入驻' }}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="onboard"
          label="入职时间"
          align="center"
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
  </div>
</template>

<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import { regionDataPlus } from 'element-china-area-data'
  export default {
    components: {},
    mixins: [tableMixin],
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
        tableList: [],
        tableUrl: `schools/api/employee/querySchoolEmp?schoolId=${this.school.id}`,
        searchContent: {},
        dialogTableVisible: false,
        params: {},
        addressOptions: regionDataPlus,
        previewUrl: '',
        titleList: this.$store.state.code_list.title_code,
        selectInfo: [],
      }
    },
    computed: {},
    created() {
      this.list()
    },
    methods: {
      reset() {
        this.params = {
          pageSize: 20,
        }
        this.list()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .phone-show {
    .el-dialog {
      border-radius: 20px !important;
    }
  }
</style>
