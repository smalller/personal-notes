const mutations = {
  activeRouteChange(state: any, route: string): void {
    state.activeRouter = route;
  },
  activeRouterChildChange(state: any, route: string): void {
    state.activeRouterChild = route;
  },
  changeIsDrawer(state: any, status: boolean): void {
    state.isDrawer = status;
  },
  changeDrawer(state: any, status: boolean): void {
    state.drawer = status;
  },
};

export default mutations;
