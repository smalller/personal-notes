import {
  getAllAreaById,
  getClazzType,
  getTitleType,
} from '@/cms/api/commonArea'
import { getPayType, getStatusType } from '@/api/order'

const state = {
  city_list: [], //中国 省的数据
  class_code: [], //年级 码值数据
  title_code: [], //称谓码值
  pay_status: [], //支付状态
  pay_type: [], //支付类型
}
const mutations = {
  getProvince(state, list) {
    state.city_list = list
  },
  getClassCode(state, list) {
    state.class_code = list
  },
  getTitleCode(state, list) {
    state.title_code = list
  },
  getPayStatus(state, list) {
    state.pay_status = list
  },
  getPayType(state, list) {
    state.pay_type = list
  },
}
const getters = {
  city_list: (state) => state.city_list,
  class_code: (state) => state.class_code,
  title_code: (state) => state.title_code,
  pay_status: (state) => state.pay_status,
  pay_type: (state) => state.pay_type,
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
  ac_getPayStatus({ commit, dispatch }) {
    getStatusType().then((res) => {
      if (+res.code === 0) {
        commit('getPayStatus', res.data)
      } else {
        setTimeout(() => {
          dispatch('ac_getPayStatus')
        }, 2000)
      }
    })
  },
  ac_getPayType({ commit, dispatch }) {
    getPayType().then((res) => {
      if (+res.code === 0) {
        commit('getPayType', res.data)
      } else {
        setTimeout(() => {
          dispatch('ac_getPayType')
        }, 2000)
      }
    })
  },
}
export default { state, getters, mutations, actions }
