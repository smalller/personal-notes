<template>
  <div class="article_warpper">
    <el-form ref="form" :inline="true" @submit.native.prevent>
      <el-form-item label="所在地区">
        <el-cascader
          v-model="params.areaId"
          placeholder="请选择"
          :options="addressOptions"
          @change="setArea"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="园所名称">
        <el-input v-model="params.name" placeholder="请输入园所名称"></el-input>
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
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <span>学校名称：</span>
      <div class="school-box"></div>
    </div>
    <!-- <search-filter @search="search" @reset="reset"></search-filter> -->

    <div class="table-list">
      <Table
        :colums="colums"
        :data="tableList"
        :page-config="params"
        :list-loading="listLoading"
        @sizeChange="pageSizeChange"
        @currentChange="pageChange"
      ></Table>
    </div>
  </div>
</template>

<script>
  import tableMixin from '@/cms/mixins/tableMixin'
  import Table from '@/cms/components/table'
  import { regionDataPlus } from 'element-china-area-data'
  export default {
    components: {
      Table,
    },
    mixins: [tableMixin],
    props: {
      schoolData: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        tableList: [],
        tableUrl: '/schools/api/school/query',
        addressOptions: regionDataPlus,
        params: {},
        selectData: [],
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'address',
            label: '所在区域',
            align: 'center',
          },
          {
            prop: 'id',
            label: '园所ID',
            align: 'center',
          },
          {
            prop: 'name',
            label: '园所名称',
            align: 'center',
          },
          {
            prop: 'contactName',
            label: '联系人',
            align: 'center',
          },
          {
            prop: 'contactMobile',
            label: '联系方式',
            align: 'center',
          },

          {
            prop: 'agentContactName',
            label: '所属代理商',
            align: 'center',
          },
          {
            prop: 'beginDate',
            label: '开通时间',
            align: 'center',
          },
          {
            prop: 'forbid',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <el-button
                      type="primary"
                      on-click={() => this.select(scope.row)}
                      v-show={!this.isSelect(scope.row)}
                    >
                      <span>选择</span>
                    </el-button>
                    <el-button
                      type="danger"
                      on-click={() => this.select(scope.row)}
                      v-show={this.isSelect(scope.row)}
                    >
                      <span>取消</span>
                    </el-button>
                  </div>
                )
              },
            },
          },
        ]
      },
    },
    watch: {
      selectData: {
        handler() {
          this.$emit('setSchool', this.selectData)
        },
        deep: true,
        immediate: true,
      },
      schoolData: {
        handler(newValue, old) {
          this.selectData = this.schoolData
          // console.log(this.selectData, '54156456465')
        },
        deep: true,
        immediate: true,
      },
    },
    mounted() {},
    created() {
      this.list()
    },
    methods: {
      select(data) {
        if (!this.isSelect(data)) {
          this.selectData.push(data.id)
        } else {
          for (var j = 0; j < this.selectData.length; j++) {
            if (this.selectData[j] === data.id) {
              this.selectData.splice(j, 1)
              return
            }
          }
        }
      },
      isSelect(data) {
        if (this.selectData.length) {
          for (var j = 0; j < this.selectData.length; j++) {
            if (this.selectData[j] === data.id) {
              return true
            }
          }
        }
      },
      setArea(data) {
        if (data) {
          this.params.areaId = data.join(',')
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-list {
    height: 600px;
    overflow: scroll;
  }
</style>
