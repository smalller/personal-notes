import { createStore } from "vuex";
import nav from "./nav";
import user from "./user";
import commonData from "./commonData";
import system from "./system";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  plugins: [createPersistedState()],
  modules: {
    nav,
    user,
    commonData,
    system,
  },
});
