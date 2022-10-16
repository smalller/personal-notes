<template>
    <el-card shadow="never" style="overflow:auto">
        <div class="id-card-info-box">
            <h4>证件信息</h4>
            <el-form ref="idCardInfoRef" :model="dataObj" :rules="idCardInfoRules" label-width="164px">
                <ul>
                    <li>
                        <el-form-item label="身份证正面：" prop="idcardFrontImg">
                            <uploadImg :readonly="+flag === 2" title="上传身份证正面"
                                @uploadImg="handleImg($event, 'idcardFrontImg')"
                                @removeImg="handleImg($event, 'idcardFrontImg')" :img="dataObj.idcardFrontImg">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="身份证反面：" prop="idcardBackImg">
                            <uploadImg :readonly="+flag === 2" title="上传身份证反面"
                                @uploadImg="handleImg($event, 'idcardBackImg')"
                                @removeImg="handleImg($event, 'idcardBackImg')" :img="dataObj.idcardBackImg">
                            </uploadImg>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="证件号：" prop="idcardNumber">
                            <el-input :readonly="+flag === 2" v-model="dataObj.idcardNumber"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="姓名：" prop="certifName">
                            <el-input :readonly="+flag === 2" v-model="dataObj.certifName"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="法人身份证号：" prop="certifId">
                            <el-input :readonly="+flag === 2" v-model="dataObj.certifId"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="法人身份证开始日期：" prop="cardStartDt">
                            <el-date-picker :readonly="+flag === 2" v-model="dataObj.cardStartDt" type="date"
                                placeholder="法人身份证开始日期" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="法人身份证到期日期：" prop="certifIdExpireDt">
                            <el-date-picker :readonly="+flag === 2" v-model="dataObj.certifIdExpireDt" type="date"
                                placeholder="法人身份证到期日期" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="营业执照名称：" prop="businessName">
                            <el-input :readonly="+flag === 2" v-model="dataObj.businessName"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="营业执照类型：" prop="businessType">
                            <el-select :disabled="+flag === 2" v-model="dataObj.businessType" filterable
                                placeholder="证件类型">
                                <el-option v-for="item in licenseTypeList" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="营业执照编码：" prop="businessCode">
                            <el-input maxlength="20" :readonly="+flag === 2" v-model="dataObj.businessCode"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="营业执照开始日期：" prop="licenseStartDt">
                            <el-date-picker :readonly="+flag === 2" v-model="dataObj.licenseStartDt" type="date"
                                placeholder="营业执照开始日期：" />
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="营业执照到期日期：" prop="licenseExpireDt">
                            <el-date-picker :readonly="+flag === 2" v-model="dataObj.licenseExpireDt" type="date"
                                placeholder="营业执照到期日期" />
                            <span style="line-height:20px">注：长期请选择2099-12-31，无有效期请选择1900-01-01</span>
                        </el-form-item>
                    </li>
                    <li>
                        <el-form-item label="营业执照注册地址：" prop="licRegisAddr">
                            <el-input maxlength="50" :readonly="+flag === 2" v-model="dataObj.licRegisAddr"></el-input>
                        </el-form-item>
                    </li>
                </ul>
            </el-form>
        </div>
    </el-card>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed, watch } from 'vue'
import uploadImg from '@/components/common/uploadImg.vue'
import { licenseTypeList, idCardInfoRules } from './static'

export default defineComponent({
    name: '',
    props: {
        // 1-新增，2-修改/回显
        flag: {
            type: String as PropType<string>
        },
        idCardInfoData: {
            type: Object as PropType<Object>
        }
    },
    components: {
        uploadImg
    },
    setup(props) {
        const idCardInfoRef = ref<unknown>(null)
        const dataObj = ref<any>({
            idcardNumber: '',
            certifName: '',
            businessName: '',
            businessType: '',
            businessCode: '',
            idcardFrontImg: '',
            idcardBackImg: '',
            licenseExpireDt: '',
            certifIdExpireDt: '',
            certifId: '',
            cardStartDt: '',
            licenseStartDt: '',
            licRegisAddr: ''
        })

        const flag = computed(() => props.flag as string);
        const idCardInfoData = computed(() => props.idCardInfoData) // 外界传进来的值

        if (idCardInfoData.value) {
            dataObj.value = idCardInfoData.value
        } else {
            const idCardInfo = JSON.parse(localStorage.getItem('mer-idCardInfo') as string)
            if (idCardInfo) {
                dataObj.value = idCardInfo
            }
        }

        // 将输入的内容添加到缓存
        watch(() => dataObj.value, () => {
            if (!idCardInfoData.value) {
                localStorage.setItem('mer-idCardInfo', JSON.stringify(dataObj.value))
            }
        }, { deep: true })


        watch(() => idCardInfoData.value, () => {
            dataObj.value = idCardInfoData.value
        })

        // 上传/移除图片
        const handleImg = (res: string, name: string): void => {
            dataObj.value[name] = res;
        }


        return {
            dataObj,
            licenseTypeList,
            // eslint-disable-next-line vue/no-dupe-keys
            flag,
            idCardInfoRules,
            idCardInfoRef,
            handleImg
        }
    }
})
</script>
<style lang='scss'>
.id-card-info-box {
    >h4 {
        margin-bottom: 30px;
    }

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