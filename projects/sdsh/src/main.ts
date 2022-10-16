import { createApp } from 'vue';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// 引入 ElementUI
import ElementPlus from 'element-plus';

// 导入 svg
import { importAllSvg } from "@/components/IconSvg/index";
importAllSvg();

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store);
app.use(router)
app.use(ElementPlus, { size: 'default'});
app.use(i18n);
app.mount('#app');
