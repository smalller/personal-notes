import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/themes";
import UI from "@/themes";
import "element-plus/lib/theme-chalk/index.css";
import ElementPlus from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "dayjs/locale/zh-cn";
import "./mock/index";

const app = createApp(App)
  // .use(ElementPlus, { locale })
  .use(UI)
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount("#app");
export { app };

// require('es6-promise').polyfill();
// require('es6-promise/auto');