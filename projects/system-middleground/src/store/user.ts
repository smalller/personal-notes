import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { removeToken, getToken } from "@/utils/localToken";

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
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    saveCurrentUser: Mutation<StateType>;
    saveMessage: Mutation<StateType>;
  };
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
}

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState
  },
  mutations: {
    saveCurrentUser(state, payload) {
      state.currentUser = {
        ...initState.currentUser,
        ...payload,
      }
    },
    saveMessage(state, payload) {
      state.message = payload;
    }
  },
  actions: {
    async fetchCurrent({ commit }) {
      try {
        const vuex = JSON.parse(localStorage.getItem('vuex') as string)
        if (vuex) {
          commit('saveCurrentUser', vuex.userlogin.currentUser || {});
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    async fetchMessage({ commit }) {
      try {
        // const response: ResponseData = await queryMessage();
        // const { data } = response;
        // commit('saveMessage', data || 0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout({ commit }) {
      try {
        await removeToken();
        commit('saveCurrentUser', { ...initState.currentUser });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}



export default StoreModel;
