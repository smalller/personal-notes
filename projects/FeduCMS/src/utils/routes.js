import path from 'path'
import { isExternal } from '@/utils/validate'
import { hasAccess } from '@/utils/hasAccess'

/**
 * @description all模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/vab/layouts'], resolve)
      } else {
        try {
          const index = route.component.indexOf('views')
          const path =
            index > 0
              ? route.component.slice(index)
              : `views/${route.component}`
          route.component = (resolve) => require([`@/cms/${path}`], resolve)
        } catch (err) {
          console.log(err)
        }
      }
    }
    if (route.children && route.children.length)
      route.children = convertRouter(route.children)
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

/**
 * @description 根据roles数组拦截路由
 * @param routes 路由
 * @param rolesControl 是否进行权限控制
 * @param baseUrl 基础路由
 * @returns {[]}
 */
export function filterRoutes(routes, rolesControl, baseUrl = '/') {
  return routes
    .filter((route) => {
      if (rolesControl && route.meta && route.meta.roles)
        return hasAccess(route.meta.roles)
      else return true
    })
    .map((route) => {
      if (route.path !== '*' && !isExternal(route.path))
        route.path = path.resolve(baseUrl, route.path)
      if (route.children)
        route.children = filterRoutes(route.children, rolesControl, route.path)
      return route
    })
}
