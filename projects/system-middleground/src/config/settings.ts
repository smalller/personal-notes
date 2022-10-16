import { RoutesDataItem } from "@/utils/routes";

/**
 * 站点配置
 * @author LiQingSong
 */
export interface SettingsType {
    /**
     * 站点名称
     */
    siteTitle: string;

    /**
     * 顶部菜单开启
     */
    topNavEnable: boolean;

    /**
     * 头部固定开启
     */
    headFixed: boolean;

    /**
     * tab菜单开启
     */
    tabNavEnable: boolean;

    /**
    * 站点首页路由
    */
    homeRouteItem: RoutesDataItem;

    /**
     * 站点本地存储Token 的 Key值
     */
    siteTokenKey: string;

    /**
     * Ajax请求头发送Token 的 Key值
     */
    ajaxHeadersTokenKey: string;

    /**
     * Ajax返回值不参加统一验证的api地址
     */
    ajaxResponseNoVerifyUrl: string[];

    /**
     * iconfont.cn 项目在线生成的 js 地址
     */
    iconfontUrl: string[];
}

const homeRouteItem = {
    icon: 'control',
    title: '商户列表',
    path: '/merchantManage/merchantList',
    component: () => import('@/views/merchantManage/merchantList/index.vue')
}

const settings: SettingsType = {
    siteTitle: '系统中台',
    topNavEnable: false,
    headFixed: true,
    tabNavEnable: false,
    homeRouteItem,
    siteTokenKey: '',
    ajaxHeadersTokenKey: 'token',
    ajaxResponseNoVerifyUrl: [
        '/user/login', // 用户登录
        '/user/info', // 获取用户信息
    ],
    iconfontUrl: [],
};

export default settings;
