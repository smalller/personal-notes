import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import {
} from './service';


const initState = {
    tableData: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
    updateData: {},
};

const StoreModel = {
    namespaced: true,
    name: 'ListSearchTable',
    state: {
        ...initState
    },
    mutations: {
    },
    actions: {
    }
};

export default StoreModel;
