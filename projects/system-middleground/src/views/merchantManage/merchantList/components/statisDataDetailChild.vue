<template>
    <el-dialog v-model="dialogVisible" title="收费详情">
        <ul>
            <li>
                <span class="label-title">项目名称：</span>
                <span>{{ dataObj.projectName }}</span>
            </li>
            <li v-if="dataObj.merchantProjectItemVos" class="merchant-code">
                <span>金额选项设置：</span>
                <div>
                    <el-table :data="dataObj.merchantProjectItemVos" border style="width: 100%">
                        <el-table-column prop="itemName" label="收费项目名称" />
                        <el-table-column prop="chargeType" label="收费方式" />
                        <el-table-column prop="chargeMoney" label="收费金额" />
                        <el-table-column prop="required" label="是否必交" />
                    </el-table>
                </div>
            </li>
            <li>
                <span class="label-title">状态：</span>
                <span>{{ dataObj.status }}</span>
            </li>
            <li>
                <span class="label-title">二维码生效时间：</span>
                <span>{{ dateTranFn(dataObj.beginTime) }}</span>
                -
                <span>{{ dateTranFn(dataObj.endTime) }}</span>
            </li>
            <li v-if="dataObj.merchantCodeChargeRegisterVo" class="merchant-code">
                <span>支付前需登记信息：</span>
                <div>
                    <el-table :data="dataObj.merchantCodeChargeRegisterVo" border style="width: 100%">
                        <el-table-column prop="registerName" label="登记名称" />
                        <el-table-column prop="remark" label="填写说明" />
                        <el-table-column prop="userFillInType" label="用户填写方式" />
                    </el-table>
                </div>
            </li>
            <li>
                <span class="label-title">收费说明：</span>
                <span>{{ dataObj.remark }}</span>
            </li>
            <li>
                <span class="label-title">说明文件：</span>
                <span>{{ dataObj.attachmentUrl }}</span>
            </li>
            <li>
                <span class="label-title">发布人：</span>
                <span>{{ dataObj.userName }}</span>
            </li>
        </ul>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { seDetail } from '../api'
import micell from 'micell'

export interface Setup {
    dialogVisible: Ref<boolean>;
    handleOpen: (number, string) => void;
    dataObj: Ref<any>;
    micell: any;
    dateTranFn: (string) => string;
}

export default defineComponent({
    name: '',
    setup(props): Setup {
        const dialogVisible = ref<boolean>(false);
        const dataObj = ref<any>({});

        const handleOpen = (res): void => {
            const { mccId } = res;
            const data = {
                mccId
            }
            getSeDetail(data)
            dialogVisible.value = true;
        };

        const getSeDetail = async (res: any): Promise<void> => {
            const { code, data } = await seDetail(res);
            if (+code === 1000) {
                dataObj.value = data;
            }
        }

        function dateTranFn(timestamp: number): string {
            return micell.date.format(new Date(timestamp), "YYYY-MM-DD")
        }

        return {
            dialogVisible,
            handleOpen,
            dataObj,
            micell,
            dateTranFn
        }

    }
})
</script>
<style lang='scss' scoped>
ul {
    .label-title {
        display: inline-block;
        width: 150px;
        text-align: left;
        margin-bottom: 20px;
    }
}

.merchant-code {
    margin-bottom: 20px;
}
</style>