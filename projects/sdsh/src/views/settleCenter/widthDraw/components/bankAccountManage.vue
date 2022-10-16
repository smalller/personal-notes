<template>
    <el-drawer v-model="drawer" title="银行卡账户管理" custom-class="drawer-box">
        <div style="margin-bottom: 20px;">
            <el-button type="primary" @click="addBankAccount">新增</el-button>
        </div>
        <el-table :data="[]" border style="width: 100%">
            <el-table-column prop="mcName" label="添加时间" />
            <el-table-column prop="detailAddress" label="卡号" />
            <el-table-column prop="contactsName" label="开户银行" />
            <el-table-column prop="contactsPhone" label="银行卡类型" />
            <el-table-column prop="createTime" label="银行卡户名" />
            <el-table-column prop="chargeRate" label="状态" />
            <el-table-column prop="totalBalance" label="提交人" />
            <el-table-column label="操作">
                <!-- <template #default="{ row }">
                    <el-button type="text" @click="viewDetail(row)">详情</el-button>
                </template>-->
            </el-table-column>
        </el-table>
    </el-drawer>
    <addBankAccount ref="addBankAccountCom"></addBankAccount>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import addBankAccount from './addBankAccount.vue'

export default defineComponent({
    name: '',
    components: {
        addBankAccount
    },
    setup() {
        const addBankAccountCom = ref<unknown>(null)
        const addBankAccount = (): void => {
            (addBankAccountCom.value as any).handleOpen(1)
        }

        const drawer = ref<boolean>(false);

        // 关闭抽屉回调
        const handleClose = (): void => {
            drawer.value = false;
        };

        // 打开抽屉
        const handleOpen = (res: any): void => {
            drawer.value = true;
        };


        return {
            addBankAccount,
            addBankAccountCom,
            drawer,
            handleClose,
            handleOpen
        }
    }
})
</script>
<style lang='scss' scoped></style>