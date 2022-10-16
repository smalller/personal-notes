<template>
  <div>
    <!-- <add-user
      v-if="isEdit"
      ref="userEdit"
      @cancel="isEdit = false"
      @success="success"
    ></add-user> -->
    <Layout>
      <template #search>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="内卡卡号">
            <el-input
              v-model="params.innerNumber"
              placeholder="请输入内卡卡号"
            ></el-input>
          </el-form-item>
          <el-form-item label="外卡卡号">
            <el-input
              v-model="params.outNumber"
              placeholder="请输入外卡卡号"
            ></el-input>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input
              v-model="params.studentName"
              placeholder="请输入学生姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="columnId">
            <el-select v-model="params.cardStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in classList"
                :key="index"
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
      </template>
      <template #btn>
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          :headers="headers"
          name="cardFile"
        >
          <el-button size="small" type="primary">
            <i class="ri-upload-2-fill"></i>
            点击上传
          </el-button>
        </el-upload>
      </template>
      <template #table>
        <Table
          :colums="colums"
          :data="tableList"
          :page-config="params"
          :list-loading="listLoading"
          @sizeChange="pageSizeChange"
          @currentChange="pageChange"
        ></Table>
      </template>
    </Layout>
  </div>
</template>

<script>
  import Layout from '@/cms/components/Layout'
  // import SearchFilter from './components/SearchFilter'
  import Table from '@/cms/components/table'
  import tableMinix from '@/cms/mixins/tableMixin'
  import { changeUser } from '@/api/user'
  import VueCookie from 'vue-cookie'
  import { ResetAttCard } from '@/cms/api/att'
  import { RefreshAlbum } from '@/cms/api/mediaSetting'

  export default {
    components: {
      Layout,
      // SearchFilter
      Table,
      // AddUser,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableUrl: '/facility/attendanceInfo/getCardList', //列表地址
        searchContent: {},
        uploadUrl: '',
        fileList: [],
        classList: [
          {
            label: '已绑定',
            value: 1,
          },
          {
            label: '未绑定',
            value: 0,
          },
        ],
        headers: {},
        userId: VueCookie.get(`${firmId}_user_id`),
        token: VueCookie.get(`token_${firmId}`),
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'innerNumber',
            label: '内卡卡号',
            align: 'center',
          },
          {
            prop: 'outNumber',
            label: '外卡卡号',
            align: 'center',
          },
          {
            prop: 'mobile',
            label: '联系电话',
            align: 'center',
          },
          {
            prop: 'userName',
            label: '用户姓名',
            align: 'center',
          },
          {
            prop: 'clazzName',
            label: '班级名称',
            align: 'center',
          },
          {
            prop: 'studentName',
            label: '学生姓名',
            align: 'center',
          },
          {
            prop: 'cardStatus',
            label: '状态',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                return <span>{+row.cardStatus == 1 ? '已绑定' : '未绑定'}</span>
              },
            },
          },
          {
            prop: 'action',
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                if (+row.cardStatus === 1) {
                  return (
                    <el-button
                      type="primary"
                      on-click={() => {
                        this.resetAttCard(row)
                      }}
                    >
                      解绑
                    </el-button>
                  )
                }
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
      /**
       * 解绑考勤卡
       * @param item
       */
      resetAttCard(item) {
        // console.log(item.innerNumber)
        this.$baseConfirm(
          '当前正在进行考勤卡解绑操作,确认继续吗?',
          null,
          async () => {
            const { msg } = await ResetAttCard({
              id: item.outNumber,
            })
            this.$baseMessage(msg, 'success')
            this.list()
          }
        )
      },
      changeStatus(params, index) {
        if (params.status == 1) {
          //开启-》禁用需要提示
          this.$confirm('是否需要禁用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              changeUser({ status: '0' }).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '禁用成功!',
                  })
                  this.tableList[index].status = '0'
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消禁用',
              })
            })
        } else {
          changeUser({ status: '1' }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '开启成功!',
              })
              this.tableList[index].status = '1'
            }
          })
        }
      },
      async beforeAvatarUpload(file) {
        this.uploadUrl = ''
        let data = `${process.env.VUE_APP_BASE_API}`
        this.uploadUrl = `${process.env.VUE_APP_BASE_API}/facility/attendanceInfo/importCard`
        this.headers = {
          token: this.token,
          userId: this.userId,
        }
        let isFile = file.type === 'application/vnd.ms-excel'
        if (!isFile) {
          this.$message.error('上传文件格式错误!')
          this.fileList = []
          return
        }
        return isFile
      },
      async uploadSuccess(res) {
        if (+res.code === 0) {
          this.$message.success('考勤数据上传成功！')
          this.fileList = []
          this.list()
          return
        } else {
          this.$message.warning('考勤数据上传失败！')
        }
      },
      uploadError() {
        this.$message.error('上传失败')
      },
      addUser() {
        this.isEdit = true
      },
      edit(row) {
        this.isEdit = true
        setTimeout(() => {
          this.$refs.userEdit.init({
            ...row,
            password: '000000',
            password2: '000000',
          })
        })
      },
      success() {
        this.isEdit = false
        this.list()
      },
    },
  }
</script>

<style lang="scss" scoped></style>
