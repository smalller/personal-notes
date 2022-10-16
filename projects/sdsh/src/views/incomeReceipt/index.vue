<template>
  <div class="indexlayout-main-conent">
    <el-card
        shadow="never"
        class="cus-card"
        style="margin-bottom: 15px;"
        :body-style="{ 'padding-bottom': '0' }"
    >
      <el-form
          model
          class="filter-box"
          label-position="right"
          label-width="150px"
      >
        <el-form-item label="收据样式预览：">
          <el-image :src="billUrl" style="width:600px;height:300px;margin-left:20%"></el-image>
        </el-form-item>

        <el-form-item label="家长手机端设置">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.mobileSideSetting">

              <el-radio label="1">启用</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </div>

        </el-form-item>
        <el-form-item label="收据名称：">
          <el-input
              style="width: 450px;"
              clearable
              v-model="billSetting.receiptName"
              placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="交易时间：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.payTime">

              <el-radio label="1">显示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </div>

        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input
              style="width: 450px;"
              clearable
              v-model="billSetting.projectName"
              placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="交费名称+金额：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.payName">

              <el-radio label="1">显示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="支付方式：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.payType">

              <el-radio label="1">显示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="扫码用户登记信息：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.registrationInformation">

              <el-radio label="1">全部显示</el-radio>
              <el-radio label="2">仅显示班级，学生姓名</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>

          </div>
        </el-form-item>
        <el-form-item label="【按名单收费】学生唯一编号：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.studentNumber">

              <el-radio label="1">显示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="备注信息：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.remark">

              <el-radio label="1">显示</el-radio>
              <el-radio label="0">隐藏</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="经办方：">
          <el-input
              style="width: 450px;"
              clearable
              v-model="billSetting.unitInformation"
              placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="统一收据说明：">
          <el-input
              style="width: 450px;"
              clearable
              type="textarea"
              v-model="billSetting.receiptDescription"
              placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="收据大小设置：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.receiptSize">

              <el-radio label="1">一页纸一张收据</el-radio>
              <el-radio label="0">一页纸两张收据</el-radio>
              <el-radio label="2">一页纸三张收据</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="收费印章设置：">
          <div class="radio-box">
            <el-radio-group v-model="billSetting.stampSetting">

              <el-radio label="1">使用系统支付凭证章</el-radio>
              <el-radio label="0">不使用印章</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <!-- <el-button @click="typeNum = 0">按名单收费</el-button>
      <el-button @click="typeNum = 1">交费明细</el-button>
      <el-button @click="typeNum = 2">收费回收站</el-button> -->
      <div>
        <el-button type="success" @click="saveSetting">保存设置</el-button>
        <el-button @click="resetSetting">重填</el-button>
      </div>
    </el-card>

  </div>
</template>
<script lang="ts" setup>
import {getBillSetting, getBillUrl, saveBillSetting} from "./service";
import {reactive, ref, watch} from "vue";
import {BillSetting} from "@/views/incomeReceipt/data";
import {ElMessage} from "element-plus";


let bf:BillSetting = {
  mobileSideSetting: '',
  payName: '',
  payTime: '',
  payType: '',
  print: '',
  projectName: '',
  receiptDescription: '',
  receiptName: '',
  receiptSize: '',
  registrationInformation: '',
  remark: '',
  stampSetting: '',
  studentNumber: '',
  unitInformation: ''
}

const billSetting = reactive<BillSetting>(bf);


const getSetting = () => {
  getBillSetting().then(res => {
    if (+res.code === 1000) {
      billSetting.mobileSideSetting = res.data.mobileSideSetting;
      billSetting.payName = res.data.payName;
      billSetting.payTime = res.data.payTime;
      billSetting.payType = res.data.payType;
      billSetting.print = res.data.print;
      billSetting.projectName = res.data.projectName;
      billSetting.receiptDescription = res.data.receiptDescription;
      billSetting.receiptName = res.data.receiptName;
      billSetting.receiptSize = res.data.receiptSize;
      billSetting.registrationInformation = res.data.registrationInformation;
      billSetting.remark = res.data.remark;
      billSetting.stampSetting = res.data.stampSetting;
      billSetting.studentNumber = res.data.studentNumber;
      billSetting.unitInformation = res.data.unitInformation;

      bf = JSON.parse(JSON.stringify(res.data));

      getBill()
    }
  })
}
getSetting()

const saveSetting = () => {
  saveBillSetting(billSetting).then(res => {
    if(+res.code === 1000) {
      ElMessage.success('修改设置成功');
      getSetting()
    }
  })
}



const billUrl = ref('')
const getBill = () => {
  getBillUrl(billSetting).then(blob => {
    console.log(blob)
    billUrl.value = URL.createObjectURL(blob)
  })
}
watch(billSetting,() => {
  getBill()
}, {
  deep: true
})
const resetSetting = () => {
  billSetting.mobileSideSetting = bf.mobileSideSetting;
  billSetting.payName = bf.payName;
  billSetting.payTime = bf.payTime;
  billSetting.payType = bf.payType;
  billSetting.print = bf.print;
  billSetting.projectName = bf.projectName;
  billSetting.receiptDescription = bf.receiptDescription;
  billSetting.receiptName = bf.receiptName;
  billSetting.receiptSize = bf.receiptSize;
  billSetting.registrationInformation = bf.registrationInformation;
  billSetting.remark = bf.remark;
  billSetting.stampSetting = bf.stampSetting;
  billSetting.studentNumber = bf.studentNumber;
  billSetting.unitInformation = bf.unitInformation;
}
</script>
