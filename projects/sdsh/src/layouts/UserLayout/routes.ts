import { RoutesDataItem } from "@/utils/routes";

const UserLayoutRoutes: Array<RoutesDataItem> = [
    {
        title: '登录',
        path: 'login',
        component: () => import('@/views/login/index.vue'),
    },
    {
        title: 'user-layout.menu.register',
        path: 'register',
        component: () => import('@/views/register/index.vue'),
    }
];

export default UserLayoutRoutes;
