<template>
  <div class="edit-parent-box">
    <ui-modal
      v-model:visible="modalStatus"
      @ok="handleSure"
      title="家长详情"
      width="645"
      okText="关闭"
      :tips="false"
      :showClose="false"
    >
      <div class="body-text-box" v-if="ruleForm">
        <div class="form-box">
          <div class="left-form">
            <ui-form :model="ruleForm" ref="formCheck" label-width="71">
              <ui-form-item label="头像" class="parent-avatar-box">
                <img
                  class="parent-avatar"
                  :src="
                    ruleForm.userHeadPortait
                      ? ruleForm.userHeadPortait
                      : require('@/assets/staff-avatar.png')
                  "
                  alt=""
                />
              </ui-form-item>
              <ui-form-item label="昵称">
                <ui-input
                  readonly
                  maxlength="40"
                  v-model="ruleForm.username"
                ></ui-input>
              </ui-form-item>
              <ui-form-item label="性别">
                <ui-input
                  readonly
                  maxlength="40"
                  v-model="ruleForm.userSex"
                ></ui-input>
              </ui-form-item>
              <ui-form-item label="生日">
                <ui-input
                  readonly
                  maxlength="40"
                  v-model="ruleForm.userBirthday"
                ></ui-input>
              </ui-form-item>
              <ui-form-item label="常住地址">
                <ui-input
                  readonly
                  maxlength="40"
                  v-model="ruleForm.liveAdress"
                ></ui-input>
              </ui-form-item>
              <ui-form-item label="个性签名">
                <ui-input
                  readonly
                  height="80"
                  type="textarea"
                  v-model="ruleForm.personSign"
                ></ui-input>
              </ui-form-item>
            </ui-form>
          </div>
        </div>
      </div>
    </ui-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const modalStatus = ref(false);
    const ruleForm = ref();

    // 打开模态框
    const handleOpen = (res: any) => {
      ruleForm.value = res;
      modalStatus.value = true;
    };

    // 确认按钮
    const handleSure = () => {
      modalStatus.value = false;
    };

    return {
      ruleForm,
      modalStatus,
      handleSure,
      handleOpen,
    };
  },
});
</script>

<style lang="less">
.edit-parent-box {
  .body-text-box {
    font-size: 14px;
    margin: 20px 0 40px 0;

    .form-box {
      display: flex;
      justify-content: space-between;

      .left-form {
        flex-grow: 1;

        .ui-form-item-box {
          margin-bottom: 15px;
        }

        .ui-input {
          > input,
          textarea {
            background-color: #f7f7f7;
          }
        }

        .parent-avatar-box {
          align-items: center;

          .ui-form-item-content {
            line-height: 0;
          }
        }

        .parent-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
