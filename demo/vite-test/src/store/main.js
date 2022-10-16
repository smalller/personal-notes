import { defineStore } from 'pinia'
import { userStore } from './user'

export const mainStore = defineStore('main', {
    state: () => {
        return {
            msg: 'hello',
            count: 1
        }
    },
    getters: {
        getState(state) {
            console.log('getState被调用了');
            return `${state.msg} + ${this.count}`
        },
        getUserState() {
            return userStore().name
        }
    },
    actions: {
        changeState() {
            this.count++
            this.msg = this.msg === 'hello' ? 'hello world' : 'hello'
        }
    },

    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'mainStore', // 修改存在缓存中的key值
                storage: localStorage,    // 修改存储方式为localStorage
                paths: ['msg'] // 部分数据持久化
            }
        ]
    }
})