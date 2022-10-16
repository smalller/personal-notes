import { Menu } from "@/base/interface";

const mutations = {
  setMenu(state: any, menu: Menu[]): void {
    state.menu = menu;
  },
};

export default mutations;
