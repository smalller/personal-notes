<template>
    <div class="upload-box">
        <div class="upload-item" v-for="(item, index) in uploadNum" :key="item">
            <uploadImg @uploadImg="uploadImgRes(index, $event)" @removeImg="removeImg(index, $event)"></uploadImg>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import uploadImg from './uploadImg.vue'

export default defineComponent({
    components: {
        uploadImg
    },
    props: {
        maxLen: {
            type: String as PropType<string>
        }
    },
    setup(props, { emit }) {
        const uploadNum = ref<number[]>([0])
        const uoloadArr = ref<string[]>([])
        const maxLen = computed(() => props.maxLen as string)

        const uploadImgRes = (index: number, res: string): void => {
            uoloadArr.value.push(res)
            emit('batchUploadComplete', uoloadArr.value)

            if (uploadNum.value.length >= +maxLen.value) {
                return
            }

            uploadNum.value.push(uploadNum.value[uploadNum.value.length - 1] + 1)   //增加上传框
        }

        const removeImg = (index: number, res: string): void => {
            const i = uoloadArr.value.indexOf(res)
            if (i !== -1) {
                uoloadArr.value.splice(i, 1)    //删除对应的地址
                uploadNum.value.splice(index, 1)    //删除对应的上传框
                emit('batchUploadComplete', uoloadArr.value)
            }

            if (uoloadArr.value.length === +maxLen.value - 1) {
                uploadNum.value.push(uploadNum.value[uploadNum.value.length - 1] + 1)   //增加上传框
            }
        }

        return {
            uploadNum,
            uploadImgRes,
            removeImg
        }
    }
})
</script>
<style lang='scss' scoped>
.upload-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .upload-item {
        margin-right: 10px;
    }
}
</style>