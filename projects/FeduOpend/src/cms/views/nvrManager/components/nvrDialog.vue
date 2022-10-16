<template>
  <el-dialog title="提示" class="ddd" :visible.sync="dialogVisible" width="40%">
    <el-row>
      <el-col :span="11">
        <el-checkbox v-model="checked" disabled>启用</el-checkbox>
      </el-col>
    </el-row>
    <div v-if="+formData.status === 3">
      <el-row v-for="(item, index) of msgData" :key="index">
        <el-col :span="11">{{ item.key }}</el-col>
        <el-col
          v-if="
            index === 0 ||
            index === 1 ||
            index === 7 ||
            index === 8 ||
            index === 9 ||
            index === 10 ||
            index === 11
          "
          :span="11"
        >
          {{ item.value }}
        </el-col>
        <el-col v-else :span="11">
          <el-input v-model="item.value"></el-input>
        </el-col>
      </el-row>
    </div>
    <div v-if="+formData.status !== 3">
      <el-row v-for="(item, index) of msgData" :key="index">
        <el-col :span="11">{{ item.key }}</el-col>
        <el-col :span="11">{{ item.value }}</el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="11">
        <el-checkbox v-model="checked" disabled>码流私有信息</el-checkbox>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">视频通道编码</el-col>
      <el-col :span="11">
        <el-button
          v-show="+formData.status === 3"
          type="primary"
          @click="genCode"
        >
          生成编码
        </el-button>
      </el-col>
    </el-row>
    <el-table height="250" :data="tableData" style="width: 100%">
      <el-table-column prop="num" label="通道号"></el-table-column>
      <el-table-column prop="value" label="视频通道编码ID"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="+formData.status === 3" @click="save">保 存</el-button>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from '@/utils/request'
  export default {
    data() {
      return {
        channels: '',
        formData: {},
        uuid: '',
        open_channels: 0,
        checked: true,
        dialogVisible: false,
        msgData: [
          { key: '平台接入方式', value: '28181' },
          { key: '本地SIP端口', value: '5060' },
          { key: 'SIP服务器ID', value: '' },
          { key: 'SIP服务器域', value: '' },
          { key: 'SIP服务器地址', value: '' },
          { key: 'SIP服务器端口', value: '' },
          { key: 'SIP用户认证ID', value: '' },
          { key: '注册有效期', value: '86400' },
          { key: '心跳周期', value: '60秒' },
          { key: '最大心跳超时次数', value: '3' },
          { key: '速度类型', value: '倍率' },
          { key: '倍率', value: '2' },
        ],
        tableData: [],
      }
    },
    methods: {
      save() {
        let obj = {}
        obj.serverId = this.msgData[2].value
        obj.serverPw = this.msgData[3].value
        obj.serverIp = this.msgData[4].value
        obj.serverPort = this.msgData[5].value
        obj.qbId = this.msgData[6].value
        obj.channelIds = this.channels
        obj.id = this.formData.id
        request({
          url: '/facility/api/device/configDeviceParam',
          method: 'post',
          data: obj,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            this.dialogVisible = false
            this.$parent.list()
          }
        })
      },
      genCode() {
        request({
          url: '/facility/api/device/createChannelGbId',
          method: 'post',
          params: {
            channels: this.openChannels,
            deviceId: this.uuid,
          },
        }).then((res) => {
          if (+res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            let arr = res.data
            this.channels = res.data
            let newArr = []
            for (let i = 0; i < arr.length; i++) {
              newArr.push({ num: 'D' + i, value: arr[i] })
            }
            this.tableData = newArr
            // this.list()
          }
        })
      },
      init(val) {
        this.tableData.length = 0
        this.msgData[2].value = val.serverId
        this.msgData[3].value = val.serverPw
        this.msgData[4].value = val.serverIp
        this.msgData[5].value = val.serverPort
        this.msgData[6].value = val.gbId
        this.open_channels = val.selfOpenChannels
        this.uuid = val.id
        this.dialogVisible = true
        this.formData = val

        if (val.channelIds.length > 0) {
          let arr = val.channelIds
          let newArr = []
          for (let i = 0; i < arr.length; i++) {
            newArr.push({ num: 'D' + i, value: arr[i] })
          }
          this.tableData = newArr
          console.log(newArr)
        }
      },
    },
  }
</script>
<style lang="scss">
  .ddd {
    .el-row {
      padding-bottom: 10px;
    }
  }
</style>
