<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="652"
    okText="保存"
    :tips="true"
  >
    <div class="body-text-box">
      <div class="form-box">
        <div class="left-form">
          <ui-form
            :model="ruleForm"
            :rules="staticData.rules"
            ref="formCheck"
            label-width="96"
          >
            <ui-form-item label="幼儿姓名" prop="name">
              <ui-input
                maxlength="40"
                v-model="ruleForm.name"
                placeholder="请输入姓名"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="性别">
              <ui-radio v-model="ruleForm.sex" :label="1">男</ui-radio>
              <ui-radio v-model="ruleForm.sex" :label="0">女</ui-radio>
            </ui-form-item>
            <ui-form-item label="出生年月" prop="birthTime">
              <ui-date-picker
                style="width: 100%"
                v-model="ruleForm.birthTime"
                type="date"
                placeholder="请选择出生年月"
              >
              </ui-date-picker>
            </ui-form-item>
            <ui-form-item label="入园时间" prop="createTime">
              <ui-date-picker
                style="width: 100%"
                v-model="ruleForm.createTime"
                type="date"
                placeholder="请选择入园时间"
              >
              </ui-date-picker>
            </ui-form-item>
            <ui-form-item label="所在班级" prop="clazzId">
              <ui-select
                style="width: 100%"
                filterable
                v-model="ruleForm.clazzId"
                placeholder="请选择班级"
                :disabled="editFlag === 2"
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
            <ui-form-item label="第一联系人" class="first-contact-box">
              <div class="contact-user-box">
                <ui-form-item prop="contacts" class="contact-input">
                  <ui-input
                    :disabled="editFlag === 2"
                    maxlength="11"
                    v-model="ruleForm.contacts"
                    placeholder="请输入手机号"
                  ></ui-input>
                </ui-form-item>
                <ui-form-item prop="familyRels" class="kindship-select">
                  <ui-select
                    style="width: 120px"
                    filterable
                    :disabled="editFlag === 2"
                    v-model="ruleForm.familyRels"
                    placeholder="亲属关系"
                  >
                    <ui-select-option
                      v-for="item in staticData.kindredList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </ui-select-option>
                  </ui-select>
                </ui-form-item>
              </div>
            </ui-form-item>
            <!-- <ui-form-item label="其他联系人" style="margin-bottom: 0">
              <div
                class="contact-user-box"
                v-for="(item, index) in ruleForm.otherContactList"
                :key="index"
              >
                <ui-form-item class="contact-input">
                  <ui-input
                    maxlength="11"
                    v-model="item.otherContactPhone"
                    placeholder="请输入手机号"
                  ></ui-input>
                </ui-form-item>
                <ui-form-item class="kindship-select">
                  <ui-select
                    style="width: 120px"
                    filterable
                    v-model="item.otherKindship"
                    placeholder="亲属关系"
                  >
                    <ui-select-option
                      v-for="item in staticData.kindredList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </ui-select-option>
                  </ui-select>
                </ui-form-item>
                <ui-button
                  type="text"
                  class="delete-btn"
                  @click="delOtherContactList(index)"
                  >删除</ui-button
                >
              </div>
            </ui-form-item>
            <ui-button
              @click="addOtherContactList"
              type="text-primary"
              icon="icon-a-81"
              class="add-contact-btn"
              >继续添加家庭成员</ui-button
            > -->
          </ui-form>
        </div>
        <div class="right-avatar">
          <div class="avatar-box">
            <span>头像</span>
            <!-- <ui-user-avatar
              @click="showCropper = true"
              size="90"
              shape="50"
              :src="ruleForm.headerImgUrl"
            ></ui-user-avatar> -->
            <img
              :src="
                ruleForm.headerImgUrl
                  ? ruleForm.headerImgUrl
                  : require('@/assets/infant-avatar.png')
              "
              alt=""
            />
            <ui-avatar-cropper
              v-if="showCropper"
              @cancelImg="showCropper = false"
              @sendImgInfo="getImgInfo"
            ></ui-avatar-cropper>
          </div>
        </div>
      </div>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { staticData } from "../util";
