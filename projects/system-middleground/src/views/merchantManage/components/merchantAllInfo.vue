<template>
    <el-drawer v-model="drawer" :title="title" custom-class="drawer-box">
        <ul class="mer-all-info-box">
            <li>
                <basicInfo :flag="flag" ref="basicInfoCom" :basicInfoData="basicInfoData"></basicInfo>
            </li>
            <li>
                <idCardInfo :flag="flag" ref="idCardInfoCom" :idCardInfoData="idCardInfoData"></idCardInfo>
            </li>
            <li>
                <bankCardInfo :flag="flag" ref="bankCardInfoCom" :bankCardInfoData="bankCardInfoData"></bankCardInfo>
            </li>
            <li class="botom-btn-box">
                <el-button @click="handleClose">关闭</el-button>
            </li>
        </ul>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, Ref, ref, computed } from 'vue'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'
import { addMerchant } from '../merchantList/api'
import { ElMessage } from 'element-plus'
import { applyDetail } from '../merchantApplyFor/api'
import micell from 'micell'

export interface Setup {
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: () => void;
    basicInfoCom: Ref<unknown>;
    idCardInfoCom: Ref<unknown>;
    bankCardInfoCom: Ref<unknown>;
    basicInfoData: Ref<any>;
    idCardInfoData: Ref<any>;
    bankCardInfoData: Ref<any>;
    micell: any;
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
    setup(props, { emit }): Setup {
        const drawer = ref<boolean>(false);
        const basicInfoCom = ref<unknown>(null);
        const idCardInfoCom = ref<unknown>(null);
        const bankCardInfoCom = ref<unknown>(null);
        const flag = computed(() => props.flag);
        const basicInfoData = ref<any>(null);
        const idCardInfoData = ref<any>(null);
        const bankCardInfoData = ref<any>(null);

        // 关闭抽屉回调
        const handleClose = (): void => {
            basicInfoData.value = [];
            idCardInfoData.value = [];
            bankCardInfoData.value = [];
            drawer.value = false;
        };

        // 打开抽屉
        const handleOpen = (row?: any): void => {
            if (+flag.value === 2) {
                getApplyDetail(row)
            } else {
                drawer.value = true;
            }
        };

        // 商户信息回显
        async function getApplyDetail(row) {
            const { code, data } = await applyDetail(row.bankId, row.merchantId)
            if (+code === 1000) {
                if (data) {
                    basicInfoData.value = data;
                    idCardInfoData.value = data;
                    bankCardInfoData.value = data;
                    drawer.value = true;
                } else {
                    ElMessage.error('暂无数据查看')
                }
            }
        }

        return {
            drawer,
            handleClose,
            handleOpen,
            basicInfoCom,
            idCardInfoCom,
            bankCardInfoCom,
            basicInfoData,
            idCardInfoData,
            bankCardInfoData,
            micell
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