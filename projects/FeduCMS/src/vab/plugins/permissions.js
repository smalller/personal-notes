/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router, { resetRouter } from '@/router'
import store from '@/store'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import {
  authentication,
  loginInterception,
  recordRoute,
  routesWhiteList,
} from '@/config'

const toLogin = (next, path) => {
  if (recordRoute && path !== '/') {
    if (window.location.host == 'agent.jinshuy.com') {
      next({
        path: '/login',
        query: {
          redirect: path,
        },
        replace: true,
      })
      return
    } else {
      next({
        path: '/login',
        query: {
          redirect: path,
        },
        replace: true,
      })
    }
  } else if (window.location.host == 'agent.jinshuy.com') {
    next({
      path: '/login',
      query: {
        redirect: path,
      },
      replace: true,
    })
    return
  } else {
    next({
      path: '/login',
      query: {
        redirect: path,
      },
      replace: true,
    })
  }
  // next({
  //   path: '/login',
  //   replace: true,
  // })
}

VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeEach(async (to, from, next) => {
  const { showProgressBar } = store.getters['settings/theme']
  if (showProgressBar) VabProgress.start()
  let hasToken = store.getters['user/accessToken']
  if (!loginInterception) hasToken = true

  if (routesWhiteList.includes(to.path) && !hasToken) {
    // 设置游客路由
    if (!store.getters['routes/routes'].length)
      await store.dispatch('routes/setRoutes', 'visit')
    if (to.path === '/login' && hasToken)
      next({
        path: '/',
      })
    else next()
  } else {
    if (hasToken) {
      // console.log('hasToken', hasToken)
      const hasAccess =
        store.getters['acl/admin'] ||
        store.getters['acl/role'].length ||
        store.getters['acl/ability'].length
      if (hasAccess) {
        next()
      } else {
        try {
          if (loginInterception) {
            await store.dispatch('user/getUserInfo')
            await store.dispatch('user/ac_setSchoolId')
          }
          //settings.js loginInterception为false（关闭登录拦截时）时，创建虚拟角色
          else await store.dispatch('user/setVirtualRoles')
          //根据路由模式获取路由并根据权限过滤
          await store.dispatch('routes/setRoutes', authentication)
          next({
            ...to,
            replace: true,
          })
        } catch (err) {
          await store.dispatch('user/resetAll')
          toLogin(next, to.path)
        }
      }
    } else {
      toLogin(next, to.path)
    }
  }
})
router.afterEach(async (to) => {
  // document.title = await getPageTitle(to.meta.title)
  if (VabProgress.status) VabProgress.done()
})
