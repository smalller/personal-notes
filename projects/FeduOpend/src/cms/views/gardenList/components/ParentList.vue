<template>
  <div class="childrenList">
    <!-- <search-filter @search="search" @reset="reset"></search-filter> -->
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="班级" prop="status">
        <el-select v-model="params.clazzId" clearable placeholder="请选择">
          <el-option
            v-for="item in stuClass"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="VIP" prop="status">
        <el-select v-model="params.isVip" clearable placeholder="请选择">
          <el-option
            v-for="item in vipList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监控" prop="status">
        <el-select v-model="params.cameraStatus" clearable placeholder="请选择">
          <el-option
            v-for="item in cameraList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="幼儿姓名" prop="name">
        <el-input
          v-model="params.stuName"
          placeholder="请输入幼儿姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="name">
        <el-input
          v-model="params.mobile"
          placeholder="请输入联系电话"
        ></el-input>
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
      <br />
      <el-form-item>
        <el-button @click="openAllCamera">监控批量开通</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeAllCamera">监控批量关闭</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="openAllVip">批量开通VIP</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeAllVip">批量关闭VIP</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="getParent">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- <Table
      :colums="colums"
      :data="tableList"
      :list-loading="listLoading"
      :page-config="params"
      @sizeChange="pageSizeChange"
      @currentChange="pageChange"
    ></Table> -->
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      style="margin-top: 20px"
      :data="tableList"
      @selection-change="setSelectRows"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column
        label="姓名"
        width="200px"
        align="center"
        prop="userName"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        align="center"
      ></el-table-column>
      <el-table-column label="幼儿及班级" align="center">
        <template #default="{ row }">
          <div>
            <span>
              {{
                row.stuClazz ? row.stuClazz.replace(/,/g, '   ') : row.stuClazz
              }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="vip到期时间" width="160" align="center">
        <template #default="{ row }">
          <div>
            <span>
              {{ row.expireTime ? row.expireTime : '未开通' }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="监控到期时间" width="160" align="center">
        <template #default="{ row }">
          <div>
            <span>
              {{ row.cameraExpireTime ? row.cameraExpireTime : '未开通' }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="250px">
        <template #default="{ row }">
          <div>
            <el-button
              type="text"
              :class="row.isVip ? 'warning' : 'success'"
              @click="setVipInfo(row)"
            >
              {{ row.isVip ? '结束VIP' : '开启VIP' }}
            </el-button>
            <el-button
              type="text"
              :class="row.cameraStatus ? 'warning' : 'success'"
              @click="setCameraInfo(row)"
            >
              {{ row.cameraStatus ? '关闭监控' : '开启监控' }}
            </el-button>
            <el-button type="text" @click="show(row)">详情</el-button>
          </div>
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

    <el-dialog title="监控设置" :visible.sync="showCamera" width="20%" center>
      <el-form>
        <el-form-item label="结束日期" prop="cameraTime">
          <el-date-picker
            v-model="cameraTime"
            type="datetime"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="openCamera">确定</el-button>
        <el-button type="primary" @click="showCamera = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="家长详情" :visible.sync="showInfo" width="20%" center>
      <el-form label-width="100px">
        <el-form-item label="昵称:">
          <span>{{ userInfo.nickName }}</span>
        </el-form-item>
        <el-form-item label="常住地:">
          <span>{{ userInfo.liveAdress }}</span>
        </el-form-item>
        <el-form-item label="生日:">
          <span>{{ userInfo.userBirthday }}</span>
        </el-form-item>
        <el-form-item label="性别:">
          <span>{{ userInfo.userSex == 1 ? '男' : '女' }}</span>
        </el-form-item>
        <el-form-item label="真实姓名:">
          <span>{{ userInfo.username }}</span>
        </el-form-item>
        <el-form-item label="个性签名:">
          <span>{{ userInfo.personSign }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="showInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import Table from '@/cms/components/table'
  import moment from 'moment'
  import tableMinix from '@/cms/mixins/tableMixin'
  import {
    SetVipInfo,
    GetUserInfo,
    SetCameraInfo,
    SetAllVip,
  } from '@/api/customer'
  import { VIP_LIST, CAMERA_LIST } from '../../../constants'
  import { download } from '@/cms/common/base'
  export default {
    components: {
      // Table,
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
        tableUrl: '/schools/api/stuFamily/queryFamilies',
        params: {
          schoolId: this.school.id,
        },
        type: 0, //确定是否修改和新增
        row: {},
        vipList: VIP_LIST,
        cameraList: CAMERA_LIST,
        schoolData: {},
        showVip: false,
        showCamera: false,
        showInfo: false,
        allVip: false,
        allCamera: false,
        endTime: '',
        cameraTime: '',
        vipInfo: {},
        cameraInfo: {},
        userInfo: {},
        selectData: [],
      }
    },
    computed: {},
    mounted() {
      this.list()
    },
    methods: {
      reset() {
        this.params = {
          schoolId: this.school.id,
          pageNo: 1,
          pageSize: 20,
        }
        this.list()
      },
      setSelectRows(data) {
        this.selectData.length = 0
        if (data) {
          this.selectData = [...data]
        }
        console.log(data, '88888888888888')
      },
      //关闭VIP
      setVipInfo(data) {
        console.log(data, '000000000')
        let item = {}
        this.vipInfo = {}
        this.showVip = false
        let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        if (!data.isVip) {
          this.showVip = true
          this.vipInfo = { ...data }
        } else {
          this.$confirm('是否需要关闭VIP？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              item = { ...data }
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
      //开启VIP信息
      openVip() {
        if (this.allVip) {
          this.openAllVips()
        } else {
          if (this.vipInfo.userId && this.endTime) {
            let item = {}
            item = {
              effectTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              expireTime: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
              isOpening: true,
              userId: this.vipInfo.userId,
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
          } else {
            this.$message({
              type: 'info',
              message: '请先选择时间或开通用户',
            })
          }
        }
      },
      show(data) {
        this.userInfo = {}
        if (data.userId) {
          GetUserInfo(data.userId).then((res) => {
            if (res.code == 0) {
              this.showInfo = true
              this.userInfo = { ...res.data }
            }
          })
        }
      },
      //打开监控
      setCameraInfo(data) {
        console.log(data, '监控数据')
        let item = {}
        this.cameraInfo = {}
        this.showCamera = false
        let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        if (!data.cameraStatus) {
          this.showCamera = true
          this.cameraInfo = { ...data }
          console.log(this.cameraInfo, '监控数据')
        } else {
          this.$confirm('是否需要关闭监控？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              item = {}
              item.expireTime = time
              item.schoolId = this.school.id
              item.cameraStatus = false
              item.userId = data.userId
              SetCameraInfo([item], this.school.id).then((res) => {
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
      //开启监控
      openCamera() {
        if (this.allCamera) {
          this.openAllCameras()
        } else {
          if (this.cameraInfo.userId && this.cameraTime) {
            let item = {}
            item = {
              expireTime: moment(this.cameraTime).format('YYYY-MM-DD HH:mm:ss'),
              cameraStatus: true,
              schoolId: this.school.id,
              userId: this.cameraInfo.userId,
            }
            SetCameraInfo([item], this.school.id).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '开启成功!',
                })
                this.showCamera = false
                this.list()
              }
            })
          } else {
            this.$message({
              type: 'info',
              message: '请先选择时间或开通用户',
            })
          }
        }
      },
      //批量开启Vip
      openAllVip() {
        this.showVip = false
        this.allVip = false
        if (this.selectData.length) {
          this.showVip = true
          this.allVip = true
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择家长信息!',
          })
        }
      },
      //批量开启监控
      openAllCamera() {
        this.showCamera = false
        this.allCamera = false
        if (this.selectData.length) {
          this.showCamera = true
          this.allCamera = true
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择家长信息!',
          })
        }
      },
      openAllVips() {
        if (this.selectData.length && this.endTime) {
          let item = {
            effectTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            expireTime: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
            isOpening: true,
            userIds: [],
          }
          for (let data of this.selectData) {
            console.log(data)
            item.userIds.push(data.userId)
          }
          SetAllVip(item).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '批量开启成功!',
              })
              this.showVip = false
              this.endTime = ''
              this.list()
            }
          })
        } else {
          this.$message({
            type: 'info',
            message: '请先选择时间或开通用户',
          })
        }
      },
      //批量关闭Vip
      closeAllVip() {
        if (this.selectData.length) {
          this.$confirm('是否需要批量关闭VIP？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let item = {
                expireTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                isOpening: false,
                userIds: [],
              }
              for (let data of this.selectData) {
                console.log(data)
                item.userIds.push(data.userId)
              }
              SetAllVip(item).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '批量关闭成功!',
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
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择家长信息!',
          })
        }
      },
      openAllCameras() {
        if (this.selectData.length && this.cameraTime) {
          let item = []
          for (let data of this.selectData) {
            let camera = {
              cameraStatus: true,
              expireTime: moment(this.cameraTime).format('YYYY-MM-DD HH:mm:ss'),
              schoolId: this.school.id,
              userId: data.userId,
            }
            console.log(data)
            item.push(camera)
          }
          SetCameraInfo(item, this.school.id).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '批量开启成功!',
              })
              this.showCamera = false
              this.cameraTime = ''
              this.list()
            }
          })
        } else {
          this.$message({
            type: 'info',
            message: '请先选择时间或开通用户',
          })
        }
      },
      //批量关闭监控
      closeAllCamera() {
        if (this.selectData.length) {
          this.$confirm('是否需要批量关闭监控？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              let item = []
              for (let data of this.selectData) {
                let camera = {
                  cameraStatus: false,
                  expireTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                  schoolId: this.school.id,
                  userId: data.userId,
                }
                console.log(data)
                item.push(camera)
              }
              SetCameraInfo(item, this.school.id).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '批量关闭成功!',
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
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择家长信息!',
          })
        }
      },
      //导出家长信息
      getParent() {
        let url = `${process.env.VUE_APP_BASE_API}/schools/api/stuFamily/exportFamily`
        if (this.school.id) {
          download(url, '家长列表.xls', this.school.id)
        }
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
