<template>
  <el-drawer v-model="drawer" title="编辑人员" custom-class="drawer-box">
    <el-form model class="filter-box" label-position="right" label-width="120px">
      <el-form-item label="姓名：">
        <el-input clearable v-model="userInfo.userName" placeholder="请输入姓名" />
        <span>（只能输入汉字，字母）</span>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="userInfo.account" clearable placeholder="请输入手机号" />
        <span>（输入正确的手机号便于账号找回）</span>
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-input v-model="userInfo.password" type="password" placeholder="请输入登录密码" show-password />
        <span>（密码长度8至15位，不能输入特殊字符和空格，例如：》？！~等）</span>
      </el-form-item>
      <el-form-item label="确认登录密码：">
        <el-input v-model="userInfo.rePassword" type="password" placeholder="请确认密码" show-password />
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-model="role" placeholder="请选择">
          <el-option v-for="item in payStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span>（选择已设定的角色赋予权限）</span>
      </el-form-item>
    </el-form>
    <div class="botom-btn-box">
      <el-button type="primary" @click="save">提交</el-button>
      <el-button @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { roleList, addUser, fixUser } from '../api';
import { UserItem } from '../data';
import { ElMessage } from 'element-plus';
import md5 from 'js-md5'

export interface Setup {
  drawer: Ref<boolean>;
  handleClose: () => void;
  handleOpen: (any) => void;
  payStatusList: Ref<[]>;
  userInfo: Ref<UserItem>;
  role: Ref<any>;
  save: () => void;
  md5: any
}
export default defineComponent({
  name: '',
  setup(props, { emit }): Setup {
    const drawer = ref<boolean>(false);
    const role = ref();

    const type = ref(0);
    // 打开抽屉
    const handleOpen = (res: any): void => {
      getRoleList();
      if (res) {
        userInfo.value = res;
        role.value = res.roleList[0]?.id;
        type.value = 1;
      }
      drawer.value = true;
    };
    const payStatusList = ref([] as any);
    const userInfo = ref({} as UserItem);
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数

    // 关闭抽屉回调
    const handleClose = (): void => {
      userInfo.value = {} as UserItem
      drawer.value = false;
    };

    async function getRoleList(): Promise<void> {
      const { code, data } = await roleList(currentPage.value, pageSize.value);
      if (+code === 1000) {
        payStatusList.value = data;
        // totalNum.value = data.total;
      }
    }
    getRoleList();
    async function save(): Promise<void> {
      const reqData = JSON.parse(JSON.stringify(userInfo.value))

      if (reqData.password !== reqData.rePassword) {
        ElMessage.error("两次输入密码不一致");
        return;
      }

      if (reqData.password && reqData.rePassword) {
        reqData.password = md5(JSON.parse(JSON.stringify(reqData.password)))
        reqData.rePassword = md5(JSON.parse(JSON.stringify(reqData.rePassword)))
      }

      reqData.roleList = [role.value]

      if (type.value === 1) {
        const { code, data } = await fixUser(reqData);
        if (+code === 1000) {
          handleClose();
          ElMessage.success('修改成功');
          emit('editComplete')
        }
      } else {
        const { code, data } = await addUser(reqData);
        if (+code === 1000) {
          handleClose();
          ElMessage.success('添加成功');
          emit('editComplete')
        }
      }
    }
    return {
      userInfo,
      drawer,
      handleClose,
      handleOpen,
      payStatusList,
      save,
      role,
      md5
    };
  },
});
</script>
<style lang='scss' scoped>
.el-form-item__content {
  display: flex;
  align-items: center;

  .el-input {
    width: 200px;
  }
}

.botom-btn-box {
  text-align: right;
  margin-top: 20px;
}
</style>