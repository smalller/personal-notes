<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="mName" label="商户名称" />
        <el-table-column prop="detailAddress" label="商户地址" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactPhone" label="手机" />
        <el-table-column label="申请时间">
            <template #default="{ row }">
                <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="bankStatusStr" label="审核类型" />
        <el-table-column prop="statusStr" label="状态" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">{{ +row.status === 5 ? row.statusStr : '审核' }}
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <checkDetail ref="checkDetailCom" title="商户审核" flag="2"></checkDetail>
    <el-dialog v-model="elecContractDialog" title="电子协议" width="60%">
        <iframe :src="elecContractInfo.sign_url" frameborder="0" width="100%" height="600px"></iframe>
        <div style="margin-top:12px;text-align: right;">
            <el-button type="success" @click="sureElecContract">同意</el-button>
        </div>
    </el-dialog>
    <el-dialog v-model="uploadDialog" title="上传图片" width="50%">
        <div class="img-box">
            <h3>上传说明</h3>
            <el-table :data="uploadListen" border style="width: 100%;margin:20px 0">
                <el-table-column prop="imgType" label="图片类型" />
                <el-table-column prop="remark" label="备注" />
                <el-table-column prop="cnName" label="中文命名" />
            </el-table>
            <a target="_blank"
                href="http://fundwx.fuiou.com/doc/#/scanentry/api?id=_49-%e5%95%86%e6%88%b7%e5%9b%be%e7%89%87%e4%b8%8a%e4%bc%a0">文件上传要求</a>
        </div>
        <div class="matter">
            <h3>注意事项</h3>
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
        <div style="text-align:right">
            <el-button type="primary" @click="sureUpload">确认上传</el-button>
        </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" width="60%">
        <img w-full :src="coverImgUrl" />
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'
import checkDetail, { Setup as checkDetailSetup } from './checkDetail.vue'
import dayjs from 'dayjs';
import { elecContractGenerate, elecContractSign, uploadFile, attachConfirm } from '../api'
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue'
import { Close } from '@element-plus/icons-vue'
import { uploadListen } from '../static'

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (TableListItem) => void;
    checkDetailCom: Ref<unknown>;
    dayjs: any;
    elecContractDialog: Ref<boolean>;
    sureElecContract: () => Promise<void>
    elecContractInfo: Ref<any>;
    uploadDialog: Ref<boolean>;
    uploadImg: (any) => void
    sureUpload: () => Promise<void>
}

export default defineComponent({
    name: '',
    props: {
        data: {
            type: Array as PropType<TableListItem[]>,
            required: true
        }
    },
    components: {
        checkDetail,
        Upload,
        Close
    },
    setup(props, { emit }) {
        const tableList = computed<TableListItem[]>(() => props.data);
        const checkDetailCom = ref<unknown>(null)
        const elecContractDialog = ref<boolean>(false)
        const elecContractInfo = ref<any>()
        const uploadDialog = ref<boolean>(false)
        const mchntCd = ref<string>('')
        const traceNo = ref<string>('')
        const dialogVisible = ref(false);
        const coverImgUrl = ref("" as string);

        function viewDetail(row: any): void {
            if (+row.status === 5) {
                mchntCd.value = row.mchntCd
                traceNo.value = row.traceNo
                getElecContractGenerate(row.mchntCd, row.traceNo)
            } else {
                (checkDetailCom.value as checkDetailSetup).handleOpen(row);
            }
        }

        // 查看商户签署信息
        async function getElecContractGenerate(mchnt_cd: number, trace_no: number) {
            const { code, data } = await elecContractGenerate({
                mchnt_cd,
                trace_no
            })
            if (+code === 1000) {
                elecContractInfo.value = data;
                if (+data.ret_code === 2008) {
                    uploadDialog.value = true
                    // ElMessage.success(data.ret_msg)
                } else {
                    // ElMessage.error(data.ret_msg)
                    if (data.sign_url) {
                        elecContractDialog.value = true
                    }
                }
            }
        }

        // 同意签署
        async function sureElecContract() {
            const { contract_no, verify_no } = elecContractInfo.value
            const { code } = await elecContractSign({
                contract_no,
                mchnt_cd: mchntCd.value,
                trace_no: traceNo.value,
                verify_no
            })
            if (+code === 1000) {
                ElMessage.success('签署成功')
                elecContractDialog.value = false
                uploadDialog.value = true
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

        // 确认上传
        async function sureUpload() {
            if (fileList.value.length === 0) {
                ElMessage.error('请先选择文件')
                return
            }
            const { code } = await uploadFile(fileList.value, mchntCd.value)
            if (+code === 1000) {
                handleAttachConfirm()
            }
        }

        // 附件提交完成接口
        async function handleAttachConfirm() {
            if (fileList.value.length === 0) {
                ElMessage.error('请先选择文件')
                return
            }
            const { code } = await attachConfirm({
                mchnt_cd: mchntCd.value,
                trace_no: traceNo.value
            })
            if (+code === 1000) {
                emit('attachConfirm')
                uploadDialog.value = false
                ElMessage.success('资料提交完成')
            }
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

        return {
            tableList,
            viewDetail,
            checkDetailCom,
            dayjs,
            elecContractDialog,
            sureElecContract,
            elecContractInfo,
            uploadDialog,
            uploadImg,
            sureUpload,
            fileList,
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

.matter {
    margin-bottom: 12px;

    h3 {
        margin-bottom: 6px;
    }

    p {
        margin-bottom: 6px;
    }
}

.img-box {
    >img {
        width: 100%;
        height: 300px;
        cursor: pointer;
    }
}
</style>