import micell from "micell";
import { useStore } from "vuex";
import { addInfant, updateInfant } from "@/api/infantManage";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const $store = useStore();
    const formCheck = ref(null);
    const classList = $store.state.commonData.classList;
    const modalStatus = ref(false);
    const title = ref("");
    const editFlag = ref(1); //1-新增操作，2-修改操作
    const showCropper = ref(false); //图片剪切框

    let ruleForm = ref({
      name: "",
      sex: 1,
      birthTime: dayjs().toDate() as Date | string,
      createTime: dayjs().toDate() as Date | string,
      clazzId: "",
      headerImg: "",
      headerImgUrl: "",
      contacts: "",
      familyRels: "",
      // otherContactList: [
      //   {
      //     otherContactPhone: "",
      //     otherKindship: "",
      //   },
      // ],
    });

    // 打开模态框
    const handleOpen = (index: number, res?: any) => {
      if (index === 1) {
        title.value = "新增幼儿";
        editFlag.value = 1;
      } else {
        title.value = "编辑幼儿信息";
        editFlag.value = 2;
        ruleForm.value = Object.assign({}, res);
      }
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 转换时间格式
    const selectDate = () => {
      if (ruleForm.value.birthTime) {
        ruleForm.value.birthTime = micell.date.format(
          ruleForm.value.birthTime as Date | string,
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      if (ruleForm.value.createTime) {
        ruleForm.value.createTime = micell.date.format(
          ruleForm.value.createTime as Date | string,
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    };

    // 初始化表单
    const initData = (): void => {
      ruleForm.value = {
        name: "",
        sex: 1,
        birthTime: dayjs().toDate() as Date | string,
        createTime: dayjs().toDate() as Date | string,
        clazzId: "",
        headerImg: "",
        headerImgUrl: "",
        contacts: "",
        familyRels: "",
        // otherContactList: [
        //   {
        //     otherContactPhone: "",
        //     otherKindship: "",
        //   },
        // ],
      };
    };

    // 新增幼儿
    const handleAddInfant = async (params: any): Promise<void> => {
      const { code } = await addInfant(params);
      if (+code === 0) {
        bus.$emit("editInfantComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("新增成功");
        initData();
      }
    };

    // 修改幼儿
    const handleUpdateInfant = async (params: any): Promise<void> => {
      const { code } = await updateInfant(params);
      if (+code === 0) {
        bus.$emit("editInfantComplete", true); // 通知更新表格
        bus.$emit("updateParentList", true); // 通知关闭家长管理抽屉
        modalStatus.value = false;
        Message.success("修改成功");
      }
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          selectDate();
          console.log("验证通过");
          if (editFlag.value === 1) {
            handleAddInfant(ruleForm.value);
          } else {
            handleUpdateInfant(ruleForm.value);
          }
        } else {
          console.log("验证失败");
        }
      });
    };

    // 添加其他家庭成员
    // const addOtherContactList = (): void => {
    // ruleForm.value.otherContactList.push({
    //   otherContactPhone: "",
    //   otherKindship: "",
    // });
    // };

    // 删除其他家庭成员
    // const delOtherContactList = (index: number): void => {
    // if (ruleForm.value.otherContactList.length > 1) {
    //   ruleForm.value.otherContactList.splice(index, 1);
    // }
    // };

    // 上传图片
    const getImgInfo = (res: any): void => {
      if (+res.code === 0) {
        ruleForm.value.headerImgUrl = res.attach;
        ruleForm.value.headerImg = res.data;
        showCropper.value = false;
      }
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
      classList,
      // addOtherContactList,
      // delOtherContactList,
      showCropper,
      getImgInfo,
      editFlag,
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

      /deep/ .first-contact-box {
        .ui-form-item-label::before {
          content: "*";
          color: #f56060;
          margin-right: 4px;
        }
      }

      .contact-user-box {
        margin-bottom: 22px;
        display: flex;
        justify-content: space-between;
        position: relative;

        &:last-child {
          margin-bottom: 0;
        }

        .contact-input {
          flex-grow: 1;
          margin-bottom: 0;
        }

        .kindship-select {
          margin: 0 0 0 10px;
        }

        .delete-btn {
          position: absolute;
          right: -40px;
          top: 0;
          color: #bfbfbf;

          &:hover {
            color: #222;
          }
        }
      }

      .add-contact-btn {
        margin: 8px 0 0 97px;
      }
    }

    .right-avatar {
      min-width: 160px;

      .avatar-box {
        margin: 0 20px 0 50px;
        display: flex;
        flex-direction: column;
        align-items: center;

        > img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
        }

        > span {
          color: #666;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
