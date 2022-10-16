import { createVNode, render } from "vue";
import type { App } from "vue";
// const files = require.context("./components" + "", true, /\.js$/);
const files = require.context("./" + "", true, /\.ts$/);
const components = files.keys().filter((item) => item.indexOf("index.ts") > -1);

// console.log(createVNode, render);
// const pages: any = {};
// components.forEach((component) => {
//   if (files(component).default) {
//     const key: string = component.split("/")[1];
//     console.log(key);
//     console.log(files(component).default);
//     pages[key] = function (options: any) {
//       const vm = createVNode(files(component).default, options);
//       console.log(vm);
//     };
//   }
// });

// 指令列表
const directiveList: Array<string> = ["loading"];

const serverList: Array<string> = ["message"];

export default {
  install: (app: App) => {
    components.forEach((component) => {
      if (files(component).default) {
        const key: string = component.split("/")[1];
        const name: string = files(component).default?.name || "ui-" + key;
        if (directiveList.indexOf(key) > -1) {
          console.log(name);
          app.directive(name, files(component).default);
        } else if (serverList.indexOf(key) > -1) {
          const value = files(component).default.value;
          app.config.globalProperties[`$${files(component).default.name}`] =
            value;
        } else {
          app.component(name, files(component).default);
        }
      }
    });
  },
};
