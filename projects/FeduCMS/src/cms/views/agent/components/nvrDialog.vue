<template>
  <el-dialog title="提示" class="ddd" :visible.sync="dialogVisible" width="40%">
    <el-row>
      <el-col :span="11">
        <el-checkbox v-model="checked" disabled>启用</el-checkbox>
      </el-col>
    </el-row>
    <el-row v-for="(item, index) of msgData" :key="index">
      <el-col :span="11">{{ item.key }}</el-col>
      <el-col :span="11">{{ item.value }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <el-checkbox v-model="checked" disabled>码流私有信息</el-checkbox>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">视频通道编码</el-col>
    </el-row>
    <el-table height="250" :data="tableData" style="width: 100%">
      <el-table-column prop="num" label="通道号"></el-table-column>
      <el-table-column prop="value" label="视频通道编码ID"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
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
          { key: 'nvr密码', value: '' },
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
      init(val) {
        this.msgData[2].value = val.serverId
        this.msgData[3].value = val.serverPw
        this.msgData[4].value = val.serverIp
        this.msgData[5].value = val.serverPort
        this.msgData[6].value = val.gbId
        this.msgData[7].value = val.password
        this.dialogVisible = true
        if (val.channelIds?.length > 0) {
          // let arr = val.channels.split(',')
          let arr = val.channelIds
          let newArr = []
          for (let i = 0; i < arr.length; i++) {
            newArr.push({ num: 'D' + i, value: arr[i] })
          }
          this.tableData = newArr
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
