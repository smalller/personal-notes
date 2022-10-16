<template>
    <el-drawer v-model="drawer" :title="title" custom-class="drawer-box">
        <ul class="mer-all-info-box">
            <li>
                <basicInfo :flag="flag" ref="basicInfoCom" :basicInfoData="merchantData" :isCheckRate="true">
                </basicInfo>
            </li>
            <li>
                <idCardInfo :flag="flag" ref="idCardInfoCom" :idCardInfoData="merchantData"></idCardInfo>
            </li>
            <li>
                <bankCardInfo :flag="flag" ref="bankCardInfoCom" :bankCardInfoData="merchantData"></bankCardInfo>
            </li>
            <li class="botom-btn-box">
                <el-button type="success" @click="handleSave">审核通过</el-button>
                <el-button type="danger" @click="handlePass">审核拒绝</el-button>
                <el-button @click="handleClose">取消</el-button>
            </li>
        </ul>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'
import { ElMessage } from 'element-plus'
import { merchantExamine, updateMerchantExamine, updateModifyMerchant } from '../api'
import bus from '@/utils/bus'

export interface Setup {
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: (any?) => void;
    handleSave: () => Promise<void>;
    handlePass: () => Promise<void>;
    basicInfoCom: Ref<unknown>;
    idCardInfoCom: Ref<unknown>;
    bankCardInfoCom: Ref<unknown>;
    merchantData: Ref<any>;
}

export default defineComponent({
    name: '',
    props: {
        title: {
            type: String as PropType<string>,
        },
        // 1-新增，2-回显
        flag: {
            type: String as PropType<any>,
            require: true
        }
    },
    components: {
        bankCardInfo,
        basicInfo,
        idCardInfo
    },
    setup(props): Setup {
        const drawer = ref<boolean>(false);
        const basicInfoCom = ref<unknown>(null);
        const idCardInfoCom = ref<unknown>(null);
        const bankCardInfoCom = ref<unknown>(null);
        const idCardInfoData = ref<any>(null);
        const bankCardInfoData = ref<any>(null);
        const merchantData = ref<any>(null)

        // 关闭抽屉回调
        const handleClose = (): void => {
            drawer.value = false;
        };

        // 打开抽屉
        const handleOpen = (row?: any): void => {
            getApplyDetail(row.merchantBankId, row.merchantId)
        };

        // 商户信息回显
        async function getApplyDetail(bankId: number, merchantId: number) {
            const { code, data } = await merchantExamine(bankId, merchantId)
            if (+code === 1000) {
                if (data) {
                    merchantData.value = data;
                    drawer.value = true;
                } else {
                    ElMessage.warning('暂无数据')
                }
            }
        }

        const handleSave = async (): Promise<void> => {
            const { merchantId, chargeRate, subsidyRate } = merchantData.value;

            if (!chargeRate) {
                ElMessage.error('请选择收费扣率')
                return
            }

            if (!subsidyRate || subsidyRate > 1) {
                ElMessage.error('请填写补贴扣率，并且不能大于1')
                return
            }
            const reqData = {
                chargeRate,
                merchantId,
                subsidyRate
            }
            const { code } = await updateMerchantExamine(reqData);
            if (+code === 1000) {
                bus.$emit('checkSuccess')
                ElMessage.success('审核通过')
                drawer.value = false;
            }
        }

        const handlePass = async (): Promise<void> => {
            const { code } = await updateModifyMerchant(merchantData.value.merchantId);
            if (+code === 1000) {
                bus.$emit('checkSuccess')
                ElMessage.success('审核拒绝')
                drawer.value = false;
            }
        }

        return {
            drawer,
            handleClose,
            handleOpen,
            handleSave,
            basicInfoCom,
            idCardInfoCom,
            bankCardInfoCom,
            handlePass,
            merchantData
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
    }
}
</style>