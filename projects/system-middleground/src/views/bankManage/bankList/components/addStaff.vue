<template>
  <el-drawer v-model="drawer" title="银行基本信息" custom-class="drawer-box">
    <el-form model class="filter-box" label-position="right" label-width="120px">
      <el-form-item label="银行名称：">
        <el-select v-model="bankInfo.dictId" placeholder="请选择">
          <el-option v-for="item in bankList" :key="item.dictId" :label="item.dictLabel" :value="item.dictId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支行名称：">
        <el-input v-model="bankInfo.itemName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input v-model="bankInfo.contactPerson" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="联系电话：">
        <el-input v-model="bankInfo.contactPhone" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="登录账号：">
        <el-input v-model="bankInfo.account" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-input v-model="bankInfo.password" type="password" placeholder="请输入" show-password />
      </el-form-item>
    </el-form>
    <div class="textarea-box">
      <h4>商户审核基本要求</h4>
      <el-input type="textarea" v-model="bankInfo.requirement" :rows="10" clearable placeholder="请输入" />
    </div>
    <div class="botom-btn-box">
      <el-button type="primary" @click="save">提交</el-button>
      <el-button @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { listInfo, addManage, setManage, bankDetail } from '../api';
import { ElMessage } from 'element-plus';
import md5 from 'js-md5'
import { validatePhone } from '@/views/addMerchantMobile/static'

export interface Setup {
  drawer: Ref<boolean>;
  handleOpen: (any) => void;
  bankInfo: Ref<any>;
  bankList: Ref<any>;
  save: (any) => void;
  flag: Ref<number>
  md5: any
}
export default defineComponent({
  name: '',
  setup(props, { emit }): Setup {
    const drawer = ref<boolean>(false);
    const bankInfo = ref<any>({
      dictId: '',
      itemName: '',
      contactPerson: '',
      contactPhone: '',
      account: '',
      password: '',
      requirement: ''
    });
    const flag = ref<number>(0)
    // 打开抽屉
    const handleOpen = (index, res?: any): void => {
      getList();
      bankInfo.value = {
        dictId: '',
        itemName: '',
        contactPerson: '',
        contactPhone: '',
        account: '',
        password: '',
        requirement: ''
      }
      flag.value = index
      if (index === 2) {
        getBankDetail(res.id)
      } else {
        drawer.value = true;
      }
    };

    const getBankDetail = async (id: number): Promise<void> => {
      const { code, data } = await bankDetail(id);
      if (+code === 1000) {
        if (data) {
          bankInfo.value = data
          drawer.value = true;
        } else {
          ElMessage.error('暂无数据')
        }
      }
    };


    const updateManage = async (): Promise<void> => {
      const res = validatePhone(bankInfo.value.contactPhone)
      if (res !== true) {
        ElMessage.error('请输入正确格式的手机号')
        return
      }
      if (bankInfo.value.password) {
        bankInfo.value.password = md5(bankInfo.value.password)
      }
      // bankInfo.value.password = md5(bankInfo.value.password)
      const { code } = await setManage({ ...bankInfo.value, itemId: bankInfo.value.id });
      if (+code === 1000) {
        emit('updateStaffComplete')
        ElMessage.success('修改成功')
        drawer.value = false;
      }
    };

    const handleAddManage = async (): Promise<void> => {
      const res = validatePhone(bankInfo.value.contactPhone)
      if (res !== true) {
        ElMessage.error('请输入正确格式的手机号')
        return
      }
      if (bankInfo.value.password) {
        bankInfo.value.password = md5(bankInfo.value.password)
      } else {
        ElMessage.error('请输入密码')
        return
      }
      const { code } = await addManage({ ...bankInfo.value });
      if (+code === 1000) {
        emit('updateStaffComplete')
        ElMessage.success('新增成功')
        drawer.value = false;
      }
    };

    const save = async (): Promise<void> => {
      if (flag.value === 1) {
        handleAddManage()
      } else {
        updateManage()
      }
    };

    const bankList = ref<any>([]);
    async function getList(): Promise<void> {
      const { code, data } = await listInfo();
      if (+code === 1000) {
        bankList.value = [...data];
      }
    }
    return {
      drawer,
      handleOpen,
      bankInfo,
      save,
      bankList,
      flag,
      md5
    };
  },
});
</script>
<style lang='scss' scoped>
.el-form-item__content {
  display: flex;
  align-items: center;

  .el-input--default.el-input {
    width: 200px;
  }
}

.botom-btn-box {
  text-align: right;
  margin-top: 20px;
}

.filter-box {
  display: flex;
  flex-wrap: wrap;
}

.textarea-box {
  margin-top: 30px;

  >h4 {
    margin-bottom: 20px;
  }
}
</style>