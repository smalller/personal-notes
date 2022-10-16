<template>
  <ui-modal
    v-model:visible="addClass.open"
    @close="handleClose"
    @ok="handleAdd"
    :title="addClass.title"
    :width="addClass.width"
    :tips="true"
  >
    <div class="body-text-box">
      <div class="form-box" v-if="editStatus !== 3">
        <ui-form
          :model="ruleForm"
          :rules="validate.rule"
          ref="formCheck"
          label-width="110"
        >
          <ui-form-item label="班徽">
            <div class="class-img">
              <div>
                <div
                  @click="showCropper = true"
                  class="form-img"
                  v-if="!ruleForm.classImgUrl"
                >
                  <ui-icon icon="icon-a-1" class="form-icon"></ui-icon>
                </div>
                <img
                  @click="showCropper = true"
                  class="form-img"
                  v-if="ruleForm.classImgUrl"
                  :src="ruleForm.classImgUrl"
                />
              </div>
              <ui-avatar-cropper
                style="float: left"
                v-if="showCropper"
                @cancelImg="showCropper = false"
                @sendImgInfo="getImgInfo"
              ></ui-avatar-cropper>
            </div>
          </ui-form-item>

          <ui-form-item label="班级名称" prop="name">
            <ui-input
              v-model="ruleForm.name"
              style="width: 80%"
              placeholder="输入班级名称"
            ></ui-input>
          </ui-form-item>
          <ui-form-item label="所在年级" prop="gradeLabel">
            <div style="display: flex">
              <ui-select
                style="width: 80%"
                placeholder="请选择年级"
                class="select-box"
                v-model="ruleForm.gradeLabel"
                @change="getGrade"
              >
                <ui-select-option
                  v-for="item in gradeList"
                  :key="item.codeInfoId"
                  :label="item.codeInfoName"
                  :value="item.codeInfoName"
                >
                </ui-select-option>
              </ui-select>
            </div>
          </ui-form-item>
          <ui-form-item label="建班时间" required prop="createTime">
            <ui-date-picker
              style="width: 80%"
              v-model="ruleForm.createTime"
              type="date"
              placeholder="请选择建班时间"
              @change="dateChange"
            >
            </ui-date-picker>
          </ui-form-item>
        </ui-form>
      </div>

      <div class="form-box" v-else>
        <ui-form
          :model="ruleForm"
          :rules="validate.rule"
          ref="formCheck"
          label-width="110"
        >
          <ui-form-item label="班徽">
            <div class="class-img">
              <div>
                <div
                  @click="showCropper = true"
                  class="form-img"
                  v-if="!ruleForm.classImgUrl"
                >
                  <ui-icon icon="icon-a-1" class="form-icon"></ui-icon>
                </div>
                <img
                  @click="showCropper = true"
                  class="form-img"
                  v-if="ruleForm.classImgUrl"
                  :src="ruleForm.classImgUrl"
                />
              </div>
              <ui-avatar-cropper
                style="float: left"
                v-if="showCropper"
                @cancelImg="showCropper = false"
                @sendImgInfo="getImgInfo"
              ></ui-avatar-cropper>
            </div>
          </ui-form-item>
          <ui-form-item label="当前班级名称">
            <ui-input
              :disabled="true"
              v-model="ruleForm.name"
              style="width: 80%; color: #000000"
              placeholder="输入班级名称"
            ></ui-input>
          </ui-form-item>
          <ui-form-item label="升级后班级名称" prop="name">
            <ui-input
              v-model="ruleForm.newName"
              style="width: 80%"
              placeholder="输入班级名称"
            ></ui-input>
          </ui-form-item>
        </ui-form>
      </div>
    </div>
  </ui-modal>
  <div></div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useStore } from "vuex";
import { validate } from "../index";
import { addClassInfo, editClassInfo } from "@/api/classManage";
import { selectEntryDate } from "@/utils/common";
import Message from "@/themes/message";

