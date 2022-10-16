<template>
    <result status="404" title="404" subtitle="对不起，您访问的页面不存在。">
        <template #extra>
            <router-link to="/">
                <el-button type="primary">返回首页</el-button>
            </router-link>
        </template>
    </result>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Result from '@/components/Result/index.vue';
export default defineComponent({
    name: 'NotFound',
    components: {
        Result
    }
})
</script>