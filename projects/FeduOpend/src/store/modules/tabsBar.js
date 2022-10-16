/**
 * @description tabsBar多标签页逻辑，前期借鉴了很多开源项目发现都有个共同的特点很繁琐并不符合框架设计的初衷，后来在github用户cyea的启发下完成了重构，请勿修改
 */
const state = {
  visitedRoutes: [],
}
const getters = {
  visitedRoutes: (state) => state.visitedRoutes,
}
const mutations = {
  /**
   * @description 添加标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  addVisitedRoute(state, route) {
    let target = state.visitedRoutes.find((item) => item.path === route.path)
    if (target) {
      if (route !== target) Object.assign(target, route)
    } else state.visitedRoutes.push(Object.assign({}, route))
  },
  /**
   * @description 删除当前标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delVisitedRoute(state, path) {
    state.visitedRoutes.forEach((item, index) => {
      if (item.path === path) state.visitedRoutes.splice(index, 1)
    })
  },
  /**
   * @description 删除当前标签页以外其它全部多标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delOthersVisitedRoutes(state, path) {
    state.visitedRoutes = state.visitedRoutes.filter(
      (item) => item.meta.affix || item.path === path
    )
  },
  /**
   * @description 删除当前标签页左边全部多标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delLeftVisitedRoutes(state, path) {
    const idx = state.visitedRoutes.indexOf(
      state.visitedRoutes.find((item) => item.path === path)
    )
    state.visitedRoutes = state.visitedRoutes.filter((item, index) => {
      return item.meta.affix || index >= idx
    })
  },
  /**
   * @description 删除当前标签页右边全部多标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delRightVisitedRoutes(state, path) {
    const idx = state.visitedRoutes.indexOf(
      state.visitedRoutes.find((item) => item.path === path)
    )
    state.visitedRoutes = state.visitedRoutes.filter((item, index) => {
      return item.meta.affix || index <= idx
    })
  },
  /**
   * @description 删除全部多标签页
   * @param {*} state
   * @returns
   */
  delAllVisitedRoutes(state) {
    state.visitedRoutes = state.visitedRoutes.filter((item) => item.meta.affix)
  },
  /**
   * @description 修改标题
   * @param {*} state
   * @param title 新标题
   */
  changeRouteTitle(state, title) {
    state.visitedRoutes = state.visitedRoutes.map((item) => {
      if (item.meta.title === title.defaultTitle)
        item.meta.title = title.currentTitle
      return item
    })
  },
}
const actions = {
  /**
   * @description 添加标签页
   * @param {*} { commit }
   * @param {*} route
   */
  addVisitedRoute({ commit }, route) {
    commit('addVisitedRoute', route)
  },
  /**
   * @description 删除当前标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delVisitedRoute({ commit }, route) {
    commit('delVisitedRoute', route)
  },
  /**
   * @description 删除当前标签页以外其它全部多标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delOthersVisitedRoutes({ commit }, route) {
    commit('delOthersVisitedRoutes', route)
  },
  /**
   * @description 删除当前标签页左边全部多标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delLeftVisitedRoutes({ commit }, route) {
    commit('delLeftVisitedRoutes', route)
  },
  /**
   * @description 删除当前标签页右边全部多标签页
   * @param {*} { commit }
   * @param {*} route
   */
  delRightVisitedRoutes({ commit }, route) {
    commit('delRightVisitedRoutes', route)
  },
  /**
   * @description 删除全部多标签页
   * @param {*} { commit }
   */
  delAllVisitedRoutes({ commit }) {
    commit('delAllVisitedRoutes')
  },
  /**
   * @description 修改标题
   * @param {*} { commit }
   * @param title
   */
  changeRouteTitle({ commit }, title = {}) {
    commit('changeRouteTitle', title)
  },
}
export default { state, getters, mutations, actions }
