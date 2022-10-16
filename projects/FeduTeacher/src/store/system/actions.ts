import { Menu } from "@/base/interface";

type Func = (name: string, menu: Menu[]) => void;
interface Context {
  commit: Func;
}
const actions = {
  setMenu(context: Context, menu: Menu[]): void {
    context.commit("setMenu", menu);
  },
};

export default actions;
