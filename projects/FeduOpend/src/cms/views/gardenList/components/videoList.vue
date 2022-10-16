<template>
  <div class="childrenList">
    <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <!-- <el-form-item label="班级" prop="status">
        <el-select v-model="params.status" clearable placeholder="请选择">
          <el-option
            v-for="item in stuClass"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="幼儿姓名" prop="name">
        <el-input v-model="params.name" placeholder="请输入幼儿姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="name">
        <el-input
          v-model="params.mobile"
          placeholder="请输入联系电话"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item>
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
      </el-form-item> -->
      <!-- <br /> -->
      <el-form-item>
        <el-button @click="getVideoList">导出Excel</el-button>
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
  </div>
</template>

<script>
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  import { download } from '@/cms/common/base'
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
        tableUrl: '/schools/api/school/getCameraRecord',
        params: {
          schoolId: this.school.id,
        },
        type: 0, //确定是否修改和新增
        row: {},
        schoolData: {},
        // showVip: false,
        endTime: '',
        vipInfo: {},
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'userName',
            label: '姓名',
            align: 'center',
          },
          {
            prop: 'mobile',
            label: '电话',
            align: 'center',
          },
          {
            // prop: 'stuClazz',
            label: '幼儿及班级',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{scope.row.child}</span>
                  </div>
                )
              },
            },
          },

          {
            label: '起止时间',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>
                      {scope.row.endTime
                        ? scope.row.startTime + '-' + scope.row.endTime
                        : scope.row.startTime + '-' + '未开通'}
                    </span>
                  </div>
                )
              },
            },
          },
          {
            // prop: 'stuClazz',
            label: '开启天数',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{scope.row.totalDay}</span>
                  </div>
                )
              },
            },
          },
          {
            // prop: 'stuClazz',
            label: '开通人',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{scope.row.operator}</span>
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
      //导出监控信息
      getVideoList() {
        let url = `${process.env.VUE_APP_BASE_API}/schools/api/school/exportRecord`
        if (this.school.id) {
          download(url, '监控列表.xls', this.school.id)
        }
      },
      reset() {
        this.params = {
          schoolId: this.school.id,
          pageNo: 1,
          pageSize: 20,
          total: 0,
        }
        this.list()
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
  .success {
    color: #67c23a;
  }
  .warning {
    color: #f56c6c;
  }
</style>
