<template>
    <el-drawer v-model="drawer" :title="title" custom-class="drawer-box">
        <ul class="mer-all-info-box">
            <li>
                <basicInfo ref="basicInfoCom" v-if="basicInfoData" :basicInfoData="basicInfoData" flag="2"></basicInfo>
            </li>
            <li>
                <idCardInfo ref="idCardInfoCom" v-if="idCardInfoData" :idCardInfoData="idCardInfoData" flag="2">
                </idCardInfo>
            </li>
            <li>
                <h4>提现银行卡信息</h4>
                <el-table :data="tableList" border style="width: 100%">
                    <el-table-column label="添加时间">
                        <template #default="{ row }">
                            <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bankNumber" label="卡号" />
                    <el-table-column prop="bankName" label="开户银行" />
                    <el-table-column prop="bankAccountName" label="银行卡类型" />
                    <el-table-column prop="bankCardName" label="银行卡户名" />
                    <el-table-column prop="status" label="状态" />
                    <el-table-column prop="updateUserName" label="审核人" />
                    <el-table-column prop="createUserName" label="提交人" />
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button type="text" @click="hanleViewBankDetail(row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </li>
            <li class="botom-btn-box">
                <!-- <el-button type="success" @click="handleUpdata">保存</el-button> -->
                <el-button @click="handleClose">取消</el-button>
            </li>
        </ul>
    </el-drawer>
    <el-dialog v-model="dialogVisible" title="银行卡审核详情" width="60%">
        <bankCardInfo flag="2" :bankCardInfoData="bankCardInfoData" :hasChecker="true"></bankCardInfo>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import { merchantSettingDetail, updateMerchantSetting, bankExamine } from '../merchantList/api'
import { ElMessage } from 'element-plus'
import md5 from 'js-md5'
import dayjs from 'dayjs';

export interface Setup {
    dialogVisible: Ref<boolean>;
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: (any) => void;
    merchantId: Ref<number>;
    basicInfoData: Ref<any>;
    idCardInfoData: Ref<any>;
    tableList: Ref<any[]>;
    hanleViewBankDetail: (string) => void;
    handleUpdata: () => void;
    basicInfoCom: Ref<unknown>;
    idCardInfoCom: Ref<unknown>;
    md5: any;
    bankCardInfoData: Ref<any>;
    dayjs: any
}

export default defineComponent({
    name: '',
    props: {
        title: {
            type: String as PropType<string>
        },
        // 1-新增，2-修改
        flag: {
            type: String as PropType<string>
        }
    },
    components: {
        basicInfo,
        idCardInfo,
        bankCardInfo
    },
    setup(): Setup {
        const drawer = ref<boolean>(false);
        const merchantId = ref<number>(-1);
        const basicInfoData = ref<any>(null);
        const idCardInfoData = ref<any>(null);
        const tableList = ref<any>([]);
        const dialogVisible = ref<boolean>(false);
        const basicInfoCom = ref<unknown>(null);
        const idCardInfoCom = ref<unknown>(null);
        const bankCardInfoData = ref<any>(null);


        // 关闭抽屉回调
        const handleClose = (): void => {
            drawer.value = false;
        };

        // 打开抽屉
        const handleOpen = (res: any): void => {
            merchantId.value = res.merchantId
            getMerchantSettingDetail()
            drawer.value = true;
        };

        async function getMerchantSettingDetail() {
            const { code, data } = await merchantSettingDetail(merchantId.value)
            if (+code === 1000) {
                basicInfoData.value = data;
                idCardInfoData.value = data;
                tableList.value = data.listBanks
            }
        }

        function hanleViewBankDetail(res): void {
            getBankExamine(res.id)
        }

        async function getBankExamine(merchantBankId: number): Promise<void> {
            const { code, data } = await bankExamine(merchantBankId);
            if (+code === 1000) {
                bankCardInfoData.value = data;
                dialogVisible.value = true;
            }
        }

        async function handleUpdata(): Promise<void> {
            const merchantData = {
                ...(basicInfoCom.value as any).dataObj,
                ...(idCardInfoCom.value as any).dataObj,
            }

            const { code } = await updateMerchantSetting(merchantData);
            if (+code === 1000) {
                ElMessage.success('修改成功')
                drawer.value = false;
            }
        }



        return {
            drawer,
            handleOpen,
            merchantId,
            basicInfoData,
            idCardInfoData,
            handleClose,
            tableList,
            dialogVisible,
            hanleViewBankDetail,
            handleUpdata,
            basicInfoCom,
            idCardInfoCom,
            md5,
            bankCardInfoData,
            dayjs
        }
    }
})
</script>
<style lang='scss' scoped>
.mer-all-info-box {
    >li {
        margin-bottom: 20px;

        &.botom-btn-box {
            text-align: right;
        }

        >h4 {
            margin-bottom: 20px;
        }
    }
}
</style>