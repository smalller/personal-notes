<template>
    <el-card shadow="never" style="overflow:auto">
        <div class="mer-basic-info-box">
            <h4>基本信息</h4>
            <el-form ref="basicInfoRef" :model="dataObj" :rules="basicInfoRules" label-width="180px">
                <ul>
                    <li>
                        <el-form-item label="商户名称：" prop="mName">
                            <el-input maxlength="50" v-model="dataObj.mName" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="商户简称：" prop="mchntShortname">
                            <el-input maxlength="20" v-model="dataObj.mchntShortname" :readonly="+flag === 2">
                            </el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="联系人：" prop="contactName">
                            <el-input maxlength="10" v-model="dataObj.contactName" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="手机：" prop="contactPhone">
                            <el-input maxlength="15" v-model="dataObj.contactPhone" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="客服电话：" prop="contactMobile">
                            <el-input maxlength="11" v-model="dataObj.contactMobile" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="登录账号：" prop="mAccount">
                            <el-input maxlength="50" v-model="dataObj.mAccount" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="+flag === 1">
                        <el-form-item label="登录密码：" prop="mPassword">
                            <el-input maxlength="50" v-model="dataObj.mPassword" type="password" show-password
                                :readonly="+flag === 2" />
                        </el-form-item>
                    </li>
                    <li v-if="+flag === 2">
                        <el-form-item label="收费扣率：" prop="chargeRate">
                            <el-select :disabled="!isCheckRate" v-model="dataObj.chargeRate" filterable
                                placeholder="收费扣率">
                                <el-option v-for="item in chargeRateList" :key="item.id" :label="item.desc"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li v-if="+flag === 2">
                        <el-form-item label="补贴扣率：" prop="subsidyRate">
                            <el-input :readonly="!isCheckRate" type="number" v-model="dataObj.subsidyRate">
                                <template #append>%</template>
                            </el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="证件类型：" prop="licenseType">
                            <el-select :disabled="+flag === 2" v-model="dataObj.licenseType" filterable
                                placeholder="证件类型">
                                <el-option v-for="item in licenseTypeList" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="商户经营地联系地址：" prop="contactAddr">
                            <el-input maxlength="50" v-model="dataObj.contactAddr" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="联系邮箱：" prop="contactEmail">
                            <el-input maxlength="60" v-model="dataObj.contactEmail" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="经营范围代码：" prop="business">
                            <template v-if="+flag === 1">
                                <el-cascader :options="PnavigationList" :props="businessProps" @change="handleChange" />
                            </template>
                            <template v-else>{{ dataObj.business }}</template>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="商户经营地市代码：" prop="cityCd">
                            <template v-if="+flag === 1">
                                <el-select :disabled="+flag === 2" @change="handleSelectCity" v-model="dataObj.cityCd"
                                    filterable placeholder="商户经营地市代码">
                                    <el-option v-for="item in cityCdList" :key="item.cityCode" :label="item.cityName"
                                        :value="item.cityCode">
                                    </el-option>
                                </el-select>
                            </template>
                            <template v-else>{{ dataObj.cityCd }}</template>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="商户经营地区县代码：" prop="countyCd">
                            <template v-if="+flag === 1">
                                <el-select :disabled="+flag === 2" v-model="dataObj.countyCd" filterable
                                    placeholder="商户经营地区县代码">
                                    <el-option v-for="(item, index) in areaLists" :key="index" :label="item.areaName"
                                        :value="item.areaCode"></el-option>
                                </el-select>
                            </template>
                            <template v-else>{{ dataObj.countyCd }}</template>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="清算类型：" prop="settleTp">
                            <el-select :disabled="+flag === 2" v-model="dataObj.settleTp" filterable placeholder="清算类型">
                                <el-option v-for="item in settleTpList" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item maxlength="15" label="法人姓名：" prop="artifNm">
                            <el-input v-model="dataObj.artifNm" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="法人入账标识：" prop="acntArtifFlag">
                            <el-select :disabled="+flag === 2" v-model="dataObj.acntArtifFlag" filterable
                                placeholder="法人入账标识">
                                <el-option v-for="item in acntArtifFlagList" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li v-if="+dataObj.acntType === 2">
                        <el-form-item label="入账证件到期日期：" prop="acntCertifExpireDt">
                            <el-date-picker :readonly="+flag === 2" v-model="dataObj.acntCertifExpireDt" type="date"
                                placeholder="入账证件到期日期" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账证件类型：" prop="acntCertifTp">
                            <el-radio v-model="dataObj.acntCertifTp" label="0">身份证</el-radio>
                        </el-form-item>
                    </li>
                    <li v-if="+dataObj.acntType === 2">
                        <el-form-item label="入账卡证件号：" prop="acntCertifId">
                            <el-input v-model="dataObj.acntCertifId" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账卡类型：" prop="acntType">
                            <template v-if="+flag === 1">
                                <el-radio @change="changeAcntType" v-model="dataObj.acntType" label="1">对公</el-radio>
                                <el-radio @change="changeAcntType" v-model="dataObj.acntType" label="2">对私</el-radio>
                            </template>
                            <template v-else>{{ +dataObj.acntType === 1 ? '对公' : +dataObj.acntType === 2 ? '对私' : '无'
                            }}</template>
                        </el-form-item>
                    </li>
                    <li v-if="+dataObj.acntType === 2">
                        <el-form-item label="入账卡户名：" prop="acntNm">
                            <el-input v-model="dataObj.acntNm" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="+dataObj.settleTp === 3 || +dataObj.settleTp === 4">
                        <el-form-item label="清算类型扣率套餐代码：" prop="settleTpCd">
                            <template v-if="+flag === 1">
                                <el-select :disabled="+flag === 2" v-model="dataObj.settleTpCd" filterable
                                    placeholder="清算类型扣率套餐代码">
                                    <el-option v-for="item in chargeRateList" :key="item.id" :label="item.desc"
                                        :value="item.name"></el-option>
                                </el-select>
                            </template>
                            <template v-else>{{ dataObj.settleTpCd }}</template>
                        </el-form-item>
                    </li>
                </ul>
            </el-form>
        </div>
    </el-card>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed, watch, reactive, onMounted } from 'vue'
