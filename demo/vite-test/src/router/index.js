import { createRouter, createWebHashHistory, } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'demo1',
        component: () => import("@/views/demo1.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
