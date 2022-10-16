<template>
    <el-drawer v-model="drawer" :title="title" custom-class="drawer-box">
        <ul class="mer-all-info-box">
            <li>
                <bankCardInfo></bankCardInfo>
            </li>
            <li>
                <idCardInfo></idCardInfo>
            </li>
            <li class="botom-btn-box">
                <el-button type="success">保存</el-button>
                <el-button>取消</el-button>
            </li>
        </ul>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue'
import bankCardInfo from '@/components/closeAccountCenter/bankCardInfo.vue'

export interface Setup {
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: (any) => void;
}

export default defineComponent({
    name: '',
    props: {
        title: {
            type: String as PropType<string>
        },
        // 1-新增，2-修改
        flag: {
            type: String as PropType<string>
        }
    },
    components: {
        bankCardInfo,
    },
    setup(): Setup {
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
.mer-all-info-box {
    > li {
        margin-bottom: 20px;
        &.botom-btn-box {
            text-align: right;
        }
        > h4 {
            margin-bottom: 20px;
        }
    }
}
</style>