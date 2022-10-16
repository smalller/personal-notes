<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    width="645"
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
            label-width="85"
          >
            <ui-form-item label="姓名" prop="name">
              <ui-input
                maxlength="40"
                v-model="ruleForm.name"
                placeholder="请输入姓名"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="手机号" prop="mobile">
              <ui-input
                :disabled="+editFlag === 2"
                maxlength="11"
                v-model="ruleForm.mobile"
                placeholder="请输入手机号"
              ></ui-input>
            </ui-form-item>
            <ui-form-item label="称谓" prop="title">
              <ui-select
                v-model="ruleForm.title"
                placeholder="请选择称谓"
                style="width: 100%"
              >
                <ui-select-option
                  v-for="item in titleList"
                  :key="item.codeInfoId"
                  :label="item.codeInfoName"
                  :value="item.codeInfoName"
                >
                </ui-select-option>
              </ui-select>
            </ui-form-item>
            <ui-form-item label="角色" prop="roleIds">
              <div class="role-box">
                <ui-select
                  multiple
                  v-model="ruleForm.roleIds"
                  placeholder="请选择角色"
                  class="multiple"
                  style="width: 100%"
                >
                  <ui-select-option
                    v-for="item in roleList"
                    :key="item.codeInfoId"
                    :label="item.codeInfoName"
                    :value="item.codeInfoId"
                  >
                  </ui-select-option>
                </ui-select>
                <!-- <div class="question-icon">
                  <ui-icon icon="icon-a-71"></ui-icon>
                  <div class="question-tips">
                    说明文字的展示框说明文字的展示说明文字的展
                  </div>
                </div> -->
              </div>
            </ui-form-item>
            <ui-form-item label="入职时间" prop="onboard">
              <ui-date-picker
                style="width: 100%"
                v-model="ruleForm.onboard"
                type="date"
                placeholder="请选择入职时间"
              >
              </ui-date-picker>
            </ui-form-item>
            <ui-form-item label="所在班级">
              <ui-select
                multiple
                style="width: 100%"
                v-model="ruleForm.clazzIds"
                placeholder="请选择班级"
                class="multiple"
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
            <ui-form-item label="电脑端登录">
              <ui-radio
                :disabled="ruleForm.id === userId"
                v-model="ruleForm.allowLoginPC"
                :label="1"
                >允许</ui-radio
              >
              <ui-radio
                :disabled="ruleForm.id === userId"
                v-model="ruleForm.allowLoginPC"
                :label="0"
                >禁止</ui-radio
              >
            </ui-form-item>
            <ui-form-item label="开通权限">
              <ui-checkbox
                :disabled="ruleForm.id === userId"
                true-label="1"
                false-label="0"
                v-model="ruleForm.noticeDynamicScope"
                >发动态</ui-checkbox
              >
              <ui-checkbox
                :disabled="ruleForm.id === userId"
                true-label="1"
                false-label="0"
                v-model="ruleForm.noticeClazzScope"
                >发班级通知</ui-checkbox
              >
              <ui-checkbox
                :disabled="ruleForm.id === userId"
                true-label="1"
                false-label="0"
                v-model="ruleForm.noticeScope"
                >发全员通知</ui-checkbox
              >
            </ui-form-item>
          </ui-form>
        </div>
        <div class="right-avatar">
          <div class="avatar-box">
            <span>头像</span>
            <!-- <ui-user-avatar
              @click="showCropper = true"
              size="90"
              shape="50"
              :src="ruleForm.headPortraitUrl"
            ></ui-user-avatar> -->
            <img
              :src="
                ruleForm.headPortraitUrl
                  ? ruleForm.headPortraitUrl
                  : require('@/assets/staff-avatar.png')
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
import { staticData, TitleListItem } from "../util";
import { addStaff, updateStaff } from "@/api/teachingManage";
import micell from "micell";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import dayjs from "dayjs";