import { licenseTypeList, settleTpList, acntArtifFlagList } from '@/views/merchantManage/merchantList/static'
import { PNavigationList, navigationList, productSystem, cityList, areaList, chargeRate } from '@/views/merchantManage/merchantList/api'
import { basicInfoRules } from './static'
import bus from '@/utils/bus'

export default defineComponent({
    name: '',
    props: {
        // 1-新增，2-修改/回显
        flag: {
            type: String as PropType<any>
        },
        basicInfoData: {
            type: Object as PropType<Object>
        },
        isCheckRate: {
            type: Object as PropType<Boolean>,
            default: () => false
        }
    },
    setup(props) {
        const basicInfoRef = ref<unknown>(null)
        const dataObj = ref<any>({
            mName: '',
            contactName: '',
            contactPhone: '',
            contactMobile: '',
            mAccount: '',
            mPassword: '',
            chargeRate: '',
            subsidyRate: '',
            mchntShortname: '',
            licenseType: '',
            contactAddr: '',
            contactEmail: '',
            business: '',
            cityCd: '',
            countyCd: '',
            settleTp: '',
            artifNm: '',
            acntArtifFlag: '',
            acntCertifExpireDt: '',
            acntCertifTp: '0',
            acntType: '1',
            acntNm: '',
            acntCertifId: '',
            settleTpCd: ''
        })

        const businessList = ref<any>([])
        const cityCdList = ref<any>([])
        const areaLists = ref<any>([])
        const chargeRateList = ref<any>([])
        const basicInfoData = computed(() => props.basicInfoData)

        if (basicInfoData.value) {
            dataObj.value = basicInfoData.value
        } else {
            const basicInfo = JSON.parse(localStorage.getItem('basicInfo') as string)
            if (basicInfo) {
                dataObj.value = basicInfo
                dataObj.value.business = ''
                dataObj.value.cityCd = ''
                dataObj.value.countyCd = ''
            }
        }

        watch(() => dataObj.value, () => {
            if (!basicInfoData.value) {
                localStorage.setItem('basicInfo', JSON.stringify(dataObj.value))
            }
        }, { deep: true })

        watch(() => basicInfoData.value, () => {
            dataObj.value = basicInfoData.value
        })

        const PnavigationList = ref<any[]>([{}])

        const businessProps = {
            lazy: true,
            lazyLoad: (node, resolve) => {
                if (node.data.value && node.level === 1) {
                    getNavigationList(node.data.value, resolve)
                }
                if (node.data.value && node.level === 2) {
                    getProductSystem(node.data.value, resolve)
                }
            }
        }


        // 父导航名称
        const getPNavigationList = async (): Promise<void> => {
            const { code, data } = await PNavigationList()
            if (+code === 1000) {
                let newData = [] as any
                data.forEach(item => {
                    const obj = {
                        value: item.pNavigation,
                        label: item.pNavigation,
                    }
                    newData.push(obj)
                })
                PnavigationList.value = newData;
            }
        }
        getPNavigationList()
        // 导航名称
        const getNavigationList = async (res: any, resolve: any): Promise<void> => {
            const { code, data } = await navigationList(res)
            if (+code === 1000) {
                let newData = [] as any
                data.forEach(item => {
                    const obj = {
                        value: item.navigation,
                        label: item.navigation,
                    }
                    newData.push(obj)
                })
                resolve(newData)
            }
        }
        // 品类名称
        const getProductSystem = async (res: any, resolve: any): Promise<void> => {
            const { code, data } = await productSystem(res)
            if (+code === 1000) {
                let newData = [] as any
                data.forEach(item => {
                    const obj = {
                        value: item.id,
                        label: item.productSystem,
                        leaf: true,
                    }
                    newData.push(obj)
                })
                resolve(newData)
            }
        }
        const handleChange = (value: any): void => {
            dataObj.value.business = value[2]
        }

        const getCityList = async (): Promise<void> => {
            const { code, data } = await cityList()
            if (+code === 1000) {
                cityCdList.value = data;
            }
        }
        getCityList()


        const getAreaList = async (name?: string): Promise<void> => {
            const { code, data } = await areaList(name)
            if (+code === 1000) {
                dataObj.value.countyCd = ''
                areaLists.value = data;
            }
        }

        const handleSelectCity = (code: string): void => {
            const res = cityCdList.value.filter(item => item.cityCode === code)
            getAreaList(res[0].cityName)
        }

        function changeAcntType(res: string) {
            bus.$emit('changeAcntType', res)
        }

        async function getChargeRateList() {
            const { code, data } = await chargeRate()
            if (+code === 1000) {
                chargeRateList.value = data
            }
        }
        getChargeRateList()

        return {
            dataObj,
            licenseTypeList,
            settleTpList,
            acntArtifFlagList,
            businessList,
            handleChange,
            businessProps,
            cityCdList,
            handleSelectCity,
            areaLists,
            PnavigationList,
            basicInfoRules,
            basicInfoRef,
            changeAcntType,
            chargeRateList
        }
    }
})
</script>
<style lang='scss'>
.mer-basic-info-box {
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