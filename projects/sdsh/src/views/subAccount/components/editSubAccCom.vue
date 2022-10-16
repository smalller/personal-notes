<template>
    <div class="edit-sub-account">
        <el-drawer v-model="drawer" title="分账账户" custom-class="drawer-box">
            <el-form ref="infoRef" :model="dataObj" :rules="infoRules" label-width="192px">
                <ul>
                    <li>
                        <el-form-item label="入账主体类型：" prop="isIndividualMchnt">
                            <template v-if="+flag === 1">
                                <el-radio v-model="dataObj.isIndividualMchnt" label="0">
                                    企业
                                </el-radio>
                                <el-radio v-model="dataObj.isIndividualMchnt" label="8">
                                    个体
                                </el-radio>
                            </template>
                            <template v-else>{{ +dataObj.isIndividualMchnt === 0 ? '企业' : +dataObj.isIndividualMchnt ===
                                    8 ?
                                    '个体' : '无'
                            }}</template>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账方主体名称：" prop="insNameCn">
                            <el-input v-model="dataObj.insNameCn" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="入账账户类型：" prop="settleTp">
                            <template v-if="+flag === 1">
                                <el-radio v-model="dataObj.settleTp" label="01">对公银行账户</el-radio>
                                <el-radio v-model="dataObj.settleTp" label="02">个人银行卡</el-radio>
                            </template>
                            <template v-else>{{ dataObj.settleTp === '01' ? '对公银行账户' : dataObj.settleTp === '02' ?
                                    '个人银行卡' : '无'
                            }}</template>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="到账周期类型：" prop="revenueTp">
                            <el-select :disabled="+flag === 2" v-model="dataObj.revenueTp" placeholder="到账周期类型">
                                <el-option v-for="item in revenueTpList" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="开户行行号：" prop="interBankNo">
                            <el-input v-model="dataObj.interBankNo" :readonly="+flag === 2"></el-input>
                            <a v-if="+flag === 1"
                                href="https://open.fuioupay.com/downLoad.do?fileId=36c81f4d-dbfb-4c2e-89fb-c5bbe6ec8c1a">开户行信息列表</a>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="户名：" prop="outAcntNm">
                            <el-input v-model="dataObj.outAcntNm" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="dataObj.settleTp === '02'">
                        <el-form-item label="身份证号：" prop="outAcntIdNo">
                            <el-input v-model="dataObj.outAcntIdNo" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="银行账号：" prop="outAcntNo">
                            <el-input v-model="dataObj.outAcntNo" :readonly="+flag === 2"></el-input>
                        </el-form-item>
                    </li>
                    <li v-if="dataObj.settleTp === '01' && +flag !== 2">
                        <el-form-item label="开户许可证扫描照片：" prop="khxkjPic">
                            <uploadImg :readonly="+flag === 2" title="上传开户许可证扫描照片"
                                @uploadImg="handleImg($event, 'khxkjPic')" @removeImg="handleImg($event, 'khxkjPic')"
                                :img="dataObj.khxkjPic">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li v-if="dataObj.settleTp === '02' && +flag !== 2">
                        <el-form-item label="银行卡正面扫描照片：" prop="yhkzmPic">
                            <uploadImg :readonly="+flag === 2" title="上传银行卡正面扫描照片"
                                @uploadImg="handleImg($event, 'yhkzmPic')" @removeImg="handleImg($event, 'yhkzmPic')"
                                :img="dataObj.yhkzmPic">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <template v-if="+dataObj.isIndividualMchnt === 0">
                        <li>
                            <el-form-item label="证件类型：" prop="flagTp">
                                <el-select :disabled="+flag === 2" v-model="dataObj.flagTp" placeholder="证件类型">
                                    <el-option v-for="item in flagTpList" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </li>
                        <li v-if="+dataObj.flagTp === 9">
                            <el-form-item label="证件名称：" prop="certifiNm">
                                <el-input v-model="dataObj.certifiNm" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li v-if="+dataObj.flagTp === 3">
                            <el-form-item label="开办资金：" prop="startUpCapital">
                                <el-input type="number" v-model="dataObj.startUpCapital">
                                    <template #append>万元</template>
                                </el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="证件代码：" prop="licNo">
                                <el-input v-model="dataObj.licNo" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="有效期：" prop="licTov">
                                <el-date-picker :readonly="+flag === 2" v-model="dataObj.licTov" type="date"
                                    placeholder="有效期" />
                            </el-form-item>
                        </li>
                        <li v-if="+flag !== 2">
                            <el-form-item label="证件扫描照片：" prop="licPic1">
                                <uploadImg :readonly="+flag === 2" title="上传证件扫描照片"
                                    @uploadImg="handleImg($event, 'licPic1')" @removeImg="handleImg($event, 'licPic1')"
                                    :img="dataObj.licPic1">
                                </uploadImg>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="品牌名称：" prop="platNameCn">
                                <el-input v-model="dataObj.platNameCn" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="电子邮件：" prop="email">
                                <el-input v-model="dataObj.email" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="联系人：" prop="contactPerson">
                                <el-input v-model="dataObj.contactPerson" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="联系手机：" prop="contactMobile">
                                <el-input v-model="dataObj.contactMobile" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li v-if="+dataObj.flagTp === 0">
                            <el-form-item label="组织机构代码证编号：" prop="zzjgdmzNo">
                                <el-input v-model="dataObj.zzjgdmzNo" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li v-if="+dataObj.flagTp === 0">
                            <el-form-item label="有效期到期日期：" prop="zzjgdmzExpireDt">
                                <el-date-picker :readonly="+flag === 2" v-model="dataObj.zzjgdmzExpireDt" type="date"
                                    placeholder="有效期到期日期" />
                            </el-form-item>
                        </li>
                        <li v-if="+dataObj.flagTp === 0 && +flag !== 2">
                            <el-form-item label="组织机构代码证扫描照片：" prop="zzjgdmzPic1">
                                <uploadImg :readonly="+flag === 2" title="上传组织机构代码证扫描照片"
                                    @uploadImg="handleImg($event, 'zzjgdmzPic1')"
                                    @removeImg="handleImg($event, 'zzjgdmzPic1')" :img="dataObj.zzjgdmzPic1">
                                </uploadImg>
                            </el-form-item>
                        </li>
                    </template>
                    <template v-if="+dataObj.isIndividualMchnt === 8">
                        <li>
                            <el-form-item label="法人姓名：" prop="artifNm">
                                <el-input v-model="dataObj.artifNm" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="身份证号：" prop="certifId">
                                <el-input v-model="dataObj.certifId" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="有效期至：" prop="validDt">
                                <el-date-picker :readonly="+flag === 2" v-model="dataObj.validDt" type="date"
                                    placeholder="有效期至" />
                            </el-form-item>
                        </li>
                        <li>
                            <el-form-item label="联系手机：" prop="contactPhone">
                                <el-input v-model="dataObj.contactPhone" :readonly="+flag === 2"></el-input>
                            </el-form-item>
                        </li>
                        <li v-if="+flag !== 2">
                            <el-form-item label="证件扫描照片正面：" prop="certifIdPic1">
                                <uploadImg :readonly="+flag === 2" title="上传证件扫描照片正面"
                                    @uploadImg="handleImg($event, 'certifIdPic1')"
                                    @removeImg="handleImg($event, 'certifIdPic1')" :img="dataObj.certifIdPic1">
                                </uploadImg>
                            </el-form-item>
                        </li>
                        <li v-if="+flag !== 2">
                            <el-form-item label="证件扫描照片反面：" prop="certifIdPic2">
                                <uploadImg :readonly="+flag === 2" title="上传证件扫描照片反面"
                                    @uploadImg="handleImg($event, 'certifIdPic2')"
                                    @removeImg="handleImg($event, 'certifIdPic2')" :img="dataObj.certifIdPic2">
                                </uploadImg>
                            </el-form-item>
                        </li>
                    </template>
                </ul>
            </el-form>
            <div>
                <el-button v-if="+flag === 1" type="primary" @click="handleSubmit">提交</el-button>
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed, watch } from 'vue'
import { infoRules, revenueTpList, flagTpList } from '../static'
import uploadImg from '@/components/common/uploadImg.vue'
import { openFatspAccountIn, funSplitListDetail } from '../api'
import { ElMessage } from 'element-plus'
import micell from 'micell'

