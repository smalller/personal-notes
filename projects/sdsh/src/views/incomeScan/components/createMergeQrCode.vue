<template>
  <el-drawer
    title="合并二维码"
    custom-class="createMergeQrCode"
    v-model="visible"
    @close="close"
  >
    <div class="">
      <el-form label-width="130px" :model="formData" :rules="rulesRef">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="formData.projectName" />
        </el-form-item>
        <el-form-item label="选择项目合并" prop="ids">
          <el-button type="success" @click="openQrCodeList"
            >选择收费项目</el-button
          >
          <div v-for="item in sendSelectQrCode" :key="item.id">
            {{ item.projectName }},
          </div>
        </el-form-item>
        <div v-if="sendSelectQrCode.length > 0">
          <el-form-item v-show="false" label="金额选项设置">
            <el-table :data="formData.itemList">
              <el-table-column label="收费项目名称">
                <template #default="{ row }">
                  <el-input v-model="row.itemName" />
                </template>
              </el-table-column>
              <el-table-column label="收费方式">
                <template #default="{ row }">
                  <el-select v-model="row.chargeType">
                    <el-option label="用户自定义" value="1"></el-option>
                    <el-option label="设定收费金额" value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="收费金额">
                <template #default="{ row }">
                  <el-input v-model="row.chargeMoney" />
                </template>
              </el-table-column>
              <el-table-column label="是否必交">
                <template #default="{ row }">
                  <el-radio-group v-model="row.required">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ $index }">
                  <el-button type="danger">删除{{ $index }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item  label="二维码生效时间">
            <el-date-picker
              type="daterange"
              v-model="times"
              @change="timerChange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择截止时间"
            />
          </el-form-item>
          <el-form-item v-show="false" label="支付前需登记信息">
            <el-table :data="formData.registerList">
              <el-table-column label="登记项名称">
                <template #default="{ row }">
                  <el-input v-model="row.registerName" />
                </template>
              </el-table-column>
              <el-table-column label="用户填写方式">
                <template #default="{ row }">
                  <el-select v-model="row.userFillInType">
                    <el-option label="文字输入" value="1" />
                    <el-option label="数字输入" value="2" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="填写说明">
                <template #default="{ row }">
                  <el-input v-model="row.remark" />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ $index }">
                  <el-button type="danger">删除{{ $index }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="收费说明">
            <el-input v-model="formData.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="说明文件">
            <el-button @click="selectFile"
            >选择文件
            </el-button
            >
            {{fileName}}
          </el-form-item>

        </div>
      </el-form>
      <div>
        <el-button @click="openReview" typo="success">预览</el-button>
        <el-button @click="submitMergeQrCode" type="success">发布</el-button>
        <el-button @click="close">取消</el-button>
      </div>
      <el-dialog
        :model-value="modelVisible"
        title="请选择需要合并项目"
        width="700px"
        @close="modelVisible = false"
      >
        <el-row>
          <el-col :span="6">
            <el-input v-model="projectName" />
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button @click="getQrCodeList">查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="qrCodeList" @selection-change="selectQrCodeFun">
            <el-table-column type="selection" width="55" />
            <el-table-column label="项目名称" prop="projectName" />
            <el-table-column label="开始时间">
              <template #default="{ row }">
                {{ dayjs(row.beginTime).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column label="截止时间" prop="projectName">
              <template #default="{ row }">
                {{ dayjs(row.endTime).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="isExpire" width="100px" />
          </el-table>
        </el-row>
        <el-row>
          <el-button type="success" @click="sendSelect">确定</el-button>
          <el-button
            @click="
              modelVisible = false;
              selectQrCode = [];
            "
            >取消</el-button
          >
        </el-row>
      </el-dialog>
    </div>
  </el-drawer>

  <el-drawer v-model="viewVisible" @close="closeReview">
    <el-descriptions title="" border :column="1" direction="horizontal">
      <el-descriptions-item label="项目名称">{{ formData.projectName }}</el-descriptions-item>
      <el-descriptions-item label="金额选项">
        <el-table :data="formData.itemList">
          <el-table-column label="收费项目名称" prop="itemName"/>
          <el-table-column label="收费方式" prop="chargeType"/>
          <el-table-column label="收费金额" prop="chargeMoney"/>
          <el-table-column label="是否必交" prop="required">
            <template #default="{row}">{{+row.required === 1?'必交':'非必交'}}</template>
          </el-table-column>
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item label="支付前需登记信息">
        <el-table :data="formData.registerList">
          <el-table-column label="登记项名称" prop="registerName"/>
          <el-table-column label="填写说明" prop="remark"/>
          <el-table-column label="用户填写方式" prop="required">
            <template #default="{row}">{{+row.required === 1?'文字输入':'数字输入'}}</template>
          </el-table-column>
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item label="收费时间">{{ dayjs(formData.beginTime).format('YYYY-MM-DD HH:mm:ss') }} -
        {{ dayjs(formData.endTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="收费说明">{{formData.remark}}</el-descriptions-item>

    </el-descriptions>
  </el-drawer>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";

import {defineEmits, defineExpose, reactive, ref} from "vue";
import {
  MergeQrCodeParams,
  QrCodeListItem,
} from "@/views/incomeScan/scan/data";
import { ElMessage } from "element-plus";
import { CreateMergeQrCode } from "@/views/incomeScan/data";
import {queryMergeQRCodeList} from "@/views/incomeScan/service";
import {mergeQRCode} from "@/views/incomeScan/scan/api";
import {uploadFile} from "@/utils/base";

const visible = ref(false);
const viewVisible = ref(false);
const modelVisible = ref(false);

const selectQrCode = ref<CreateMergeQrCode[]>([]);
const sendSelectQrCode = ref<CreateMergeQrCode[]>([]);
const formData = reactive<CreateMergeQrCode>({
  ids: [],
  attachmentUrl: "",
  beginTime: "",
  endTime: "",
  registerList: [],
  itemList: [],
  projectName: "",
  remark: "",
  status: "",
  regis: [],
  items: []
});

const fileName = ref('')

const emit = defineEmits(['success'])

// 表单验证
const rulesRef = reactive({
  ids: [
    {
      required: true,
      validator: async (rule: any, value: string[]) => {
        if (value.length === 0) {
          throw new Error("请输入选择合并项目");
        } else if (value.length < 2) {
          throw new Error("最少选择两个项目");
        }
      },
    },
  ],
  projectName: [
    {
      required: true,
      message: "请输入项目名称",
    },
  ],
});

const submitMergeQrCode = () => {

  mergeQRCode(formData).then(res => {
    if(+res.code === 1000) {
      ElMessage.success('合并成功');
      emit('success')
      close();
    } else {
      ElMessage.warning(res.msg)
    }
  })
}

const openReview = () => {
  viewVisible.value = true
}
const closeReview = () => {
  viewVisible.value = false
}

const openQrCodeList = () => {
  modelVisible.value = true;
  getQrCodeList();
};

const selectFile = () => {
  uploadFile({
    accept: '.png,.jpg,.pdf'
  }).then((res: any) => {
    console.log(res)
    // imgUrl.value = res.imageUrl;
    if(res?.length>0) {

      formData.attachmentUrl = res[0].imageUrl;
      fileName.value = res[0].path;
    }
  });
};

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

const projectName = ref("");
const qrCodeList = ref<QrCodeListItem[]>([]);

const getQrCodeList = () => {
  queryMergeQRCodeList(1, 999, {
    projectName: projectName.value,
  }).then((res) => {
    if (+res.code === 1000) {
      qrCodeList.value = res.data.list;
    }
  });
};

const selectQrCodeFun = (e) => {
  selectQrCode.value = e;
};

//确定选择的项目
const sendSelect = () => {
  if (selectQrCode.value.length < 2) {
    ElMessage.warning("最少选择两个");
  } else {
    modelVisible.value = false;
    sendSelectQrCode.value = selectQrCode.value;
    formData.ids = sendSelectQrCode.value.map((item) => item.id as number);
    const startTimes: number[] = [];
    const endTimes: number[] = [];
    selectQrCode.value.forEach((item) => {
      startTimes.push(dayjs(item.beginTime).valueOf());
      endTimes.push(dayjs(item.endTime).valueOf());
      console.log(item);
      if (Array.isArray(item.itemList)) {
        formData.items = formData.itemList.map(item => item.mpId as number);
        // formData.itemList = formData.itemList.concat(item.itemList);
      }
      if (Array.isArray(item.registerList)) {
        // formData.registerList = formData.registerList.concat(item.registerList);
        formData.regis = formData.registerList.map(item => item.mccrId as number);
      }
    });
    formData.beginTime = dayjs(Math.min(...startTimes)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    formData.endTime = dayjs(Math.max(...endTimes)).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    times.value = [formData.beginTime, formData.endTime];
  }
};

const times = ref<string[]>([]);

const timerChange = (e) => {
  // console.log(e)
  if (e) {
    formData.beginTime = dayjs(e[0]).format("YYYY-MM-DD HH:mm:ss");
    formData.endTime = dayjs(e[1]).format("YYYY-MM-DD") + " 23:59:59";
  } else {
    formData.beginTime = "";
    formData.endTime = "";
  }
};

defineExpose({
  open,
});
</script>

<style lang="scss">
.createMergeQrCode {
  width: 82vw !important;
}
</style>
