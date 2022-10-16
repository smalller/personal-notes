<template>
  <div>
    <el-dialog title="用户详情" :visible.sync="showInfo" width="20%" center>
      <el-form label-width="100px">
        <el-form-item label="头像">
          <img :src="selectData.liveAdress" alt="" />
        </el-form-item>
        <el-form-item label="常住地">
          <span>{{ selectData.liveAdress }}</span>
        </el-form-item>
        <el-form-item label="生日">
          <span>{{ selectData.agent_rate }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{ selectData.agent_amt }}</span>
        </el-form-item>
        <el-form-item label="真实姓名">
          <span>{{ selectData.username }}</span>
        </el-form-item>
        <el-form-item label="个性签名">
          <span>{{ selectData.personSign }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="showInfo = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="VIP设置" :visible.sync="showVip" width="20%" center>
      <el-form>
        <el-form-item label="结束日期" prop="endTime">
          <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="openVip">确定</el-button>
        <el-button type="primary" @click="showVip = false">关闭</el-button>
      </div>
    </el-dialog>
    <Layout>
      <template #search>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item label="用户">
            <el-input
              v-model="params.keyword"
              placeholder="请输入姓名或手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="编号">
            <el-input v-model="params.id" placeholder="请输入编号"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="startTime">
            <el-date-picker
              v-model="params.startTime"
              type="date"
              placeholder="开始日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-date-picker
              v-model="params.endTime"
              type="date"
              placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="是否会员">
            <el-select v-model="params.isVip">
              <el-option value="" label="全部"></el-option>
              <el-option :value="true" label="会员"></el-option>
              <el-option :value="false" label="非会员"></el-option>
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="是否绑定幼儿">-->
          <!--            <el-select v-model="params.bindStudent">-->
          <!--              <el-option value="" label="全部"></el-option>-->
          <!--              <el-option :value="true" label="已绑定"></el-option>-->
          <!--              <el-option :value="false" label="未绑定"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
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
        <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
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
  import Table from '@/cms/components/table'
  import moment from 'moment'
  import tableMinix from '@/cms/mixins/tableMixin'
  import { SetVipInfo } from '@/api/customer'
  export default {
    components: {
      Layout,
      Table,
    },
    mixins: [tableMinix],
    data() {
      return {
        tableList: [],
        tableUrl: '/userserver/api/user/getSysUserList', //列表地址
        searchContent: {},
        selectData: {},
        showInfo: false,
        showVip: false,
        params: {
          isVip: false,
        },
        endTime: '',
        vipInfo: {},
      }
    },
    computed: {
      colums() {
        return [
          {
            prop: 'id',
            label: '编号',
            align: 'center',
          },
          {
            prop: 'mobile',
            label: '手机号',
            align: 'center',
          },
          {
            prop: 'username',
            label: '姓名',
            align: 'center',
          },
          {
            prop: 'bindStuList',
            label: '是否绑定幼儿',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                return (
                  <span>
                    {row.bindStuList.length > 0 ? '已绑定' : '未绑定'}
                  </span>
                )
              },
            },
          },
          {
            prop: 'userVip',
            label: '是否VIP',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                return <span>{row.userVip == undefined ? '否' : '是'}</span>
              },
            },
          },
          {
            prop: 'createTime',
            label: '注册日期',
            align: 'center',
          },
          {
            prop: 'time',
            label: 'VIP到期时间',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                return (
                  <span>
                    {row.userVip == undefined
                      ? '未开通'
                      : row.userVip.expireTime}
                  </span>
                )
              },
            },
          },
          {
            label: '操作',
            align: 'center',
            scopedSlots: {
              default: ({ row }) => {
                return (
                  <div>
                    <el-button
                      type="text"
                      on-click={() => this.setVipInfo(row)}
                      class={row.userVip !== null ? 'warning' : 'success'}
                    >
                      {row.userVip !== null ? '结束VIP' : '开启VIP'}
                    </el-button>
                    <el-button
                      disabled={row.bindStuList.length === 0}
                      on-click={() => {
                        this.manageChildren(row)
                      }}
                      type="text"
                    >
                      查看幼儿
                    </el-button>
                    <el-button on-click={() => this.show(row)} type="text">
                      详情
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
      if (this.$route.query.phone) {
        this.searchContent.keyword = this.$route.query.phone
        this.list()
      } else {
        this.list()
      }
    },
    methods: {
      //关闭VIP
      setVipInfo(data) {
        let item = {}
        this.vipInfo = {}
        this.showVip = false
        let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        if (data.userVip == undefined) {
          this.showVip = true
          this.vipInfo = { ...data }
        } else {
          this.$confirm('是否需要关闭VIP？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              item = { ...data.userVip }
              item.expireTime = time
              item.isOpening = false
              SetVipInfo(item).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '关闭成功!',
                  })
                  this.list()
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消关闭',
              })
            })
        }
      },
      //查看详情
      show(data) {
        this.selectData = {}
        if (data) {
          this.selectData = { ...data }
          this.showInfo = true
        }
      },
      //开启VIP信息
      openVip() {
        if (this.vipInfo) {
          let item = {}
          item = {
            effectTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            expireTime: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
            isOpening: true,
            userId: this.vipInfo.id,
          }
          SetVipInfo(item).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '开启成功!',
              })
              this.showVip = false
              this.list()
            }
          })
        }
      },
      // changeStatus(params, index) {
      //   console.log(params)
      //   if (params.status == 1) {
      //     //开启-》禁用需要提示
      //     this.$confirm('是否需要拉黑？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //     })
      //       .then(() => {
      //         params.status = '0'
      //         changeUser(params).then((res) => {
      //           if (res.code == 0) {
      //             this.$message({
      //               type: 'success',
      //               message: '禁用成功!',
      //             })
      //             this.tableList[index].status = '0'
      //           }
      //         })
      //       })
      //       .catch(() => {
      //         this.$message({
      //           type: 'info',
      //           message: '已取消禁用',
      //         })
      //       })
      //   } else {
      //     params.status = '1'
      //     changeUser(params).then((res) => {
      //       if (res.code == 0) {
      //         this.$message({
      //           type: 'success',
      //           message: '开启成功!',
      //         })
      //         this.tableList[index].status = '1'
      //       }
      //     })
      //   }
      // },
      // addUser() {
      //   this.isEdit = true
      // },
      // edit(row) {
      //   this.isEdit = true
      //   setTimeout(() => {
      //     this.$refs.userEdit.init({
      //       ...row,
      //       password: '000000',
      //       password2: '000000',
      //     })
      //   })
      // },
      // success() {
      //   this.isEdit = false
      //   this.list()
      // },
      manageChildren(row) {
        this.$router.push({
          path: '/userManage/childrenList',
          query: { phone: row.mobile },
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .success {
    color: #67c23a;
  }
  .warning {
    color: #f56c6c;
  }
</style>
