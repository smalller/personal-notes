<template>
    <el-card shadow="never" style="overflow:auto">
        <div class="mer-upload-img-box">
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
            <div style="text-align:right">
                <el-button type="primary" @click="sureUpload">确认上传</el-button>
            </div>
        </div>
    </el-card>
    <el-dialog v-model="dialogVisible" width="60%">
        <img w-full :src="coverImgUrl" />
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { ElMessage } from 'element-plus';
import { uploadFile } from './api'
import { uploadListen } from './static'

export default defineComponent({
    name: '',
    setup() {
        const coverImgUrl = ref("" as string);
        const fileList = ref<any>([])
        const dialogVisible = ref(false);

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

        // 确认上传
        async function sureUpload() {
            if (fileList.value.length === 0) {
                ElMessage.error('请先选择文件')
                return
            }
            const { code, data } = await uploadFile(fileList.value)
            if (+code === 1000) {
                console.log(data);
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
            sureUpload,
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