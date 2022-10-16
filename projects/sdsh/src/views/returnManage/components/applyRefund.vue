<template>
    <el-drawer v-model="drawer" title="退款详情" custom-class="drawer-box" :before-close="handleClose">
        <el-form model class="filter-box" label-position="right" label-width="120px">
            <el-form-item label="交易时间：">
                <span>{{ dataObj.payTime }}</span>
            </el-form-item>
            <el-form-item label="交易订单号：">
                <span>{{ dataObj.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="项目名称：">
                <span>{{ dataObj.projectName }}</span>
            </el-form-item>
            <el-form-item label="收费项：">
                <div>
                    <div v-for="(item, index) in dataObj.nameProjectItemDtos" :key="index">
                        {{ item.itemName }} - {{ item.money }}元
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="交费状态：">
                <span>{{ dataObj.payStatusStr }}</span>
            </el-form-item>
            <el-form-item label="支付方式：">
                <span>{{ dataObj.payTypeStr }}</span>
            </el-form-item>
            <template v-if="flag === 1">
                <el-form-item label="退款方式：">
                    <el-select placeholder="请选择" v-model="reqObj.refundType">
                        <el-option v-for="item in refundTypeList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="退款方式：">
                    <span>{{ dataObj.refundTypeStr }}</span>
                </el-form-item>
            </template>
            <template v-if="flag === 1">
                <el-form-item label="退款金额：">
                    <el-radio v-model="reqObj.refundDesc" :label="1">全额退款</el-radio>
                    <el-radio v-model="reqObj.refundDesc" :label="2">部分退款</el-radio>
                    <el-input v-show="+reqObj.refundDesc === 2" v-model="reqObj.refundMoney" placeholder="退款金额" />
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="退款描述：">
                    <span>{{ +dataObj.refundDesc === 1 ? '全额退款' : '部分退款' }}</span>
                </el-form-item>
                <el-form-item label="退款金额：">
                    <span>{{ dataObj.refundMoney }}</span>
                </el-form-item>
            </template>
            <template v-if="flag === 1">
                <el-form-item label="退款说明：">
                    <el-checkbox-group v-model="reqObj.refundReason">
                        <el-checkbox v-for="(item, index) in checkboxList" :key="index" :label="item" />
                    </el-checkbox-group>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="退款说明：">
                    <span>{{ dataObj.refundReason }}</span>
                </el-form-item>
            </template>
        </el-form>
        <div class="botom-btn-box">
            <el-button type="primary" @click="handleRefund" v-if="flag === 1">提交</el-button>
            <el-button @click="initData">取消</el-button>
        </div>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, PropType, reactive } from 'vue'
import { refundTypeList } from '../refundManage/static'
import { KeyValue } from '@/common/types'
import { insertRefund } from '../refundManage/api'
import { ElMessage } from 'element-plus'
import bus from '@/utils/bus'
import { selectRefundDetail } from '../refundDetail/api'
import { selectOrderById } from '@/common/api'

export interface Setup {
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: (res: any, index: number) => void;
    dataObj: Ref<any>;
    reqObj: Ref<any>;
    refundTypeList: KeyValue[];
    checkboxList: string[];
    handleRefund: () => Promise<void>;
    initData: () => void;
    flag: Ref<number>
}
export default defineComponent({
    name: '',
    setup(props, { emit }): Setup {
        const drawer = ref<boolean>(false);
        const checkboxList = reactive<string[]>(['错交、误交费用', '重复交费', '已交现金', '多交费用', '其他原因'])
        const dataObj = ref<any>({});
        const reqObj = ref<any>({
            refundDesc: 1,
            refundType: 1,
            refundMoney: '',
            refundReason: []
        })
        const flag = ref<number>(-1);   // 1-申请退款，2-退款详情

        const initData = (): void => {
            reqObj.value.refundDesc = 1;
            reqObj.value.refundType = 1;
            reqObj.value.refundMoney = '';
            reqObj.value.refundReason = []
            drawer.value = false;
        }

        // 关闭抽屉回调
        const handleClose = (): void => {
            initData()
        };

        // 打开抽屉
        const handleOpen = (res: any, index: number): void => {
            flag.value = index;
            if (flag.value === 1) {
                handleSelectOrderById(res)
            } else {
                handleSelectRefundDetail(res.id)
            }
            drawer.value = true;
        };


        // 查询申请退款详情页
        const handleSelectOrderById = async (id: number): Promise<void> => {
            const { code, data } = await selectOrderById(id);
            if (+code === 1000) {
                dataObj.value = data;
            }
        }

        // 查看退款详情
        const handleSelectRefundDetail = async (id: number): Promise<void> => {
            const { code, data } = await selectRefundDetail(id);
            if (+code === 1000) {
                dataObj.value = data;
            }
        }

        // 计算金额总和
        function getMoneySum() {
            let num = 0
            dataObj.value?.nameProjectItemDtos?.map(item => {
                num += Number(item.money);
            })
            return num.toFixed(2)
        }

        const handleRefund = async (): Promise<void> => {
            if (+reqObj.value.refundDesc === 1) {
                reqObj.value.refundMoney = dataObj.value.totalMoney;
            } else {
                if (+reqObj.value.refundMoney > dataObj.value.totalMoney) {
                    ElMessage.error('部分退款金额不能大于交费金额')
                    return
                }
            }

            let refundReason = reqObj.value.refundReason;
            refundReason = refundReason.join(';')

            const data = {
                mchntOrder: dataObj.value.orderNumber,
                orderDetailId: dataObj.value.id,
                ...reqObj.value,
                refundReason,
                total_amt: getMoneySum()
            }
            const { code } = await insertRefund(data);
            if (+code === 1000) {
                bus.$emit('updateComplete')
                ElMessage.success('申请退款成功')
                initData()
            }
        }

        return {
            drawer,
            handleClose,
            handleOpen,
            dataObj,
            reqObj,
            refundTypeList,
            checkboxList,
            handleRefund,
            initData,
            flag
        }
    }
})
</script>
<style lang='scss' scoped>
.el-form-item__content {
    display: flex;
    align-items: center;

    .el-input {
        width: 200px;
    }
}

.botom-btn-box {
    text-align: right;
    margin-top: 20px;
}
</style>
