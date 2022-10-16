/**
 * @author chuzhixin 1204505056@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */
import Vue from 'vue'
import cookie from 'vue-cookie'
import {
  getUserInfo,
  login,
  logout,
  socialLogin,
  getSchoolId,
} from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'
const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  schoolId: [], //存放学校id数组 重要 在需要用到学校id地方 使用vuex数据
  school: '', //用于以后切换schoolId的数据
}
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  school: (state) => state.school,
  schoolId: (state) => state.schoolId,
}
const mutations = {
  /**
   * 设置学校id
   * @param state
   * @param schooldId
   */
  setSchoolId(state, schooldId) {
    state.schoolId = schooldId
  },
  /**
   * 当前学校id
   * @param state
   * @param id
   */
  setNowId(state, id) {
    state.school = id
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 设置accessToken
   * @param {*} state
   * @param {*} accessToken
   */
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
}
const actions = {
  async ac_setSchoolId({ commit }) {
    getSchoolId().then((res) => {
      // console.log('schoolId查询', res)
      if (+res.code === 0) {
        let resData = res.data.list
        commit('setSchoolId', resData)
        //默认使用第一个schoolId
        sessionStorage.setItem('zdyjb_schoolId', resData[0].schoolId)
        commit('setNowId', resData[0].schoolId)
      }
    })
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, {
      root: true,
    })
    // commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit, dispatch, rootState }, userInfo) {
    const { data } = await login(userInfo)
    cookie.set(`token_${firmId}`, data.token)
    cookie.set(`${firmId}_user_id`, data.userId)
    cookie.set(`${firmId}_user_type`, data.userType || '300409')
    if (!data) {
      Vue.prototype.$baseMessage(
        '登录核心接口异常，请检查返回JSON格式是否正确，data字段是否为数组',
        'error'
      )
      return false
    }
    const accessToken = data[tokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
      // dispatch('ac_setSchoolId')
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(
        `欢迎登录${rootState.settings.title}`,
        `${thisTime}！`
      )
      return Promise.resolve(accessToken)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 第三方登录
   * @param {*} {}
   * @param {*} tokenData
   */
  async socialLogin({ dispatch, rootState }, tokenData) {
    const { data } = await socialLogin(tokenData)
    if (!data) {
      Vue.prototype.$baseMessage(
        '登录核心接口异常，请检查返回JSON格式是否正确，data字段是否为数组',
        'error'
      )
      return false
    }
    const accessToken = data[tokenName]
    if (accessToken) {
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(
        `欢迎登录${rootState.settings.title}`,
        `${thisTime}！`
      )
    } else {
      Vue.prototype.$baseMessage(
        `login核心接口异常，请检查返回JSON格式是否正确，是否正确返回${tokenName}...`,
        'error'
      )
    }
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch, state }) {
    let userId = cookie.get(`${firmId}_user_id`)
    let userType = cookie.get(`${firmId}_user_type`)
    const res = await getUserInfo(userId, userType)
    // alert(JSON.stringify(res))
    if (+res.code !== 0 || !res.code) {
      return Promise.reject(res.msg)
    }
    let data = res.data
    if (!data) {
      Vue.prototype.$baseMessage(
        'getUserInfo核心接口异常，请检查返回JSON格式是否正确，data字段是否为数组',
        'error'
      )
      return false
    }
    let { username, headPortrait, roleId, ability } = data.user
    // if (username && !!roleId) {
    console.log(data.user, '111111111111111')
    dispatch('acl/setRole', [roleId], {
      root: true,
    })
    //   if (ability && ability.length > 0)
    dispatch('acl/setFull', true, {
      root: true,
    })
    dispatch('acl/setAbility', [], {
      root: true,
    })

    commit('setUsername', username)
    commit('setAvatar', headPortrait)
    dispatch('cms_code/setCode', true, {
      root: true,
    })
    // dispatch('cms_subject/querySubjectManage', true, { root: true })
    return Promise.resolve(data)
    // } else {
    //   Vue.prototype.$baseMessage(
    //     'getUserInfo核心接口异常，请检查返回JSON格式是否正确，roles字段是否为数组，是否与路由roles匹配',
    //     'error'
    //   )
    // }
  },

  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAll')
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 重置accessToken、roles、ability、router等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ dispatch }) {
    await dispatch('setAccessToken', '')
    await dispatch('acl/setFull', false, {
      root: true,
    })
    await dispatch('acl/setRole', [], {
      root: true,
    })
    await dispatch('acl/setAbility', [], {
      root: true,
    })
    await resetRouter()
    await removeAccessToken()
  },
  /**
   * @author chuzhixin 1204505056@qq.com
   * @description 设置token
   */
  setAccessToken({ commit }, accessToken) {
    commit('setAccessToken', accessToken)
  },
}
export default {
  state,
  getters,
  mutations,
  actions,
}
