<template>
    <el-drawer v-model="drawer" title="通知详情" custom-class="drawer-box" :before-close="handleClose"
        :destroy-on-close="true">
        <el-form model class="filter-box" label-position="right" label-width="120px">
            <el-form-item label="通知标题：">
                <el-input v-model="dataObj.title" clearable placeholder="通知标题" />
            </el-form-item>
            <div class="send-obj">
                <div class="title">发送对象：</div>
                <div class="right-box">
                    <div>
                        <el-radio v-model="dataObj.msgType" label="1">按年级</el-radio>
                        <el-radio v-model="dataObj.msgType" label="2">按班级</el-radio>
                    </div>
                    <div v-show="+dataObj.msgType === 1">
                        <el-select v-model="selectGradeArr" multiple placeholder="选择年级">
                            <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName"
                                :value="item.gradeId" />
                        </el-select>
                    </div>
                    <div v-show="+dataObj.msgType === 2">
                        <el-select v-model="selectClassArr" placeholder="选择班级" multiple>
                            <el-option-group v-for="group in classList" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-option-group>
                        </el-select>
                    </div>
                    <div style="margin-top: 18px;">
                        <el-checkbox v-model="dataObj.isCc" true-label="1" false-label="0" label="抄送给带班老师" />
                    </div>
                </div>
            </div>
            <el-form-item label="通知内容：">
                <el-input v-model="dataObj.content" type="textarea" rows="10" clearable placeholder="通知内容" />
            </el-form-item>
            <div class="send-obj">
                <div class="title">图片文件：</div>
                <div class="right-box" v-if="flag === 1">
                    <batchUploadImg @batchUploadComplete="batchUploadComplete" maxLen="6"></batchUploadImg>
                    <p>最多6张,仅支持png/jpg格式</p>
                </div>
                <div v-else>
                    <template v-for="(item, index) in srcList" :key="index">
                        <el-image style="width: 210px; height: 120px;margin-right: 12px;" :src="item"
                            :preview-src-list="srcList" :initial-index="index" fit="cover" />
                    </template>
                </div>
            </div>
        </el-form>
        <div class="botom-btn-box">
            <el-button type="primary" @click="handleSave" v-if="flag === 1">提交</el-button>
            <el-button @click="handleClose">取消</el-button>
        </div>
    </el-drawer>

</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { merchantGradeList, merchantClassList, insertNotice, selectNotice } from '../api'
import batchUploadImg from '@/components/common/batchUploadImg.vue'
import { ElMessage } from 'element-plus';

export interface Setup {
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: (index: number, res?: number) => void;
    dataObj: Ref<any>;
    gradeList: Ref<any>
    classList: Ref<any>
    selectGradeArr: Ref<any>
    selectClassArr: Ref<any>
    handleSave: () => Promise<void>
    batchUploadComplete: (res: string[]) => void
    flag: Ref<number>
    srcList: Ref<string[]>
}
export default defineComponent({
    name: '',
    components: {
        batchUploadImg
    },
    setup(props, { emit }): Setup {
        const drawer = ref<boolean>(false);
        const dataObj = ref<any>({
            title: '',
            msgType: '1',
            relationIds: '',
            isCc: '0',
            content: '',
            image: ''
        })
        const gradeList = ref<any>([])
        const classList = ref<any>([])
        const selectGradeArr = ref<any>([])
        const selectClassArr = ref<any>([])
        const flag = ref<number>(-1)
        const srcList = ref<string[]>([])

        const initData = (): void => {
            dataObj.value.title = '';
            dataObj.value.msgType = '1'
            dataObj.value.relationIds = ''
            dataObj.value.isCc = '0'
            dataObj.value.content = ''
            dataObj.value.image = ''
            selectGradeArr.value = []
            selectClassArr.value = []
            classList.value = []
            drawer.value = false;
        }

        // 关闭抽屉回调
        const handleClose = (): void => {
            initData()
        };

        // 打开抽屉
        const handleOpen = (index: number, res?: number): void => {
            getMerchantGradeList()
            getMerchantClassList()
            flag.value = index
            if (flag.value === 2) {
                handleSelectNotice(res as number)
            }
            drawer.value = true;
        };


        // 获取公告详情
        const handleSelectNotice = async (id: number): Promise<void> => {
            const { code, data } = await selectNotice(id);
            if (+code === 1000) {
                dataObj.value = data;
                if (dataObj.value.relationIds) {
                    if (+dataObj.value.msgType === 1) {
                        selectGradeArr.value = Array.from(dataObj.value.relationIds.split(','), i => Number(i))
                    } else {
                        selectClassArr.value = Array.from(dataObj.value.relationIds.split(','), i => Number(i))
                    }
                }
                if (dataObj.value.image) {
                    srcList.value = dataObj.value.image.split(',')
                }
            }
        }

        // 获取年级列表
        const getMerchantGradeList = async (): Promise<void> => {
            const { code, data } = await merchantGradeList();
            if (+code === 1000) {
                gradeList.value = data;
            }
        }

        // 获取班级列表
        const getMerchantClassList = async (): Promise<void> => {
            const { code, data } = await merchantClassList();
            if (+code === 1000) {
                tranClassListCon(data.list)
            }
        }

        // 将返回的班级列表格式转换成组件所需要的格式
        const tranClassListCon = (data: any[]) => {
            let gradeArr = [] as any;
            for (let i = 0; i < data.length; i++) {
                if (!gradeArr.includes(data[i].gradeName)) {
                    gradeArr.push(data[i].gradeName)
                }
            }

            for (let i = 0; i < gradeArr.length; i++) {
                const obj = {
                    label: gradeArr[i],
                    options: []
                }
                classList.value.push(obj)
            }

            for (let i = 0; i < classList.value.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (classList.value[i].label === data[j].gradeName) {
                        const obj = {
                            value: data[j].id,
                            label: data[j].className
                        }
                        classList.value[i].options.push(obj)
                    }
                }
            }
        }

        const handleSave = async (): Promise<void> => {
            let relationIds = '', image = '';
            if (+dataObj.value.msgType === 1) {
                relationIds = selectGradeArr.value.join(',')
            } else {
                relationIds = selectClassArr.value.join(',')
            }

            if (dataObj.value.image) {
                image = dataObj.value.image.join(',')
            }

            const data = {
                ...dataObj.value,
                relationIds,
                image
            }

            const { code } = await insertNotice(data)
            if (+code === 1000) {
                emit('addNoticeComplete')
                ElMessage.success('新增成功')
                initData()
            }
        }

        const batchUploadComplete = (res: string[]): void => {
            console.log(123123, res);
            dataObj.value.image = res;
        }

        return {
            drawer,
            handleClose,
            handleOpen,
            dataObj,
            gradeList,
            selectGradeArr,
            handleSave,
            classList,
            selectClassArr,
            batchUploadComplete,
            flag,
            srcList
        }
    }
})
</script>
<style lang='scss' scoped>
.el-form-item__content {
    .el-input {
        width: 300px;
    }
}

.send-obj {
    display: flex;
    margin-bottom: 18px;

    .title {
        min-width: 120px;
        font-size: 14px;
        padding-right: 12px;
        padding-top: 7px;
        box-sizing: border-box;
        text-align: right;
    }
}

.botom-btn-box {
    text-align: right;
    margin-top: 20px;
}
</style>