export default defineComponent({
    name: '',
    props: {
        basicInfoData: {
            type: Object as PropType<Object>
        }
    },
    components: {
        uploadImg
    },
    setup(props, { emit }) {
        const flag = ref<number>(-1)  // 1-新增，2回显
        const infoRef = ref<unknown>(null)
        const drawer = ref<boolean>(false);
        const dataObj = ref<any>({
            // 公有
            isIndividualMchnt: '0',
            insNameCn: '',
            settleTp: '01',
            revenueTp: '',
            interBankNo: '',
            outAcntNm: '',
            outAcntIdNo: '',
            outAcntNo: '',
            khxkjPic: '',
            yhkzmPic: '',

            // 企业
            flagTp: '',
            certifiNm: '',
            startUpCapital: '',
            licNo: '',
            licTov: '',
            licPic1: '',
            platNameCn: '',
            email: '',
            contactPerson: '',
            contactMobile: '',
            zzjgdmzNo: '',
            zzjgdmzExpireDt: '',
            zzjgdmzPic1: '',

            // 个体
            artifNm: '',
            certifId: '',
            validDt: '',
            contactPhone: '',
            certifIdPic1: '',
            certifIdPic2: ''
        })

        // 写入缓存
        watch(() => dataObj.value, () => {
            if (flag.value === 1) {
                localStorage.setItem('subAccountInfo', JSON.stringify(dataObj.value))
            }
        }, { deep: true })

        // 上传/移除图片
        const handleImg = (res: string, name: string): void => {
            dataObj.value[name] = res;
        }

        // 打开抽屉
        const handleOpen = (index: number, row?: any): void => {
            flag.value = index
            if (index === 2) {
                getFunSplitListDetail(row.id)
            } else {
                // 有缓存就用缓存的数据
                const subAccountInfo = JSON.parse(localStorage.getItem('subAccountInfo') as string)
                if (subAccountInfo) {
                    dataObj.value = subAccountInfo
                }
            }
            drawer.value = true;
        };

        // 审核详情
        async function getFunSplitListDetail(id: number) {
            dataObj.value = {}
            const { code, data } = await funSplitListDetail(id)
            if (+code === 1000) {
                dataObj.value = data
            }
        }

        // 转换时间格式
        const tranDate = (obj): void => {
            const dateList = ['licTov', 'zzjgdmzExpireDt', 'validDt']
            for (let key in obj) {
                if (dateList.includes(key)) {
                    if (obj[key]) {
                        obj[key] = micell.date.format(new Date(obj[key]), "YYYYMMDD")
                    } else {
                        obj[key] = ''
                    }
                }
            }
        }

        // 提交分账
        async function submitOpenFatspAccountIn() {
            const newDataObj = Object.assign({}, dataObj.value)
            tranDate(newDataObj)
            const { code } = await openFatspAccountIn(newDataObj)
            if (+code === 1000) {
                ElMessage.success('提交成功')
                drawer.value = false;
                // localStorage.removeItem('subAccountInfo')
                emit('editComplete')
            }
        }

        // 验证分账
        function handleSubmit() {
            (infoRef.value as any).validate((valid, fields) => {
                console.log(dataObj.value);
                if (valid) {
                    submitOpenFatspAccountIn()
                } else {
                    console.log('验证失败', fields);
                }
            })
        }

        function handleClose() {
            drawer.value = false;
        }

        return {
            drawer,
            handleOpen,
            dataObj,
            infoRules,
            flag,
            revenueTpList,
            flagTpList,
            handleSubmit,
            handleClose,
            infoRef,
            micell,
            handleImg
        }
    }
})
</script>
<style lang='scss'>
.edit-sub-account {
    ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        >li {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            width: 50%;
        }
    }

    .el-form-item__content {
        width: 200px;
    }
}
</style>