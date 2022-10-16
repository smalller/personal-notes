import {
  getAllAreaById,
  getClazzType,
  getTitleType,
  getUserType,
} from '@/cms/api/commonArea'
const state = {
  city_list: [], //中国 省的数据
  class_code: [], //年级 码值数据
  title_code: [], //称谓码值
  user_code: [], //juese码值
}
const mutations = {
  getProvince(state, list) {
    state.city_list = list
  },
  getClassCode(state, list) {
    state.class_code = list
  },
  getUserCode(state, list) {
    state.user_code = list
  },
  getTitleCode(state, list) {
    state.title_code = list
  },
}
const getters = {
  user_code: (state) => state.user_code,
  city_list: (state) => state.city_list,
  class_code: (state) => state.class_code,
  title_code: (state) => state.title_code,
}
const actions = {
  ac_getProvince({ commit, dispatch }) {
    getAllAreaById('100000').then((res) => {
      if (+res.code === 0) {
        // console.log('中国省查询', res.data.info)
        commit('getProvince', res.data.info)
      } else {
        setTimeout(() => {
          dispatch('ac_getProvince')
        }, 2000)
      }
    })
  },
  ac_getClassCode({ commit }) {
    getClazzType('100000').then((res) => {
      if (+res.code === 0) {
        // console.log('班级码值查询', res.data)
        commit('getClassCode', res.data.list)
      } else {
        setTimeout(() => {
          commit('getClassCode', res.data.list)
        }, 2000)
      }
    })
  },
  ac_getTitleCode({ commit }) {
    getTitleType('100000').then((res) => {
      if (+res.code === 0) {
        // console.log('称谓码值查询', res.data)
        commit('getTitleCode', res.data.list)
      } else {
        setTimeout(() => {
          commit('getTitleCode', res.data.list)
        }, 2000)
      }
    })
  },
  ac_getUserCode({ commit }) {
    getUserType().then((res) => {
      if (+res.code === 0) {
        // console.log('称谓码值查询', res.data)
        commit('getUserCode', res.data.list)
      } else {
        setTimeout(() => {
          commit('getUserCode', res.data.list)
        }, 2000)
      }
    })
  },
}
export default { state, getters, mutations, actions }
