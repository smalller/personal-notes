/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { getRouterList } from '@/api/router'
import { convertRouter, filterRoutes } from '@/utils/routes'
import { rolesControl } from '@/config'
// 首页
let indexPage = {
  children: [
    {
      path: 'index',
      name: 'Index',
      component: '/cms/views/index',
      meta: { title: '首页', remixIcon: 'home-4-line' },
    },
  ],
  component: 'Layout',
  meta: { title: '首页', remixIcon: 'home-4-line' },
  name: '/',
  path: '/',
  pid: '0',
  redirect: '/index',
}
const state = { routes: [], partialRoutes: [] }
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = routes
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes
  },
}
const actions = {
  /**
   * @description 多模式设置路由(默认前端路由,未使用模式可删除相应代码即可)
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit }, mode = 'intelligence') {
    // 默认前端路由
    let routes = [...asyncRoutes]
    let control = rolesControl
    // 设置游客路由
    if (mode === 'visit') control = false
    // 设置后端路由
    if (mode === 'all') {
      let res = await getRouterList()
      let data = res.data.menuList
      // 登录之后indexPage.component变成对象，导致退出登录后无法重新登录，故使用let声明indexPage
      indexPage.component = 'Layout'
      // console.log(indexPage, 888)
      data.unshift(indexPage)
      if (data[data.length - 1].path !== '*')
        data.push({ path: '*', redirect: '/404', hidden: true })
      routes = convertRouter(data)
    }
    // console.log(routes, 78789)
    const accessRoutes = filterRoutes([...constantRoutes, ...routes], control)
    // console.log(accessRoutes)
    commit('setRoutes', accessRoutes)
    // 根据可访问路由重置Vue Router
    await resetRouter(accessRoutes)
    return Promise.resolve()
  },
  /**
   * @description 画廊布局、综合布局设置路由
   * @param {*} { commit }
   * @param accessedRoutes 画廊布局、综合布局设置路由
   */
  setPartialRoutes({ commit }, accessedRoutes) {
    commit('setPartialRoutes', accessedRoutes)
  },
}
export default { state, getters, mutations, actions }
