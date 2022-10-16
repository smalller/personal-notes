import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    state: () => {
        return {
            name: '吴同学'
        }
    }
})