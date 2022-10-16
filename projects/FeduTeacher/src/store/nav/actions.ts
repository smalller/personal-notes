type Func = (name: string, route: string | boolean) => void;
interface Context {
  commit: Func;
}
const actions = {
  activeRouteChange(context: Context, route: string): void {
    context.commit("activeRouteChange", route);
  },
  activeRouterChildChange(context: Context, route: string): void {
    context.commit("activeRouterChildChange", route);
  },
  changeIsDrawer(context: Context, status: boolean): void {
    context.commit("changeIsDrawer", status);
  },
  changeDrawer(context: Context, status: boolean): void {
    context.commit("changeDrawer", status);
  },
};

export default actions;
