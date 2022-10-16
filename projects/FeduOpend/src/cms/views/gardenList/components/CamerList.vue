<template>
  <div>
    <camera-edit
      v-if="isEdit"
      ref="cameraEdit"
      :school-data="school"
      @close="close"
    ></camera-edit>
    <div v-else>
      <el-button type="primary" class="add_btn" @click="addCamera(0)">
        新增摄像头
      </el-button>
      <span class="header_title">{{ school.name }}</span>
      <Table
        :colums="colums"
        :data="tableList"
        class="table"
        :page-config="params"
        :list-loading="listLoading"
        @sizeChange="pageSizeChange"
        @currentChange="pageChange"
      ></Table>
    </div>
  </div>
</template>

<script>
  import { DelCamer } from '@/api/garden'
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  import CameraEdit from './CameraEdit'
  export default {
    components: {
      Table,
      CameraEdit,
    },
    mixins: [tableMinix],
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
        tableUrl: '/facility/device/query',
        searchContent: {
          schoolId: this.school.id,
        },
        deviceType: [
          { name: '摄像头', id: 'ipc' },
          { name: '平台', id: 'platform' },
          { name: '智能设备', id: 'ied' },
        ],
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'areaPath',
            label: '所在位置',
            align: 'center',
          },
          {
            prop: 'vendor',
            label: '厂商',
            align: 'center',
          },
          {
            prop: 'type',
            label: '类型',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <span>{this.getCamerType(scope.row.type)}</span>
                  </div>
                )
              },
            },
          },

          {
            prop: 'channels',
            label: '通道数',
            align: 'center',
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
          },
          {
            prop: 'camerType',
            label: '是否为明厨亮灶',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                let { row } = scope
                return (
                  <div>
                    <span>{row.index == 1 ? '是' : '否'}</span>
                  </div>
                )
              },
            },
          },
          {
            prop: 'deviceId',
            label: '设备ID',
            align: 'center',
          },
          {
            prop: 'ip',
            label: '设备IP',
            align: 'center',
          },
          {
            prop: 'gbId',
            label: '国际ID',
            align: 'center',
          },
          {
            prop: 'directoryId',
            label: '所属目录',
            align: 'center',
          },
          {
            prop: 'acton',
            label: '操作',
            align: 'center',
            align: 'center',
            scopedSlots: {
              default: (scope) => {
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.addCamera(1, scope.row)
                      }}
                    >
                      修改
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.delCamera(scope.row)
                      }}
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      on-click={() => {
                        this.banCamera(scope.row)
                      }}
                    >
                      禁用
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
      school: {
        handler(newValue, oldValue) {},
        immediate: true,
        deep: true,
      },
    },
    mounted() {
      if (this.school) {
        // let url = `${FINDCAMER}&schoolId=${this.school.id}`
        this.list()
      }
    },
    methods: {
      close() {
        this.isEdit = false
      },
      addCamera(type = 0, row = {}) {
        this.isEdit = true
        if (type === 1) {
          setTimeout(() => {
            this.$refs.cameraEdit.init(row)
          })
        }
      },
      //获取摄像头类型
      getCamerType(data) {
        let id = ''
        for (let item of this.deviceType) {
          if (data === item.id) {
            id = item.name
            return id
          }
        }
      },
      banCamera(params) {
        // if (+params.forbid == 0) {
        //   //开启-》禁用需要提示
        //   this.$confirm('是否需要禁用？', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning',
        //   })
        //     .then(() => {
        //       ForbidGarden(params.id).then((res) => {
        //         if (+res.code == 0) {
        //           this.$message({
        //             type: 'success',
        //             message: '禁用成功!',
        //           })
        //           this.tableList[index].forbid = 1
        //         }
        //       })
        //     })
        //     .catch(() => {
        //       this.$message({
        //         type: 'info',
        //         message: '已取消禁用',
        //       })
        //     })
        // } else {
        //   OpenGarden(params.id).then((res) => {
        //     if (+res.code == 0) {
        //       this.$message({
        //         type: 'success',
        //         message: '开启成功!',
        //       })
        //       this.tableList[index].forbid = 0
        //     }
        //   })
        // }
      },
      delCamera(params) {
        this.$confirm('是否需要删除该摄像头？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            DelCamer(params.id).then((res) => {
              if (+res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },
    },
  }
</script>

<style lang="scss" scoped>
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
</style>
