import { RoutesDataItem } from "@/utils/routes";

const UserLayoutRoutes: Array<RoutesDataItem> = [
    {
        title: '登录',
        path: 'login',
        component: () => import('@/views/user/login/index.vue'),
    }
];

export default UserLayoutRoutes;