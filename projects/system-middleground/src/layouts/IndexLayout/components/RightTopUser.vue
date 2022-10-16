<template>
    <el-dropdown @command="onMenuClick">
        <a class="indexlayout-top-usermenu ant-dropdown-link" @click="e => e.preventDefault()">
            {{ currentUser.userName }}
            <icon-svg type="arrow-down"></icon-svg>
        </a>
        <template #dropdown>
            <el-dropdown-menu>
                <!-- <el-dropdown-item command="userinfo">个人信息</el-dropdown-item> -->
                <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { StateType as UserStateType, CurrentUser } from "@/store/user";
import IconSvg from "@/components/IconSvg";
interface RightTopUserSetupData {
    currentUser: ComputedRef<CurrentUser>;
    onMenuClick: (event: any) => Promise<void>;
}
export default defineComponent({
    name: 'RightTopUser',
    components: {
        IconSvg
    },
    setup(): RightTopUserSetupData {
        const store = useStore<{ user: UserStateType }>();
        const router = useRouter();

        // 获取当前登录用户信息
        const currentUser = computed<CurrentUser>(() => store.state.user.currentUser);

        // 点击菜单
        const onMenuClick = async (command: string) => {
            if (command === 'logout') {
                const res: boolean = await store.dispatch('user/logout');
                if (res === true) {
                    router.replace({
                        path: '/user/login',
                        // query: {
                        //     redirect: router.currentRoute.value.path,
                        //     ...router.currentRoute.value.query
                        // }
                    })
                }
            }
        }

        return {
            currentUser,
            onMenuClick
        }
    }
})
</script>