interface ruleForm {
  clazzImg?: string;
  name?: string;
  grade: string | number;
  gradeLabel: string;
  createTime: string | Date;
  classImgUrl?: string;
  schoolId: string;
  id: string | number;
  newName?: string;
}
interface addClass {
  title: string;
  width: string | number;
  open: boolean;
}
export default defineComponent({
  props: {
    className: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    type: {
      type: String,
    },
    classInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["update"],
  setup(props, ctx) {
    const $store = useStore();
    const showCropper = ref(false);
    const formCheck = ref(null);
    const classMode = ref({
      className: props.className,
      width: props.width,
      type: props.type,
    });
    //初始化班级数据
    const ruleForm = ref({
      gradeLabel: "",
    } as ruleForm);
    //获取年级信息
    const gradeList = $store.state.commonData.gradeList; // 年级列表
    //添加班级
    const addClass = reactive({
      width: 600,
    } as addClass);

    const editStatus = ref(0);
    // 打开模态框
    const handleOpen = (index: string, res?: any) => {
      ruleForm.value = Object.assign({
        gradeLabel: "",
      });
      if (index === "add") {
        addClass.title = "新增班级";
        editStatus.value = 1;
      } else if (index === "edit") {
        addClass.title = "修改班级信息";
        editStatus.value = 2;
        ruleForm.value = Object.assign({}, res);
        ruleForm.value.classImgUrl = res.clazzImg;
        delete ruleForm.value.clazzImg;
      } else {
        addClass.title = "升班";
        editStatus.value = 3;
        ruleForm.value = Object.assign({}, res);
        ruleForm.value.classImgUrl = res.clazzImg;
        delete ruleForm.value.clazzImg;
      }
      addClass.open = true;
    };
    //关闭弹窗
    const handleClose = () => {
      addClass.open = false;
    };
    const dateChange = () => {
      // (formCheck.value as any)?.clearValidate(["createTime"]);
      (formCheck.value as any)?.validate(() => {
        console.log("123");
      });
    };
    //确认添加班级
    const handleAdd = () => {
      (formCheck.value as any)?.validate(async (valid: boolean) => {
        if (valid) {
          let time = selectEntryDate(
            ruleForm.value.createTime as Date | string
          );
          ruleForm.value.createTime = time as Date | string;
          ruleForm.value.schoolId = $store.state.user.schoolId;
          if (editStatus.value === 1) {
            let { code } = await addClassInfo(ruleForm.value);
            if (+code === 0) {
              addClass.open = false;
              Message.success("班级新增成功！");
              ctx.emit("update");
            }
          } else if (editStatus.value === 2) {
            const data = Object.assign({}, ruleForm.value);
            console.log(data);
            delete data.classImgUrl;
            let { code } = await editClassInfo(data.id, data);
            if (+code === 0) {
              addClass.open = false;
              Message.success("班级信息修改成功！");
              ctx.emit("update");
            }
          } else if (editStatus.value === 3) {
            // getGrade(+ruleForm.value.grade + 1);
            const form = Object.assign({}, ruleForm.value);
            form.grade = +form.grade + 1;
            form.gradeLabel = gradeList.filter((item: any) => {
              if (item.codeInfoValue == form.grade) {
                return item.codeInfoName;
              }
            })[0]?.codeInfoName;
            form.name = form.newName;
            delete form.newName;
            let { code } = await editClassInfo(form.id, form);
            if (+code === 0) {
              addClass.open = false;
              Message.success("班级升班成功！");
              ctx.emit("update");
            }
          }
        } else {
          console.log("验证失败");
        }
      });
    };
    const getImgInfo = (data: any) => {
      if (data) {
        console.log("000000", data);
        ruleForm.value.clazzImg = data.data;
        ruleForm.value.classImgUrl = data.attach;
        showCropper.value = false;
      }
    };
    const getGrade = (data: number) => {
      ruleForm.value.grade = gradeList.filter((item: any) => {
        if (item.codeInfoName == data) {
          return item.codeInfoValue;
        }
      })[0]?.codeInfoValue;
    };

    return {
      classMode,
      ruleForm,
      gradeList,
      addClass,
      handleClose,
      handleAdd,
      handleOpen,
      showCropper,
      getImgInfo,
      validate,
      formCheck,
      getGrade,
      editStatus,
      dateChange,
    };
  },
});
</script>
<style lang="less" scoped>
.form-box {
  margin-bottom: 30px;
  .form-img {
    width: 48px;
    height: 48px;
    background: #fafafa;
    border-radius: 4px;
    // margin-bottom: -30px;
    margin-top: -10px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    .form-icon {
      width: 30px;
      margin: 15px 0px 0px 10px;
      cursor: pointer;
    }
  }
}
</style>
