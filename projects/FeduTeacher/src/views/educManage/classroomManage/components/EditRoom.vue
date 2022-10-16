<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="498"
    okText="保存"
    :tips="false"
  >
    <div class="body-text-box">
      <div class="form-box">
        <div class="left-form">
          <ui-form
            :model="ruleForm"
            :rules="staticData.rules"
            ref="formCheck"
            label-width="100"
          >
            <ui-form-item label="教室名称" prop="name">
              <ui-input
                v-model="ruleForm.name"
                placeholder="输入教室名称"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="教室编号">
              <ui-input
                v-model="ruleForm.number"
                placeholder="输入教室编号"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="容纳人数">
              <ui-input
                style="width: 100px"
                v-model="ruleForm.capacity"
                placeholder="输入人数"
              ></ui-input>
              人
            </ui-form-item>
          </ui-form>
        </div>
      </div>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { staticData, ListRow } from "../index";
import Message from "@/themes/message";
import { editRoom } from "@/api/classroomManage";
import bus from "@/Layout/bus";

export default defineComponent({
  setup(props, { emit }) {
    const formCheck = ref(null);
    const modalStatus = ref(false);
    const title = ref("");
    const editFlag = ref(1); //1-新增操作，2-修改操作
    const schoolId = sessionStorage.getItem("schoolId");

    let ruleForm = ref({
      number: "",
      name: "",
      capacity: "",
      schoolId,
    });

    // 打开模态框
    const handleOpen = (index: number, res?: ListRow) => {
      if (index === 1) {
        title.value = "新增教室";
        editFlag.value = 1;
      } else {
        title.value = "编辑教室";
        editFlag.value = 2;
        const { id, name, number, capacity } = Object.assign({}, res);
        ruleForm.value = {
          id,
          name,
          number,
          capacity,
          schoolId,
        } as any;
      }
      modalStatus.value = true;
    };

    // 初始化数据
    function initRuleForm() {
      ruleForm.value = {
        number: "",
        name: "",
        capacity: "",
        schoolId,
      };
    }

    // 取消按钮
    const handleClose = () => {
      formCheck.value = null;
      modalStatus.value = false;
    };

    // 新增/修改操作
    async function addClassRoom() {
      let txt = "";
      if (editFlag.value === 1) {
        txt = "新增成功";
      } else {
        txt = "修改成功";
      }
      if (ruleForm.value.capacity === "") {
        ruleForm.value.capacity = "0";
      }
      const { code } = await editRoom(ruleForm.value);
      if (+code === 0) {
        bus.$emit("updateList");
        initRuleForm();
        modalStatus.value = false;
        Message.success(txt);
        emit("updateComplete");
      }
    }

    // 验证容纳人数
    function checkPeopleNum() {
      if (ruleForm.value.capacity) {
        if (!/(^[0-9]\d*$)/.test(ruleForm.value.capacity)) {
          Message.error("请输入正确的容纳人数");
          return false;
        } else if (+ruleForm.value.capacity > 1500) {
          Message.error("容纳人数最多为1500人");
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          if (checkPeopleNum()) {
            console.log("验证通过");
            addClassRoom();
          }
        } else {
          console.log("验证失败");
        }
      });
    };

    return {
      modalStatus,
      title,
      ruleForm,
      handleClose,
      handleSure,
      handleOpen,
      formCheck,
      staticData,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  font-size: 14px;
  margin: 20px 0 40px 0;

  .form-box {
    display: flex;
    justify-content: space-between;

    .left-form {
      flex-grow: 1;

      .cover-img-box {
        display: flex;
        align-items: center;

        .upload-img-box {
          width: 210px;
          height: 120px;
          border-radius: 4px;
          margin-right: 20px;

          > img {
            width: 210px;
            height: 120px;
            border: 1px solid undefined;
          }
        }

        .upload-box {
          .upload-area {
            width: 209px;
            height: 118px;
            margin-bottom: 10px;
            cursor: pointer;

            .not-upload {
              border: 1px dashed #d9d9d9;
              border-radius: 4px;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #999;
              font-size: 14px;
              background: #fafafa;
            }

            > img {
              border-radius: 4px;
              width: 100%;
              height: 100%;
            }
          }

          > p {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
