<template>
  <div>
    <add-vision
      v-if="isEdit"
      ref="addVision"
      @cancel="isEdit = false"
      @success="success"
    ></add-vision>
    <layout v-else>
      <template #btn>
        <div>
          <el-form ref="myForm" :inline="true" @submit.native.prevent>
            <el-form-item label="APP类型" prop="appSide">
              <el-select
                v-model="params.appSide"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in APP_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="APP版本" prop="appType">
              <el-select
                v-model="params.appType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in SYSTEM_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
          </el-form>
        </div>
        <el-button type="primary" @click="addVision">新增</el-button>
      </template>
      <template #table>
        <Table
          :colums="colums"
          :data="tableList"
          :list-loading="listLoading"
          :page-config="params"
          @sizeChange="pageSizeChange"
          @currentChange="pageChange"
        ></Table>
      </template>
    </layout>
  </div>
</template>

<script>
  import { DeleteVersion } from '@/api/version'
  import Layout from '@/cms/components/Layout'
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  import AddVision from './components/AddVision'
  import {
    SYSTEM_TYPE,
    VISION_STATUS,
    UPDATA_STATUS,
    APP_TYPE,
  } from '@/cms/constants'
  export default {
    components: {
      Layout,
      Table,
      AddVision,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableList: [{ a: 10 }],
        tableUrl: '/mamserver/api/version/query',
        searchContent: {},
        SYSTEM_TYPE: SYSTEM_TYPE,
        VISION_STATUS: VISION_STATUS,
        UPDATA_STATUS: UPDATA_STATUS,
        APP_TYPE: APP_TYPE,
        params: {
          appSide: '',
          appType: '',
        },
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'versionNumber',
            label: '版本号',
            align: 'center',
          },
          {
            prop: 'createTime',
            label: '更新日期',
            align: 'center',
          },
          {
            prop: 'appType',
            label: '系统',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>
                      {row.appSide ? row.appSide.describe : row.appType}
                    </span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'isUpdate',
            label: '强制更新',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>{row.isUpdate == 1 ? '是' : '否'}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>{row.status == 1 ? '正常' : '删除'}</span>
                  </div>
                )
              },
            },
          },
          // {
          //   prop: 'versionSize',
          //   label: '包大小',
          //   align: 'center',
          // },
          {
            prop: 'g',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { editVision } = this
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => editVision(scope.row)}
                    >
                      修改
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.deleteVersion(scope.row)
                      }}
                    >
                      删除
                    </el-button>
                  </div>
                )
              },
            },
          },
        ]
      },
    },
    created() {
      this.list()
    },
    methods: {
      success() {
        this.isEdit = false
        this.list()
      },
      async deleteVersion(data) {
        if (data) {
          this.$confirm('是否需要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              DeleteVersion(data.id).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，删除成功',
                    type: 'success',
                  })
                  this.list()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              })
            })
        }
      },
      addVision() {
        this.isEdit = true
      },
      editVision(row) {
        this.isEdit = true
        setTimeout(() => {
          this.$refs.addVision.init(row)
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
