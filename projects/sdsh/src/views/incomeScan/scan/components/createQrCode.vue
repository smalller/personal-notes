<template>
  <el-drawer
      v-model="visible"
      custom-class="createQrCodeBox"
      title="新增收款二维码"
      @close="close"
  >
    <div class="createQrCode">
      <el-form :model="formData" :rules="rules" ref="formEl">
        <el-form-item prop="projectName" label="项目名称">
          <el-input
              :readonly="formType === 'read'"
              v-model="formData.projectName"
          />
        </el-form-item>
        <el-form-item prop="itemList" label="金额选项设置"  >
          <el-table :data="itemList">
            <el-table-column label="收费项目名称">
              <template #default="{ row, $index }">
                <el-input
                    :readonly="formType === 'read'"
                    @input="projectNameChange($index, $event)"
                    v-model="row.itemName"
                />
              </template>
            </el-table-column>
            <el-table-column label="收费方式">
              <template #default="{ $index, row }">
                <el-select
                    :disabled="formType === 'read'"
                    @change="chargeTypeChange($index, $event)"
                    v-model="row.chargeType"
                >
                  <el-option label="用户自定义" value="1"></el-option>
                  <el-option label="设定收费金额" value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="收费金额">
              <template #default="{ $index, row }">
                <el-input
                    :readonly="formType === 'read'"
                    v-show="+row.chargeType === 2"
                    type="number"
                    v-model="row.chargeMoney"
                    @input="chargeMoneyChange($index, $event)"
                />
                <el-input  v-show="+row.chargeType === 1" readonly placeholder="用户输入金额" />
              </template>
            </el-table-column>
            <el-table-column label="是否必交">
              <template #default="{ $index, row }">
                <el-switch
                    :disabled="formType === 'read'||+row.chargeType === 1"
                    active-text="是"
                    v-model="row.required"
                    @change="requiredChange($index, $event)"
                    active-value="1"
                    inactive-text="否"
                    inactive-value="2"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <el-button
                    :disabled="formType === 'read'"
                    type="danger"
                    @click="deleteProjectItem($index)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-button
                :disabled="formType === 'read'"
                @click="addProjectItem"
                type="success"
                icon="plus"
            >新增收费项目
            </el-button>
          </el-row>
        </el-form-item>
        <el-form-item prop="times" label="二维码生效时间">
          <el-date-picker
              :disabled="formType === 'read'"
              type="datetimerange"
              v-model="formData.times"
              @change="timerChange"
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
        <!--            <el-col :span="6" :offset="1">-->
        <!--              <el-button icon="plus" type="success">新增分账账户</el-button>-->
        <!--            </el-col>-->
        <!--          </el-row>-->
        <!--        </el-form-item>-->
        <el-form-item label="支付前需登记信息" prop="registerList">
          <el-table :data="registerList">
            <el-table-column label="登记项名称">
              <template #default="{ row, $index }">
                <el-input
                    :readonly="formType === 'read'"
                    v-model="row.registerName"
                    @input="registerNameChange($index, $event)"
                />
              </template>
            </el-table-column>
            <el-table-column label="用户填写方式">
              <template #default="{ row, $index }">
                <el-select
                    :disabled="formType === 'read'"
                    v-model="row.userFillInType"
                    @change="userFillInTypeChange($index, row)"
                >
                  <el-option label="文字输入" value="1"/>
                  <el-option label="数字输入" value="2"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="填写说明">
              <template #default="{ $index, row }">
                <el-input
                    :readonly="formType === 'read'"
                    v-model="row.remark"
                    @input="remarkChange($index, $event)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <el-button
                    :disabled="formType === 'read'"
                    type="danger"
                    @click="deleteInfoItem($index)"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-button
                :disabled="formType === 'read'"
                @click="addInfoItem"
                type="success"
                icon="plus"
            >添加登记项
            </el-button
            >
          </el-row>
        </el-form-item>
        <el-form-item label="收费说明">
          <el-input
              :readonly="formType === 'read'"
              type="textarea"
              v-model="formData.remark"
          />
        </el-form-item>
        <el-form-item label="说明文件">
          <el-button :disabled="formType === 'read'" @click="selectFile"
          >选择文件
          </el-button
          >
          {{formData.attachmentUrl}}
        </el-form-item>
      </el-form>

      <el-row justify="center" align="center">
        <el-button type="primary" @click="saveDraft" v-if="formType !== 'read'"
        >保存草稿
        </el-button
        >
        <el-button
            type="success"
            v-if="formType !== 'read'"
            @click="mergeFormData('send')"
        >发布
        </el-button
        >
        <el-button @click="close">返回</el-button>
      </el-row>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import dayjs from "dayjs";
import {defineComponent, reactive, ref} from "vue";
import {
  CreateQRCodeParams,
  QRCodeItem,
  QRCodeProject,
} from "@/views/incomeScan/scan/data";
import {uploadFile} from "@/utils/base";
import {createQRCode, editQRCode} from "@/views/incomeScan/scan/api";
import type {FormRules} from "element-plus";
import {ElMessage} from "element-plus";
import {getQrCodeDetails} from "@/views/incomeCheck/list/api";