export default defineComponent({
  setup(props, cxt) {
    const $store = useStore();
    const formCheck = ref(null);
    const titleList = $store.state.commonData.titleList;
    const roleList = $store.state.commonData.roleList;
    const classList = $store.state.commonData.classList;
    const userId = $store.state.user.userId;
    const modalStatus = ref(false);
    const title = ref("");
    const editFlag = ref(1); //1-新增操作，2-修改操作
    const showCropper = ref(false); // 是否打开图片剪切框

    let ruleForm = ref({
      name: "",
      mobile: "",
      title: "",
      roleIds: [] as string[],
      roleNames: [] as string[],
      onboard: dayjs().toDate() as Date | string,
      clazzIds: [],
      allowLoginPC: 0,
      sysAllow: [] as string[],
      noticeDynamicScope: "1",
      noticeClazzScope: "1",
      noticeScope: "0",
      headPortrait: "",
      headPortraitUrl: "",
    });

    // 称谓默认为教师
    function initTitle() {
      titleList.forEach((item: TitleListItem) => {
        if (item.codeInfoName === "教师") {
          ruleForm.value.title = item.codeInfoName;
        }
      });
    }

    // 角色默认为教师
    function initRole() {
      roleList.forEach((item: TitleListItem) => {
        if (item.codeInfoName === "教师") {
          ruleForm.value.roleIds.push(item.codeInfoId);
        }
      });
    }

    initTitle();
    initRole();

    // 打开模态框
    const handleOpen = (index: number, res?: any) => {
      if (index === 1) {
        title.value = "新增员工";
        editFlag.value = 1;
      } else {
        title.value = "编辑员工信息";
        editFlag.value = 2;
        ruleForm.value = Object.assign({}, res);
      }
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 初始化表单
    const initData = (): void => {
      ruleForm.value = {
        name: "",
        mobile: "",
        title: "",
        roleIds: [],
        roleNames: [] as string[],
        onboard: dayjs().toDate() as Date | string,
        clazzIds: [],
        allowLoginPC: 0,
        sysAllow: [] as string[],
        noticeDynamicScope: "1",
        noticeClazzScope: "1",
        noticeScope: "0",
        headPortrait: "",
        headPortraitUrl: "",
      };
      initTitle();
      initRole();
    };

    // 新增员工
    const ADD_STAFF = async (params: any): Promise<void> => {
      const { code } = await addStaff(params);
      if (+code === 0) {
        bus.$emit("editStaffComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("新增成功");
        initData();
      }
    };

    // 修改员工
    const UPDATE_STAFF = async (params: any): Promise<void> => {
      const { code } = await updateStaff(params);
      if (+code === 0) {
        bus.$emit("editStaffComplete", true); // 通知更新表格
        modalStatus.value = false;
        Message.success("修改成功");
      }
    };

    // 转换入职时间格式
    const selectEntryDate = () => {
      if (ruleForm.value.onboard) {
        ruleForm.value.onboard = micell.date.format(
          ruleForm.value.onboard as Date | string,
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    };

    //电脑端登录传值转换
    const sysAllowTran = (): void => {
      if (+ruleForm.value.allowLoginPC === 1) {
        ruleForm.value.sysAllow = ["cms"];
      } else {
        ruleForm.value.sysAllow = [];
      }
    };

    //获取角色id对应的角色名
    const roleIdsToRoleNames = (): void => {
      ruleForm.value.roleNames = [];
      roleList.forEach((listItem: any) => {
        if (ruleForm.value.roleIds.length !== 0) {
          ruleForm.value.roleIds.forEach((idItem: string) => {
            if (idItem === listItem.codeInfoId) {
              ruleForm.value.roleNames.push(listItem.codeInfoName);
            }
          });
        }
      });
    };

    // 确认按钮
    const handleSure = () => {
      (formCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          selectEntryDate();
          sysAllowTran();
          roleIdsToRoleNames();
          console.log("验证通过");
          if (editFlag.value === 1) {
            ADD_STAFF(ruleForm.value);
          } else {
            UPDATE_STAFF(ruleForm.value);
          }
        } else {
          console.log("验证失败");
        }
      });
    };

    // 上传图片
    const getImgInfo = (res: any): void => {
      if (+res.code === 0) {
        console.log(res);

        ruleForm.value.headPortraitUrl = res.attach;
        ruleForm.value.headPortrait = res.data;
        showCropper.value = false;
      }
    };

    return {
      ruleForm,
      modalStatus,
      title,
      handleClose,
      handleSure,
      handleOpen,
      formCheck,
      staticData,
      titleList,
      classList,
      editFlag,
      roleList,
      getImgInfo,
      showCropper,
      userId,
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

      .role-box {
        display: flex;
        align-items: center;
        .question-icon {
          color: #bfbfbf;
          margin-left: 5px;
          position: relative;

          &:hover .question-tips {
            display: block;
          }

          .question-tips {
            display: none;
            position: absolute;
            right: -300px;
            top: 32px;
            width: 324px;
            height: 45px;
            text-align: center;
            line-height: 45px;
            // padding: 8px 15px;
            z-index: 999999;
            background-color: #fff;
            color: #222;
            border-radius: 4px;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

            &::before {
              display: block;
              content: "";
              position: absolute;
              top: -14px;
              left: 9px;
              width: 0;
              border: 7px solid transparent;
              border-bottom: 7px solid #fff;
            }
          }
        }
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
