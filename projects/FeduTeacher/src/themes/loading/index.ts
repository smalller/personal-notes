import Loading from "./loading.vue";
import type { VNode } from "vue";
import { createVNode, render } from "vue";
const vm: VNode<any> = createVNode(Loading);
const parent: HTMLDivElement = document.createElement("div");
render(vm, parent);
// vm.el.style.cssText = "position:relative;";
const toggleLoading = (el: any, binding: any): void => {
  if (binding.value) {
    const loading = vm.el.cloneNode(true);
    el.style.position = "relative";
    el.appendChild(loading);
  } else {
    const loading = el.querySelector(".ui-loading-wrap");
    el.style.position = "static";
    if (loading) {
      el.removeChild(loading);
    }
  }
};

export default {
  name: "loadings",
  updated(el: HTMLElement, binding: any) {
    if (binding.value !== binding.oldValue) {
      toggleLoading(el, binding);
    }
  },
  mounted(el: HTMLElement, binding: any) {
    if (binding.value) {
      toggleLoading(el, binding);
    }
  },
};
