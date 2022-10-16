import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "./icon";

createApp(App)
  .use(router)
  .use(store)
  .use(ElementPlus)
  .mount("#app");
