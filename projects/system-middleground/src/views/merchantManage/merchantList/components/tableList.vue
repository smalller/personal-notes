<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="mName" label="商户名称" />
        <el-table-column prop="detailAddress" label="商户地址" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactPhone" label="手机" />
        <el-table-column label="注册时间">
            <template #default="{ row }">
                <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="chargeRate" label="收费扣率" />
        <el-table-column prop="totalBalance" label="收入总额" />
        <!-- <el-table-column prop="outBalance" label="提现总额" /> -->
        <el-table-column prop="proceduresBalance" label="手续费总额" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">详情</el-button>
                <el-button type="text" @click="setting(row)">设置</el-button>
            </template>
        </el-table-column>
    </el-table>
    <merchantDetail ref="merchantDetailCom"></merchantDetail>
    <merchantSetting ref="merchantSettingCom" title="商户信息" flag="1"></merchantSetting>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'
import merchantDetail, { Setup as MerSetup } from './merchantDetail.vue'
import merchantSetting, { Setup as MerSettingSetup } from '../../components/merchantSetting.vue'
import dayjs from 'dayjs';

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (TableListItem) => void;
    merchantDetailCom: Ref<unknown>;
    merchantSettingCom: Ref<unknown>;
    setting: (TableListItem) => void;
    dayjs: any
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
        merchantDetail,
        merchantSetting
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const merchantDetailCom = ref<unknown>(null)
        const merchantSettingCom = ref<unknown>(null)


        function viewDetail(row: TableListItem): void {
            (merchantDetailCom.value as MerSetup).handleOpen(row);
        }

        const setting = (row: TableListItem): void => {
            (merchantSettingCom.value as MerSettingSetup).handleOpen(row)
        }

        return {
            tableList,
            viewDetail,
            merchantDetailCom,
            merchantSettingCom,
            setting,
            dayjs
        }

    }
})
</script>
<style lang='scss' scoped>
</style>