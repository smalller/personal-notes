<template>
    <el-drawer v-model="drawer" title="钱包收款明细" custom-class="drawer-box">
        <el-form model class="filter-box" label-position="right">
            <el-form-item label="操作时间：">
                <el-date-picker
                    unlink-panels
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="类型：">
                <el-select placeholder="全部">
                    <!-- <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>-->
                </el-select>
            </el-form-item>
            <el-form-item label="账户：">
                <el-select placeholder="全部">
                    <!-- <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>-->
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success">导出Excel</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="[]" border style="width: 100%">
            <el-table-column prop="mcName" label="操作日期" />
            <el-table-column prop="detailAddress" label="类型" />
            <el-table-column prop="contactsName" label="金额" />
            <el-table-column prop="contactsPhone" label="账户" />
            <el-table-column prop="createTime" label="状态" />
            <el-table-column prop="chargeRate" label="备注" />
            <el-table-column label="操作">
                <!-- <template #default="{ row }">
                    <el-button type="text">详情</el-button>
                </template>-->
            </el-table-column>
        </el-table>
        <!-- <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            :total="totalNum"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
        />-->
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
    name: '',
    setup() {
        const drawer = ref<boolean>(false);

        // 关闭抽屉回调
        const handleClose = (): void => {
            drawer.value = false;
        };

        // 打开抽屉
        const handleOpen = (res: any): void => {
            drawer.value = true;
        };

        return {
            drawer,
            handleClose,
            handleOpen
        }
    }
})
</script>
<style lang='scss' scoped>
.filter-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-form-item {
        margin-right: 20px;
    }
}
</style>