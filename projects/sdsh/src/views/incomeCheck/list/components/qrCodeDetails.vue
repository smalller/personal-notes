<template>
  <el-drawer
    v-model="visible"
    custom-class="createQrCodeBox"
    title="详情"
    @close="close"
  >
    <div class="createQrCode">
      <el-form :model="formData" ref="formEl">
        <el-form-item prop="projectName" label="项目名称">
          <el-input
              readonly
            v-model="formData.projectName"
          />
        </el-form-item>
        <el-form-item prop="itemList" label="金额选项设置">
          <el-table :data="formData.itemList">
            <el-table-column label="收费项目名称">
              <template #default="{ row }">
                <el-input readonly v-model="row.itemName" />
              </template>
            </el-table-column>
            <el-table-column label="收费方式">
              <template #default="{ row }">
                <el-select disabled v-model="row.chargeType">
                  <el-option label="用户自定义" value="1"></el-option>
                  <el-option label="设定收费金额" value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="收费金额">
              <template #default="{ row }">
                <el-input readonly v-model="row.chargeMoney" />
              </template>
            </el-table-column>
            <el-table-column label="是否必交">
              <template #default="{ row }">
                <el-switch
                  disabled
                  active-text="是"
                  v-model="row.required"
                  active-value="1"
                  inactive-text="否"
                  inactive-value="2"
                ></el-switch>
              </template>
            </el-table-column>
<!--            <el-table-column label="数量限制">-->
<!--              <template #default="{ row }">-->
<!--                <el-input readonly v-model="row.quantityLimit" />-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
        </el-form-item>
        <el-form-item prop="times" label="二维码生效时间">
          <el-date-picker
            disabled
            type="datetimerange"
            v-model="formData.times"
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <!--        <el-form-item label="分账账户">-->
        <!--          <el-row align="bottom">-->
        <!--            <el-col :span="8">-->
        <!--              <h4>分账账户</h4>-->
        <!--              <el-input/>-->
        <!--            </el-col>-->
        <!--            <el-col :span="8" :offset="1">-->
        <!--              <h4>分账金额</h4>-->
        <!--              <el-input type="number"/>-->
        <!--            </el-col>-->
        <!--          </el-row>-->
        <!--        </el-form-item>-->
        <el-form-item label="支付前需登记信息">
          <el-table :data="formData.registerList">
            <el-table-column label="登记项名称">
              <template #default="{ row }">
                <el-input
                    readonly
                  v-model="row.registerName"
                />
              </template>
            </el-table-column>
            <el-table-column label="用户填写方式">
              <template #default="{ row }">
                <el-select
                    disabled
                  v-model="row.userFillInType"
                >
                  <el-option label="文字输入" value="1" />
                  <el-option label="数字输入" value="2" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="填写说明">
              <template #default="{ row }">
                <el-input
                    readonly
                  v-model="row.remark"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="收费说明">
          <el-input readonly type="textarea" v-model="formData.remark" />
        </el-form-item>
        <el-form-item label="说明文件">
          <img :src="imgUrl" style="max-height: 100px" alt="" />
        </el-form-item>
      </el-form>

      <el-row justify="center" align="center">
        <el-button @click="close">返回</el-button>
      </el-row>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, reactive, ref } from "vue";
import {
  CreateQRCodeParams,
  QRCodeItem,
  QRCodeProject,
} from "@/views/incomeScan/scan/data";
import { uploadFile } from "@/utils/base";
import { createQRCode, editQRCode } from "@/views/incomeScan/scan/api";
import type { FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { getQrCodeDetails } from "@/views/incomeCheck/list/api";

export default defineComponent({
  name: "qrCodeDetails",
  setup(props, { emit }) {
    const visible = ref(false);

    const formEl = ref(null);
    const formType = ref<string>("add");
    const formData = reactive<CreateQRCodeParams>({
      attachmentUrl: "",
      beginTime: "",
      endTime: "",
      projectName: "",
      remark: "",
      status: "",
    });

    const imgUrl = ref<string>("");

    const close = () => {
      visible.value = false;
      reset();
    };

    const open = (id: number) => {
      getDetails(id);
      visible.value = true;
    };

    const getDetails = (id: number) => {
      getQrCodeDetails(id).then((res) => {
        if (+res.code === 1000) {
          formData.attachmentUrl = res.data.attachmentUrl;
          formData.beginTime = res.data.beginTime;
          formData.projectName = res.data.projectName;
          formData.remark = res.data.remark;
          formData.status = res.data.status;
          formData.times = [res.data.beginTime, res.data.endTime];
          formData.itemList = res.data.itemList;
          formData.registerList =
            res.data.registerList;
        }
      });
    };

    //重置表单
    const reset = () => {
      formData.attachmentUrl = "";
      formData.beginTime = "";
      formData.projectName = "";
      formData.remark = "";
      formData.status = "";
      formData.itemList = [];
      formData.registerList = [];
    };

    return {
      visible,
      formData,
      imgUrl,
      formEl,
      close,
      open,
      formType,
    };
  },
});
</script>

<style lang="scss">
.createQrCodeBox {
  width: 70vw !important;
}

.createQrCode {
}
</style>
