<template>
    <ul class="mer-all-info-box">
        <h3>开户申请</h3>
        <li>
            <basicInfo flag="1" ref="basicInfoCom" :basicInfoData="basicInfoData"></basicInfo>
        </li>
        <li>
            <idCardInfo flag="1" ref="idCardInfoCom" :idCardInfoData="idCardInfoData"></idCardInfo>
        </li>
        <li>
            <bankCardInfo flag="1" ref="bankCardInfoCom" :bankCardInfoData="bankCardInfoData"></bankCardInfo>
        </li>
        <li class="botom-btn-box">
            <el-button type="success" @click="handleSave">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'
import { addMerchant } from '@/views/merchantManage/merchantList/api'
import { ElMessage } from 'element-plus'
import micell from 'micell'
import md5 from 'js-md5'

export interface Setup {
    handleClose: () => void;
    handleSave: () => void;
    basicInfoCom: Ref<unknown>;
    idCardInfoCom: Ref<unknown>;
    bankCardInfoCom: Ref<unknown>;
    basicInfoData: Ref<any>;
    idCardInfoData: Ref<any>;
    bankCardInfoData: Ref<any>;
    micell: any;
    md5: any
}

export default defineComponent({
    components: {
        bankCardInfo,
        basicInfo,
        idCardInfo
    },
    setup(props, { emit }): Setup {
        const basicInfoCom = ref<unknown>(null);
        const idCardInfoCom = ref<unknown>(null);
        const bankCardInfoCom = ref<unknown>(null);
        const merchantData = ref({});
        const basicInfoData = ref<any>(null);
        const idCardInfoData = ref<any>(null);
        const bankCardInfoData = ref<any>(null);

        // 关闭/取消
        const handleClose = (): void => {
            history.back()
            basicInfoData.value = [];
            idCardInfoData.value = [];
            bankCardInfoData.value = [];
            localStorage.removeItem('basicInfo')
            localStorage.removeItem('idCardInfo')
            localStorage.removeItem('bankCardInfo')
        };

        function checkBasicInfo() {
            const formEl = (basicInfoCom.value as any).basicInfoRef
            if (!formEl) return
            return new Promise((resovle, reject) => {
                formEl.validate((valid, fields) => {
                    if (valid) {
                        resovle(true)
                    } else {
                        reject(fields)
                    }
                })
            })
        }

        function checkIdCardInfo() {
            const formEl = (idCardInfoCom.value as any).idCardInfoRef
            if (!formEl) return
            return new Promise((resovle, reject) => {
                formEl.validate((valid, fields) => {
                    if (valid) {
                        resovle(true)
                    } else {
                        reject(fields)
                    }
                })
            })
        }

        function checkBankCardInfo() {
            const formEl = (bankCardInfoCom.value as any).bankCardInfoRef
            if (!formEl) return
            return new Promise((resovle, reject) => {
                formEl.validate((valid, fields) => {
                    if (valid) {
                        resovle(true)
                    } else {
                        reject(fields)
                    }
                })
            })
        }

        const handleSave = (): void => {
            Promise.all([checkBasicInfo(), checkIdCardInfo(), checkBankCardInfo()]).then(res => {
                let newBasicInfo = JSON.parse(JSON.stringify((basicInfoCom.value as any).dataObj))
                let newIdCardInfo = JSON.parse(JSON.stringify((idCardInfoCom.value as any).dataObj))
                let newBankCardInfo = JSON.parse(JSON.stringify((bankCardInfoCom.value as any).dataObj))
                newBasicInfo.mPassword = md5(newBasicInfo.mPassword)


                // 如果是对公账户，就置空某些字段
                if (+newBasicInfo.acntType === 1) {
                    newBasicInfo.acntCertifExpireDt = ''
                    newBasicInfo.acntCertifId = ''
                    newBasicInfo.acntNm = ''
                    newBankCardInfo.bankFrontImg = ''
                    newBankCardInfo.bankBackImg = ''
                    newBankCardInfo.bankNumber = ''
                    newBankCardInfo.bankUserFont = ''
                    newBankCardInfo.bankUserReverse = ''
                    newBankCardInfo.bankUserCode = ''
                    newBankCardInfo.userPhone = ''
                }

                if (+newBasicInfo.settleTp === 1 || +newBasicInfo.settleTp === 2) {
                    newBasicInfo.settleTpCd = ''
                }

                merchantData.value = {
                    ...newBasicInfo,
                    ...newIdCardInfo,
                    ...newBankCardInfo
                }
                tranDate(merchantData.value)

                handleAddMerchant()
            }).catch(err => {
                ElMessage.error('请正确填写相关信息')
                console.log('验证失败', err);
            })
        }

        // 转换时间格式
        const tranDate = (obj): void => {
            const dateList = ['acntCertifExpireDt', 'certifIdExpireDt', 'licenseExpireDt', 'licenseStartDt', 'cardStartDt']
            for (let key in obj) {
                if (dateList.includes(key)) {
                    obj[key] = micell.date.format(new Date(obj[key]), "YYYYMMDD")
                    // 如果是对公账户就不转换时间
                    if (+obj.acntType === 1) {
                        obj.acntCertifExpireDt = ''
                    }
                }
            }
        }

        async function handleAddMerchant(): Promise<void> {
            const { code } = await addMerchant(merchantData.value);
            if (+code === 1000) {
                ElMessage.success('提交成功')
                handleClose()
            }
        }

        document.title = '开户申请'

        return {
            handleClose,
            handleSave,
            basicInfoCom,
            idCardInfoCom,
            bankCardInfoCom,
            basicInfoData,
            idCardInfoData,
            bankCardInfoData,
            micell,
            md5
        }
    }
})
</script>
<style lang='scss' scoped>
.mer-all-info-box {
    padding: 16px;

    h3 {
        margin-bottom: 16px;
    }

    >li {
        margin-bottom: 20px;
    }
}
</style>