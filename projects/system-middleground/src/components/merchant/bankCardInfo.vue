<template>
    <el-card shadow="never" style="overflow:auto">
        <div class="bank-card-box">
            <h4>银行卡信息</h4>
            <el-form ref="bankCardInfoRef" :model="dataObj" :rules="bankCardInfoRules" label-width="200px">
                <ul>
                    <li>
                        <el-form-item label="银行卡类型：" prop="">
                            <span>对公账户</span>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="银行卡户名：" prop="bankCardName">
                            <el-input maxlength="20" :readonly="+flag === 2" v-model="dataObj.bankCardName"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="开户银行：" prop="bankName">
                            <!-- <el-select v-if="+flag === 1" v-model="selectBankName" filterable placeholder="选择银行"
                                @change="selectedBank">
                                <el-option v-for="item in selectBankList" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select> -->
                            <el-select v-if="+flag === 1" v-model="dataObj.bankName" filterable placeholder="选择银行"
                                @change="selectedBank">
                                <el-option v-for="item in selectBankList" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                            <span v-else>{{ dataObj.dictValue }}</span>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="开户支行：" prop="bId">
                            <el-select v-if="+flag === 1" v-model="dataObj.bId" filterable placeholder="选择支行">
                                <el-option v-for="item in selectSubBankList" :key="item.id" :label="item.itemName"
                                    :value="item.id"></el-option>
                            </el-select>
                            <span v-else>{{ dataObj.bankName }}</span>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账卡开户行联行号：" prop="interBankNo">
                            <el-input maxlength="12" :readonly="+flag === 2" v-model="dataObj.interBankNo"></el-input>
                            <el-button style="margin-top:10px" v-show="+flag === 1" type="primary"
                                @click="downloadTable">
                                联行号对照表</el-button>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账卡号：" prop="acntNo">
                            <el-input :readonly="+flag === 2" v-model="dataObj.acntNo"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账开户行名称：" prop="issBankNm">
                            <el-input :readonly="+flag === 2" v-model="dataObj.issBankNm"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="银行卡正面复印件：" prop="bankFrontImg">
                            <uploadImg :readonly="+flag === 2" :img="dataObj.bankFrontImg"
                                @uploadImg="handleImg($event, 'bankFrontImg')"
                                @removeImg="handleImg($event, 'bankFrontImg')" title="银行卡正面复印件">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="银行卡反面复印件：" prop="bankBackImg">
                            <uploadImg :readonly="+flag === 2" :img="dataObj.bankBackImg"
                                @uploadImg="handleImg($event, 'bankBackImg')"
                                @removeImg="handleImg($event, 'bankBackImg')" title="银行卡反面复印件">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="银行卡号：" prop="bankNumber">
                            <el-input :readonly="+flag === 2" v-model="dataObj.bankNumber"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="收款人身份证正面复印件：" prop="bankUserFont">
                            <uploadImg :readonly="+flag === 2" :img="dataObj.bankUserFont"
                                @uploadImg="handleImg($event, 'bankUserFont')"
                                @removeImg="handleImg($event, 'bankUserFont')" title="身份证正面复印件">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="收款人身份证反面复印件：" prop="bankUserReverse">
                            <uploadImg :readonly="+flag === 2" :img="dataObj.bankUserReverse"
                                @uploadImg="handleImg($event, 'bankUserReverse')"
                                @removeImg="handleImg($event, 'bankUserReverse')" title="身份证反面复印件">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="收款人身份证号：" prop="bankUserCode">
                            <el-input :readonly="+flag === 2" v-model="dataObj.bankUserCode"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="showCom">
                        <el-form-item label="收款人手机号：" prop="userPhone">
                            <el-input maxlength="11" :readonly="+flag === 2" v-model="dataObj.userPhone"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="授权说明书：" prop="authorizationImg">
                            <uploadImg :readonly="+flag === 2" :img="dataObj.authorizationImg"
                                @uploadImg="handleImg($event, 'authorizationImg')"
                                @removeImg="handleImg($event, 'authorizationImg')" title="上传授权说明书"></uploadImg>
                            <el-button v-show="+flag === 1" type="primary" @click="handleDownloadAuth">下载模板
                            </el-button>
                            <span v-show="+flag === 1" style="line-height:20px">下载模板，填写相关信息并盖章，拍照后上传</span>
                        </el-form-item>
                    </li>
                    <li v-if="hasChecker">
                        <el-form-item label="审核人：">
                            <el-input readonly v-model="dataObj.updateUserName"></el-input>
                        </el-form-item>
                    </li>
                </ul>
            </el-form>
        </div>
    </el-card>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, PropType, computed, watch, ComputedRef, onMounted, onUnmounted } from 'vue'
