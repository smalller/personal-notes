<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="'批量导入' + title"
    width="497"
    okText="导入"
    :tips="false"
  >
    <div class="body-text-box">
      <ui-time-line index="1" top="30" length="1">
        <ui-button @click="downloadExcel">下载{{ title }}导入表格</ui-button>
      </ui-time-line>
      <ui-time-line index="2" top="30" length="1">
        <div style="margin-top: 5px">
          <span>填写下载的表格</span>
          <span class="tips">提示：{{ tips }}</span>
        </div>
      </ui-time-line>
      <ui-time-line
        v-if="index == 2"
        index="3"
        top="30"
        :length="index == 2 ? '1' : '0'"
      >
        <ui-form
          :model="ruleForm"
          :rules="rules"
          ref="formCheck"
          label-width="110"
        >
          <ui-form-item prop="selectedClass">
            <ui-select
              filterable
              style="width: 274px"
              v-model="ruleForm.selectedClass"
              placeholder="请选择幼儿所在班级"
              class="select-box"
            >
              <ui-select-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </ui-select-option>
            </ui-select>
          </ui-form-item>
        </ui-form>
      </ui-time-line>
      <ui-time-line :index="index == 2 ? '4' : '3'" top="30" length="0">
        <ui-button
          @click="selectFile"
          :class="['upload-btn', { 'upload-error': uploadError }]"
          >{{ btnTitle }}</ui-button
        >
      </ui-time-line>
      <p v-if="excelName" class="upload-info excel-name">
        已上传表格：{{ excelName }}
      </p>
      <p v-if="uploadError" class="upload-info err-data">{{ errData }}</p>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import micell from "micell";
import { defineComponent, reactive, toRefs, ref } from "vue";
import { useStore } from "vuex";
import Message from "@/themes/message";
import { uploadTeachers } from "@/api/teachingManage";
import { uploadStudents } from "@/api/infantManage";
import { AxiosResponse } from "axios";
import bus from "@/Layout/bus";

export default defineComponent({
  props: {
    index: [Number, String], //1-导入教职工，2-导入幼儿
    title: String,
    tips: String,
  },
  setup(props) {
    const $store = useStore();
    const classList = $store.state.commonData.classList; // 班级列表
    const formCheck = ref(null);
    const btnTitle = ref("选择上传表格");
    const excelName = ref(""); //文件名称
    let from = new FormData(); // 要上传的excel
    const uploadError = ref(false); // 导入是否出错
    const errData = ref("" as string | undefined); // 错误信息

    const baseData = reactive({
      modalStatus: false,
      ruleForm: {
        selectedClass: "",
      },
    });

    const rules = ref({
      selectedClass: [
        { required: true, message: "请选择班级", trigger: "blur" },
      ],
    });

    // 下载表格
    const downloadExcel = (): void => {
      if (props.index == 1) {
        micell.download("./static/excel/teachersInfo.xlsx", "教职工信息模板");
      } else {
        micell.download("./static/excel/studentsInfo.xlsx", "幼儿信息模板");
      }
    };

    // 打开模态框
    const handleOpen = () => {
      initData();
      baseData.modalStatus = true;
    };

    // 取消按钮
    const handleClose = () => {
      initData();
      baseData.ruleForm.selectedClass = "";
      baseData.modalStatus = false;
    };

    // 初始化
    const initData = () => {
      from = new FormData();
      excelName.value = "";
      errData.value = "";
      uploadError.value = false;
      btnTitle.value = "选择上传表格";
    };

    // 选择文件
    const selectFile = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".xlsx";
      input.onchange = () => {
        if (input.files) {
          initData();
          const file = input.files[0];
          if (props.index == 1) {
            // 教职工表格
            from.append("empFile", file);
          } else {
            // 幼儿表格
            from.append("studentFile", file);
          }
          btnTitle.value = "重新上传表格";
          excelName.value = file.name;
        }
      };
      input.click();
    };

    // 导入教职工
    const handleUploadTeachers = async (): Promise<void> => {
      const res: AxiosResponse = await uploadTeachers(from);
      if (+res.code === 0) {
        Message.success("导入成功");
        baseData.modalStatus = false;
        bus.$emit("editStaffComplete", true); // 通知更新表格
      } else {
        errData.value = res.msg;
        uploadError.value = true;
      }
      excelName.value = "";
    };

    // 导入幼儿
    const handleUploadStudents = async (): Promise<void> => {
      const res: AxiosResponse = await uploadStudents(
        baseData.ruleForm.selectedClass,
        from
      );
      if (+res.code === 0) {
        Message.success("导入成功");
        baseData.modalStatus = false;
        baseData.ruleForm.selectedClass = "";
        bus.$emit("editInfantComplete", true); // 通知更新表格
      } else {
        errData.value = res.msg;
        uploadError.value = true;
      }
      excelName.value = "";
    };

    // 确认按钮
    const handleSure = () => {
      if (props.index == 2) {
        (formCheck.value as any)?.validate((valid: boolean) => {
          if (valid) {
            if (from.get("studentFile")) {
              handleUploadStudents();
            } else {
              Message.error("请选择文件上传");
            }
            console.log("验证通过");
          } else {
            console.log("验证失败");
          }
        });
      } else {
        if (from.get("empFile")) {
          handleUploadTeachers();
        } else {
          Message.error("请选择文件上传");
        }
      }
    };

    return {
      ...toRefs(baseData),
      handleClose,
      handleSure,
      handleOpen,
      downloadExcel,
      rules,
      classList,
      formCheck,
      btnTitle,
      excelName,
      selectFile,
      uploadError,
      errData,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  font-size: 14px;
  color: #222;
  margin: 20px 0 40px 0;

  .tips {
    font-size: 12px;
    color: #f56060;
    margin-left: 20px;
  }

  .upload-btn {
    margin-bottom: 10px;
  }

  .upload-error {
    border-color: #f56060;
  }

  .upload-info {
    font-size: 12px;
    margin-top: 10px;
    padding-left: 48px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .excel-name {
    color: #222222;
  }

  .err-data {
    color: #f56060;
  }
}
</style>
