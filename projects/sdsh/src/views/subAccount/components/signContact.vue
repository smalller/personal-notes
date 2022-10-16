<template>
    <el-dialog v-model="show" title="分账">
        <h3 style="margin-bottom:10px">确认分账账户的分账最大比例</h3>
        <el-table :data="tableList" border style="width: 100%" width="60%">
            <el-table-column prop="insNameCn" label="入账主体名称" />
            <el-table-column prop="isIndividualMchntStr" label="入账主体类型" />
            <el-table-column prop="outAcntNm" label="户名" />
            <el-table-column prop="outAcntNo" label="银行账号" />
            <el-table-column label="最大分账比例（万分比）">
                <template #default="{ row }">
                    <el-input maxlength="4" v-model="row.allocateScale" placeholder="0-9999整数">
                    </el-input>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin:20px 0">
            <h4 style="margin-bottom:10px">备注说明：</h4>
            <p class="ps">1.分账比例超过10%需要让BD发内部邮件（wll@fltdedu.net）给风控申请，说明超过10%分账比例的缘由，抄送张华俊、钱晓东总。</p>
            <p class="ps">2.同一时间，只能提交一次签约</p>
        </div>
        <h3 style="margin:20px 0">上传分账协议确认函</h3>
        <div class="matter">
            <p>●业务背景说明必须是分账双方之间的真实业务合同,可以证明分账交易的真实性;(富友不约束此份材料的形式)
                分账方或者入账方必须有一方是企业类的，必须有一方加盖公章</p>
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
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleSubmit">提交签约审核</el-button>
                <el-button @click="handleClose">取消</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="elecContractDialog" title="签约协议" width="60%" :before-close="handleCloseEle">
        <iframe :src="signUrl" frameborder="0" width="100%" height="600px"></iframe>
        <div class="elec-contract-box">
            <h4 style="margin-bottom:10px">注意事项</h4>
            <p>
                1. 企业/公司商户开通分账功能（不区分对私结算还是对公结算），系统自动往商户对公账户打款验证，协议签署接口回填打款金额签约（有效期一天）
            </p>
            <p>
                2. 非企业/公司商户，开通分账功能，往结算账户银行预留手机发送短信授权码，协议签署接口回填授权码签约（有效期5分钟）
            </p>
            <p>
                3. 输错三次验证码，该协议失效，需重新提交签约
            </p>
        </div>
        <div class="botom-box">
            <el-input style="width:200px;margin-right:10px" v-model="verifyAmt" placeholder="打款金额（分）"></el-input>
            <el-input style="width:200px;margin-right:10px" v-model="verifyNo" placeholder="授权码"></el-input>
            <el-button type="success" :loading="loading" @click="sureElecContract">
                同意
                <span v-if="loading">（{{ timeNum }}S）</span>
            </el-button>
        </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" width="60%">
        <img w-full :src="coverImgUrl" />
    </el-dialog>
</template>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { separateSubmit, uploadFile, signContract, existSeparateSubmit } from '../api'

export default defineComponent({
    name: '',
    setup() {
        const tableList = ref<any[]>([])
        const show = ref<boolean>(false)
        const showSign = ref<boolean>(false)
        const elecContractDialog = ref<boolean>(false)
        const contractNo = ref<string>('')
        const signUrl = ref<string>('') // 协议内容

        const handleOpen = (row: any): void => {
            row.forEach(item => item.allocateScale = '10')
            tableList.value = row
            show.value = true
        };

        const handleClose = (): void => {
            loading.value = false
            timeNum.value = 5
            clearInterval(timer)
            show.value = false
        }


        // 提交签约按钮
        async function handleSubmit() {
            getExistSeparateSubmit()
        }

        const timeNum = ref<number>(5)
        const loading = ref<boolean>(true)
        let timer = null as any

        // 查询是否存在签约
        async function getExistSeparateSubmit() {
            const { code, data } = await existSeparateSubmit()
            if (+code === 1000) {
                signUrl.value = data.url
                contractNo.value = data.contractNo
                elecContractDialog.value = true
                loading.value = true
                timer = setInterval(() => {
                    if (timeNum.value <= 1) {
                        initLoading()
                        return
                    }
                    timeNum.value--
                }, 1000)
            } else {
                checkInfo()
            }
        }

        // 初始化loading
        function initLoading() {
            loading.value = false
            timeNum.value = 5
            clearInterval(timer)
        }

        const handleCloseEle = (done: () => void): void => {
            initLoading()
            elecContractDialog.value = false
            done()
        }

        // 验证信息
        function checkInfo() {
            let flag = true // 验证正确与否

            const arr = tableList.value?.map(item => {
                return {
                    accountIn: item.accountIn,
                    allocateScale: item.allocateScale
                }
            })

            // 验证输入框是否正确
            for (let i = 0; i < arr?.length; i++) {
                if (!/^[0-9]+([0-9]*){0,9999}$/.test(arr[i]?.allocateScale)) {
                    flag = false
                    break
                }
            }

            if (!flag) {
                ElMessage.error('请输入正确的最大分账比例（0-9999整数）')
                return
            }

            sureUpload(arr)
        }

        // 上传图片接口
        async function sureUpload(arr) {
            if (fileList.value.length === 0) {
                ElMessage.error('请先上传分账协议确认函')
                return
            }
            const { code } = await uploadFile(fileList.value)
            if (+code === 1000) {
                handleSeparateSubmit(arr)
            }
        }


        // 提交签约审核接口
        async function handleSeparateSubmit(arr) {
            const { code, data } = await separateSubmit(arr)
            if (+code === 1000) {
                signUrl.value = data.signUrl
                contractNo.value = data.contractNo
                elecContractDialog.value = true
            }
        }

        const verifyNo = ref<string>('')
        const verifyAmt = ref<string>('')
        // 同意签署
        async function sureElecContract() {
            const { code } = await signContract({
                contractNo: contractNo.value,
                verifyNo: verifyNo.value,
                verifyAmt: verifyAmt.value
            })
            if (+code === 1000) {
                ElMessage.success('签署成功')
                elecContractDialog.value = false
                show.value = false
            }
        }

        const fileList = ref<any>([])
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
                        ElMessage.error('请上传正确的文件类型')
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

        const dialogVisible = ref(false);
        const coverImgUrl = ref("" as string);
        // 预览
        function handlePreview(res: File | string) {
            if (typeof res === 'string') {
                coverImgUrl.value = res
            } else {
                coverImgUrl.value = URL.createObjectURL(res)
            }
            dialogVisible.value = true
        }

        return {
            show,
            handleOpen,
            handleClose,
            handleSubmit,
            tableList,
            showSign,
            elecContractDialog,
            sureElecContract,
            uploadImg,
            fileList,
            handlePreview,
            coverImgUrl,
            handleRemove,
            dialogVisible,
            signUrl,
            verifyNo,
            loading,
            verifyAmt,
            timeNum,
            handleCloseEle
        }
    }
})
</script>
<style lang='scss' scoped>
.ps {
    color: #f00;
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

.botom-box {
    margin-top: 12px;
    text-align: right;
    display: flex;
}

.elec-contract-box {
    margin: 20px 0;

    >p {
        color: #f00;
    }
}
</style>