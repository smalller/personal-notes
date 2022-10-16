<template>
    <div class="cover-img-box">
        <div class="upload-box">
            <div class="upload-area">
                <div class="not-upload" @click="uploadImg" v-if="!coverImgUrl">
                    <span>{{ title }}</span>
                </div>
                <div v-else class="upload-complete">
                    <img class="show-img" :src="coverImgUrl" />
                    <span class="mask">
                        <el-icon @click="handlePictureCardPreview">
                            <ZoomIn />
                        </el-icon>
                        <el-icon v-if="!readonly" @click="handleRemove">
                            <Delete />
                        </el-icon>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="coverImgUrl" />
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed, watch, onUnmounted } from 'vue'
import { Delete, ZoomIn } from '@element-plus/icons-vue'
import { uploadFile } from '@/common/api'
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: '',
    props: {
        title: {
            type: String as PropType<string>,
            default: () => '点击上传'
        },
        img: {
            type: String as PropType<string>,
        },
        readonly: {
            type: Boolean as PropType<boolean>,
            default: () => false
        }
    },
    components: {
        Delete,
        ZoomIn
    },
    setup(props, { emit }) {
        const coverImgUrl = ref("" as string);
        const dialogVisible = ref(false);
        const img = computed(() => props.img as string)

        if (img.value) {
            coverImgUrl.value = img.value;
        }

        watch(() => img.value, () => {
            coverImgUrl.value = img.value
        })

        onUnmounted(() => {
            coverImgUrl.value = '';
        })

        // 移除
        const handleRemove = () => {
            emit('removeImg', '')
            coverImgUrl.value = '';
        }

        // 预览
        const handlePictureCardPreview = () => {
            dialogVisible.value = true
        }

        // 选择图片并上传
        function uploadImg(e: Event): void {
            const input = document.createElement("input");
            input.type = "file";
            input.onchange = async () => {
                if (input.files) {
                    const file = input.files[0];
                    const isJPG = file.type === "image/jpeg";
                    // const isPNG = file.type === "image/png";
                    const isLt4M = file.size / 1024 / 1024 <= 1;

                    if (!isJPG) {
                        ElMessage.error('请上传jpg类型')
                        return
                    }

                    if (!isLt4M) {
                        ElMessage.error('上传文件大小不能超过1M')
                        return
                    }

                    const { code, data } = await uploadFile(file);
                    try {
                        if (+code === 1000) {
                            coverImgUrl.value = data[0].imageUrl
                            emit('uploadImg', coverImgUrl.value)
                        } else {
                            ElMessage.error('上传失败')
                            coverImgUrl.value = '';
                        }
                    } catch (error) {
                        ElMessage.error('上传失败')
                        coverImgUrl.value = '';
                    }
                }
            };
            input.click();
        }

        return {
            coverImgUrl,
            uploadImg,
            handleRemove,
            handlePictureCardPreview,
            dialogVisible
        }
    }
})
</script>
<style lang='scss' scoped>
.cover-img-box {
    display: flex;
    align-items: center;

    .upload-box {
        .upload-area {
            width: 210px;
            height: 120px;
            margin-bottom: 10px;
            cursor: pointer;

            .show-img {
                width: 210px;
                height: 120px;
            }

            .not-upload {
                border: 1px dashed #d9d9d9;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 14px;
                background: #fafafa;
            }
        }
    }

    .upload-complete {
        position: relative;

        .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.4);

            .el-icon {
                width: 40px;
                text-align: center;
                cursor: pointer;
            }
        }

        &:hover .mask {
            opacity: 1;
        }
    }
}
</style>