import { regionData, CodeToText, RegionData } from 'element-china-area-data'
import uploadImg from '@/components/common/uploadImg.vue'
import { bankList, subBankList } from '@/common/api'
import { bankCardInfoRules } from './static'
import bus from '@/utils/bus'

interface Setup {
    selectBankList: Ref<any[]>;
    selectSubBankList: Ref<any[]>;
    regionData: RegionData;
    dataObj: Ref<any>;
    selectedBank: (string) => void;
    selectBankName: Ref<string>;
    flag: ComputedRef<string>;
    handleDownloadAuth: () => void;
    downloadTable: () => void;
    bankCardInfoRef: Ref<unknown>;
    bankCardInfoRules: any;
    showCom: Ref<boolean>;
    handleImg: (res: string, name: string) => void
}

export default defineComponent({
    name: '',
    props: {
        // 1-新增，2-修改/回显
        flag: {
            type: String as PropType<any>
        },
        bankCardInfoData: {
            type: Object as PropType<Object>
        },
        hasChecker: {
            type: Boolean as PropType<Boolean>,
            default: () => false
        }
    },
    components: {
        uploadImg
    },
    setup(props): Setup {
        const bankCardInfoRef = ref<unknown>(null)
        const selectBankList = ref<any[]>([]);
        const selectSubBankList = ref<any[]>([])
        const selectBankName = ref<string>('')


        // 获取银行列表
        async function getBankList() {
            const { code, data } = await bankList();
            if (+code === 1000) {
                selectBankList.value = data;
            }
        }
        getBankList()

        const selectedBank = (bankName: string): void => {
            getSubBankList(bankName)
        }

        // 获取支行列表
        async function getSubBankList(bankName?: string) {
            const { code, data } = await subBankList(bankName);
            if (+code === 1000) {
                selectSubBankList.value = data;
            }
        }
        getSubBankList()


        const dataObj = ref<any>({
            bankAccountName: 1,
            bankCardName: '',
            bId: '',
            bankName: '',
            bankNumber: '',
            bankUserCode: '',
            userPhone: '',
            bankFrontImg: '',
            bankBackImg: '',
            bankUserFont: '',
            bankUserReverse: '',
            authorizationImg: '',
            interBankNo: '',
            acntNo: '',
            issBankNm: '',
        })

        const flag = computed(() => props.flag as string);
        const bankCardInfoData = computed(() => props.bankCardInfoData as any)

        if (bankCardInfoData.value) {
            dataObj.value = bankCardInfoData.value
        } else {
            const bankCardInfo = JSON.parse(localStorage.getItem('bankCardInfo') as string)
            if (bankCardInfo) {
                dataObj.value = bankCardInfo
            }
        }

        // 获取缓存中的数据
        watch(() => dataObj.value, () => {
            if (!bankCardInfoData.value) {
                localStorage.setItem('bankCardInfo', JSON.stringify(dataObj.value))
            }
        }, { deep: true })

        watch(() => bankCardInfoData.value, () => {
            dataObj.value = bankCardInfoData.value

            // 如果是对私账户就展示部分组件，对公就隐藏
            if (+bankCardInfoData.value.acntType === 2) {
                showCom.value = true
            } else {
                showCom.value = false
            }
        })

        function handleDownloadAuth() {
            location.href = 'http://xbzj-devh.oss-cn-chengdu.aliyuncs.com/2022/5/24/1653384225542_授权说明书.doc'
        }

        function downloadTable() {
            location.href = 'https://open.fuioupay.com/downLoad.do?fileId=36c81f4d-dbfb-4c2e-89fb-c5bbe6ec8c1a'
        }

        const showCom = ref<boolean>(false) //是否展示相关组件
        onMounted(() => {
            if (+flag.value === 1) {
                const acntType = JSON.parse(localStorage.getItem('basicInfo') as string)?.acntType  // 入账卡类型
                if (+acntType === 2) {
                    showCom.value = true
                } else {
                    showCom.value = false
                }

                bus.$on('changeAcntType', res => {
                    if (+res === 2) {
                        showCom.value = true
                    } else {
                        showCom.value = false
                    }
                })
            }
        })

        onUnmounted(() => {
            bus.$off('changeAcntType')
        })

        // 上传/移除图片
        const handleImg = (res: string, name: string): void => {
            dataObj.value[name] = res;
        }

        return {
            regionData,
            selectBankList,
            dataObj,
            selectedBank,
            selectSubBankList,
            selectBankName,
            flag,
            handleDownloadAuth,
            downloadTable,
            bankCardInfoRef,
            bankCardInfoRules,
            showCom,
            handleImg
        }
    }
})
</script>
<style lang='scss'>
.bank-card-box {
    >h4 {
        margin-bottom: 30px;
    }

    ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        >li {
            display: flex;
            align-items: center;
            margin-right: 260px;
            // width: 50%;
        }
    }

    .el-form-item__content {
        width: 200px;
    }
}
</style>