export default defineComponent({
  name: "createQrCode",
  setup(props, {emit}) {
    const visible = ref(false);

    const fileName = ref('');

    const formEl = ref(null);
    const formType = ref<string>("add");
    const formData = reactive<CreateQRCodeParams>({
      attachmentUrl: "",
      beginTime: "",
      endTime: "",
      projectName: "",
      remark: "",
      status: "2",
    });
    const rules = reactive<FormRules>({
      projectName: [
        {
          required: true,
          message: "请输入项目名称",
          trigger: "blur",
        },
      ],
      itemList: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value.length === 0) {
              callback(new Error("请添加金额选项"));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
      registerList: [{
        validator: (rule: any, value: any,callback: any) => {
          let ready = true;
          if(value.length === 0) {
            callback();
          } else {
            value.forEach(item => {
              if(!item.registerName.trim()) {
                ready = false
              }
            });
            if(ready) {
              callback()
            } else {
              callback(new Error('请输入登记项名称'))
            }
          }

        }
      }],
      times: [
        {
          required: true,
          message: "请选择时间",
          trigger: "blur",
        },
      ],
    });

    const saveDraft = () => {
      formData.status = '3';
      mergeFormData('send');
    }

    //登记信息列表
    const registerList = ref<QRCodeItem[]>([]);

    //添加登记信息项目
    const addInfoItem = () => {
      registerList.value.push({
        registerName: "",
        remark: "",
        userFillInType: "1",
      });
    };

    //删除登记项目
    const deleteInfoItem = (index: number) => {
      registerList.value = registerList.value.filter((item, i) => i !== index);
    };
    //修改登记项名称
    const registerNameChange = (index: number, e: string) => {
      registerList[index].registerName = e;
    };
    //修改登记项说明
    const remarkChange = (index: number, e: string) => {
      registerList[index].remark = e;
    };
    //修改登记项填写方式
    const userFillInTypeChange = (index: number, e: string) => {
      registerList[index].userFillInType = e;
    };

    //收费项目列表
    const itemList = ref<QRCodeProject[]>([]);

    //添加收费项目
    const addProjectItem = () => {
      itemList.value.push({
        chargeMoney: '0',
        chargeType: "1",
        itemName: "",
        quantityLimit: 0,
        required: "1",
      });
      (formEl.value as any).validateField("itemList", () => null);
    };
    //删除收费项目
    const deleteProjectItem = (index: number) => {
      itemList.value = itemList.value.filter((item, i) => i !== index);
    };
    //修改收费选项项目名称
    const projectNameChange = (index: number, e: string) => {
      itemList.value[index].itemName = e;
    };
    //修改收费选项收费方式
    const chargeTypeChange = (index: number, e: string) => {
      itemList.value[index].chargeType = e;
      if(+e === 1) {
        itemList.value[index].chargeMoney = 0;
        itemList.value[index].required = '1';
      }

    };
    //修改收费选项收费金额
    const chargeMoneyChange = (index: number, e: number) => {
      itemList.value[index].chargeMoney = e;
    };
    //修改收费选项必交状态
    const requiredChange = (index: number, e: string) => {
      itemList.value[index].required = e;
    };
    //修改收费选项收费数量
    const quantityLimitChange = (index: number, e: number) => {
      itemList.value[index].quantityLimit = e;
    };

    //选择二维码生效时间
    const timerChange = (e) => {
      if (e) {
        formData.beginTime = dayjs(e[0]).format("YYYY-MM-DD HH:mm:ss");
        formData.endTime = dayjs(e[1]).format("YYYY-MM-DD") + " 23:59:59";

        (formEl.value as any).validateField("times", () => null);
      } else {
        formData.beginTime = "";
        formData.endTime = "";
      }
    };

    const imgUrl = ref<string>("");

    //选择文件
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

    //组合数据
    const mergeFormData = (type: string) => {

      formData.registerList = registerList.value;
      formData.itemList = itemList.value;



      (formEl.value as any).validate((valid) => {
        console.log(valid);
        if(valid) {
          if (type === "send") {
            if (formType.value === "add") {
              sendCreateQrCode();
            } else {
              sendEditQRCode();
            }
          }
        }

      });
    };

    const sendCreateQrCode = () => {
      createQRCode(formData).then((res) => {
        if (+res.code === 1000) {
          ElMessage.success("新增成功");
          emit("success");
          close();
        } else {
          ElMessage.error(res.message);
        }
      });
    };

    const sendEditQRCode = () => {
      editQRCode(formData).then((res) => {
        if (+res.code === 1000) {
          ElMessage.success("修改成功");
          emit("success");
          close();
        } else {
          ElMessage.error(res.message);
        }
      });
    };

    const close = () => {
      visible.value = false;
      reset();
    };

    const open = (id?: number, type?: string) => {
      if (type === "edit") {
        formType.value = "edit";
        getDetails(id as number);
      } else {
        formType.value = "add";
      }

      visible.value = true;
    };

    const getDetails = (id: number) => {
      getQrCodeDetails(id).then((res) => {
        if (+res.code === 1000) {
          formData.id = id;
          formData.attachmentUrl = res.data.attachmentUrl;
          imgUrl.value = formData.attachmentUrl;
          formData.beginTime = dayjs(res.data.beginTime).format(
              "YYYY-MM-DD HH:mm:ss"
          );
          formData.endTime = dayjs(res.data.endTime).format(
              "YYYY-MM-DD HH:mm:ss"
          );
          formData.projectName = res.data.projectName;
          formData.remark = res.data.remark;
          formData.status = res.data.status;
          formData.times = [formData.beginTime, formData.endTime];
          formData.itemList = res.data.itemList;
          itemList.value = formData.itemList as QRCodeProject[];
          formData.registerList =
              res.data.registerList;
          registerList.value = formData.registerList as QRCodeItem[];
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
      rules,
      registerList,
      itemList,
      projectNameChange,
      imgUrl,
      formEl,
      selectFile,
      addInfoItem,
      addProjectItem,
      deleteInfoItem,
      deleteProjectItem,
      mergeFormData,
      chargeTypeChange,
      chargeMoneyChange,
      requiredChange,
      quantityLimitChange,
      registerNameChange,
      remarkChange,
      userFillInTypeChange,
      timerChange,
      close,
      open,
      formType,
      fileName,
      saveDraft
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
