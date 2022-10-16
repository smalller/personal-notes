import { Mutation, Action } from "vuex";
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from "@/utils/request";
import { queryCurrent, queryMessage } from "@/services/user";
import { removeToken } from "@/utils/localToken";
import { RoutesDataItem } from "@/utils/routes";

export interface CurrentUser {
  account: string;
  id: number;
  interfaceList: string[];
  lastLoginTime: number;
  loginUser: string;
  resourceList: Array<any>;
  roles: Array<any>;
  seleted: number;
  status: string;
  token: string;
  userName: string
}

export interface StateType {
  currentUser: CurrentUser;
  message: number;
  routes: RoutesDataItem[];
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    saveCurrentUser: Mutation<StateType>;
    saveMessage: Mutation<StateType>;
    saveRoutes: Mutation<StateType>;
  };
  getters: {
    currentUser: (state: StateType) => CurrentUser;
    routes: (state: StateType) => RoutesDataItem[];
  },
  actions: {
    fetchCurrent: Action<StateType, StateType>;
    fetchMessage: Action<StateType, StateType>;
    logout: Action<StateType, StateType>;
  };
}

const initState: StateType = {
  currentUser: {
    account: '',
    id: 0,
    interfaceList: [],
    lastLoginTime: -1,
    loginUser: '',
    resourceList: [],
    roles: [],
    seleted: -1,
    status: '',
    token: '',
    userName: ''
  },
  message: 0,
  routes: [],
};

const StoreModel: ModuleType = {
  namespaced: true,
  name: "user",
  state: {
    ...initState,
  },
  getters: {
    currentUser: state => state.currentUser,
    routes: state => state.routes,
  },
  mutations: {
    saveCurrentUser(state, payload) {
      state.currentUser = {
        ...initState.currentUser,
        ...payload,
      };
    },
    saveMessage(state, payload) {
      state.message = payload;
    },
    saveRoutes(state, payload) {
      state.routes = payload;
    },
  },
  actions: {
    async fetchCurrent({ commit }) {
      try {
        // const response: ResponseData = await queryCurrent();
        // const { data } = response;
        if (sessionStorage.getItem("userData")) {
          const data = JSON.parse(sessionStorage.getItem("userData") as string);
          // data.roles = data.roles;
          commit("saveRoutes", data.resourceList || []);
          commit("saveCurrentUser", data || {});
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    async fetchMessage({ commit }) {
      try {
        const response: ResponseData = await queryMessage();
        const { data } = response;
        commit("saveMessage", data || 0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout({ commit }) {
      try {
        await removeToken();
        console.log(removeToken);

        // commit("saveCurrentUser", { ...initState.currentUser });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

export default StoreModel;
