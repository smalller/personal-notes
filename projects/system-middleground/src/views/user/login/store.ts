import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { setToken } from '@/utils/localToken';
import { accountLogin } from './service';
import { LoginParamsType } from "./data.d";
import md5 from 'js-md5'

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
    loginStatus?: 'ok' | 'error';
    currentUser: CurrentUser
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        changeLoginStatus: Mutation<StateType>;
        saveCurrentUser: Mutation<StateType>;
    };
    actions: {
        login: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    loginStatus: undefined,
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
}

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'userlogin',
    state: {
        ...initState
    },
    mutations: {
        changeLoginStatus(state, payload) {
            state.loginStatus = payload;
        },
        saveCurrentUser(state, payload) {
            state.currentUser = {
                ...initState.currentUser,
                ...payload,
            }
        },
    },
    actions: {
        async login({ commit }, payload: LoginParamsType) {
            let status = '';
            try {
                let reqData = JSON.parse(JSON.stringify(payload))
                reqData.password = md5(reqData.password)
                const response: ResponseData = await accountLogin(reqData);
                const { data } = response;
                commit('saveCurrentUser', data)
                setToken(data.token || '');
                status = 'ok';
            } catch (error) {
                status = 'error';
            }
            commit('changeLoginStatus', status);
            if (status === 'ok') {
                return true;
            } else if (status === 'error') {
                return false;
            }
        }
    }
}

export default StoreModel;