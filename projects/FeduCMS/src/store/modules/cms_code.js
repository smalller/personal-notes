import request from '@/utils/request'
import { CODE } from '@/cms/api/code'
const state = {
  codeData: {},
}
const getters = {
  codeData: (state) => state.codeData,
}
const mutations = {
  setCode(state, codeData) {
    state.codeData = codeData
  },
}
const actions = {
  setCode({ commit }, val) {
    request({ url: CODE, method: 'get', data: {} }).then((res) => {
      commit('setCode', res.data)
    })
  },
}
export default { state, getters, mutations, actions }
