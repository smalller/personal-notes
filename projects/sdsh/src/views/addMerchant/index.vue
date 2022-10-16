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
        <li>
            <el-card shadow="never" style="overflow:auto">
                <div>
                    <h4>上传图片</h4>
                    <div>
                        <el-table :data="uploadListen" border style="width: 100%;margin:20px 0">
                            <el-table-column prop="imgType" label="图片类型" />
                            <el-table-column prop="remark" label="备注" />
                            <el-table-column prop="cnName" label="中文命名" />
                        </el-table>
                        <a target="_blank"
                            href="http://fundwx.fuiou.com/doc/#/scanentry/api?id=_49-%e5%95%86%e6%88%b7%e5%9b%be%e7%89%87%e4%b8%8a%e4%bc%a0">文件上传要求</a>
                    </div>
                    <div class="matter">
                        <p>注意事项</p>
                        <p style="color:#f00">●文件名必须与图中文命名（包括扩展名）一致</p>
                        <p>●文件类型目前仅支持.jpg</p>
                        <p>●单个文件大小不超过1M</p>
                    </div>
                    <div>
                        <el-button type="primary" @click="uploadImg">选择文件</el-button>
                    </div>
                    <ul class="img-list">
                        <li v-for="(item, index) in fileList" :key="index" @click="handlePreview(item)">
                            <span>{{ item.name }}</span>
                            <el-icon @click="handleRemove(index, $event)">
                                <Close />
                            </el-icon>
                        </li>
                    </ul>
                </div>
            </el-card>
        </li>
        <li class="botom-btn-box">
            <el-button type="success" @click="handleSave">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
        </li>
    </ul>
    <el-dialog v-model="dialogVisible" width="60%">
        <img w-full :src="coverImgUrl" />
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'
import uploadMerImg from '@/components/merchant/uploadMerImg.vue'
import { addMerchant, currentMerchant } from './api'
import { ElMessage } from 'element-plus'
import micell from 'micell'
import { uploadFile } from './api'
import { uploadListen } from './static'

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
    uploadListen: any
    fileList: File[]
    uploadImg: () => void
    handleRemove: (index: number, e: Event) => void
    dialogVisible: Ref<boolean>
    handlePreview: (res: File) => void
    coverImgUrl: Ref<string>
}

export default defineComponent({
    components: {
        bankCardInfo,
        basicInfo,
        idCardInfo,
    },
    setup(props, { emit }): Setup {
        const basicInfoCom = ref<unknown>(null);
        const idCardInfoCom = ref<unknown>(null);
        const bankCardInfoCom = ref<unknown>(null);

        const basicInfoData = ref<any>(null);
        const idCardInfoData = ref<any>(null);
        const bankCardInfoData = ref<any>(null);

        const merchantData = ref({} as any);

        const coverImgUrl = ref("" as string);
        const fileList = ref<any>([])
        const dialogVisible = ref(false);


        // 关闭/取消
        const handleClose = (): void => {
            basicInfoData.value = [];
            idCardInfoData.value = [];
            bankCardInfoData.value = [];
            localStorage.removeItem('mer-basicInfo')
            localStorage.removeItem('mer-idCardInfo')
            localStorage.removeItem('mer-bankCardInfo')
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

        // 确认上传图片
        async function sureUpload(fileList: File[]) {
            const { code, data } = await uploadFile(fileList)
            if (+code === 1000) {
                if (data.url) {
                    merchantData.value.fyFileUrl = data.url
                } else {
                    merchantData.value.fyFileUrl = ''
                }
                const { code } = await addMerchant({ ...merchantData.value, fyFileUrl: data.url });
                if (+code === 1000) {
                    ElMessage.success('提交成功')
                }
            } else {
                handleAddMerchant()
            }
        }

        // 上传
        function uploadImg() {
            const input = document.createElement("input");
            input.type = "file";
            input.onchange = async () => {
                if (input.files) {
                    const file = input.files[0];
                    const isJPG = file.type === "image/jpeg";
                    const isLt1M = file.size / 1024 / 1024 <= 1;

                    if (!isJPG) {
                        ElMessage.error('请上传jpg类型')
                        return
                    }

                    if (!isLt1M) {
                        ElMessage.error('上传文件大小不能超过1M')
                        return
                    }
                    fileList.value.push(file)
                }
            };
            input.click();
        }

        // 移除
        function handleRemove(index: number, e: Event) {
            e.stopPropagation()
            fileList.value.splice(index, 1)
        }

        // 预览
        function handlePreview(res: File | string) {
            if (typeof res === 'string') {
                coverImgUrl.value = res
            } else {
                coverImgUrl.value = URL.createObjectURL(res)
            }
            dialogVisible.value = true
        }

        const handleSave = (): void => {
            Promise.all([checkBasicInfo(), checkIdCardInfo(), checkBankCardInfo()]).then(res => {
                let newBasicInfo = JSON.parse(JSON.stringify((basicInfoCom.value as any).dataObj))
                let newIdCardInfo = JSON.parse(JSON.stringify((idCardInfoCom.value as any).dataObj))
                let newBankCardInfo = JSON.parse(JSON.stringify((bankCardInfoCom.value as any).dataObj))

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
                    ...newBankCardInfo,
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

        // 提交申请
        async function handleAddMerchant(): Promise<void> {
            if (fileList.value.length !== 0) {
                sureUpload(fileList.value)
                return
            }
            const { code } = await addMerchant(merchantData.value);
            if (+code === 1000) {
                ElMessage.success('提交成功')
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
            fileList,
            uploadImg,
            handleRemove,
            dialogVisible,
            handlePreview,
            coverImgUrl,
            uploadListen
        }
    }
})
</script>
<style lang='scss' scoped>
.mer-all-info-box {
    background-color: #fff;
    padding: 16px;

    h3 {
        margin-bottom: 16px;
    }

    >li {
        margin-bottom: 20px;
    }
}

.matter {
    margin-bottom: 12px;

    h3 {
        margin-bottom: 6px;
    }

    p {
        margin-bottom: 6px;
    }
}

.img-list {
    margin: 20px 0;

    li {
        padding: 6px 12px;
        margin: 6px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:hover {
            background-color: #f5f7fa;
        }
    }
}
</style>