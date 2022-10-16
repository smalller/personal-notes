// import Vue from 'vue'
// import Vuex from 'vuex'
//
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    excelData: [],
    userInfo: sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')):{},
    userId: sessionStorage.getItem('userId')||'',
    token: sessionStorage.getItem('token')||'',
    schoolId: sessionStorage.getItem('schoolId')||'',
    // userId: sessionStorage.getItem('userId')||'23bc3fadb20e4af6841f81862896fdcc',
    // token: sessionStorage.getItem('token')||'appec60bbc8cb199864c3ac1e87a8c76b0e',
    // schoolId: sessionStorage.getItem('schoolId')||'SCH1399913242676621312',
    schoolInfo: sessionStorage.getItem('schoolInfo')?JSON.parse(sessionStorage.getItem('schoolInfo')):{},
    studentInfo: sessionStorage.getItem('studentInfo')?JSON.parse(sessionStorage.getItem('studentInfo')):{
      // studentId:'STU1440930515477696512'
    },
    studentApplyInfo:sessionStorage.getItem('studentApplyInfo')?JSON.parse(sessionStorage.getItem('studentApplyInfo')):{},
  },
  getters: {
    excelData: state => state.excelData,
    userId: state => state.userId,
    userInfo: state => state.userInfo,
    studentInfo: state => state.studentInfo,
    token: state => state.token,
    schoolId: state => state.schoolId,
    schoolInfo: state => state.schoolInfo,
    studentApplyInfo:state => state.studentApplyInfo
  },
  mutations: {
    setExcelData: (state, data) => {
      state.excelData = data
    },
    setUserId: (state, userId) => {
      state.userId = userId
      sessionStorage.setItem('userId', userId)
    },
    setToken: (state, token) => {
      state.token = token
      sessionStorage.setItem('token', token)
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
    },
    setSchoolInfo: (state, schoolInfo) => {
      state.schoolInfo = schoolInfo
      sessionStorage.setItem('schoolInfo', JSON.stringify(schoolInfo))
    },
    setSchoolId: (state, schoolId) => {
      state.schoolId = schoolId
      sessionStorage.setItem('schoolId',schoolId)
    },
    setStudentInfo: (state, studentInfo) => {
      state.studentInfo = studentInfo
      sessionStorage.setItem('studentInfo',JSON.stringify(studentInfo))
    },
    setStudentApplyInfo: (state, studentApplyInfo) => {
      state.studentApplyInfo = studentApplyInfo
      sessionStorage.setItem('studentApplyInfo',JSON.stringify(studentApplyInfo))
    }
  },
  actions: {
    setExcelData({commit}, data) {
      commit('setExcelData', data)
    },
    setUserId({commit}, userId) {
      commit('setUserId',userId)
    },
    setToken({commit}, token) {
      commit('setToken', token)
    },
    async setStudentInfo({commit},studentInfo) {
      commit('setStudentInfo', studentInfo)
      return Promise.resolve()
    },
    async setSchoolInfo({commit}, schoolInfo) {
      commit('setSchoolInfo', schoolInfo)
      return Promise.resolve()
    },
    setSchoolId({commit}, schoolId) {
      commit('setSchoolId', schoolId)
    },
    setUserInfo({commit}, userInfo) {
      commit('setUserInfo', userInfo)
    },
    setStudentApplyInfo({commit}, studentApplyInfo) {
      commit('setStudentApplyInfo', studentApplyInfo)
    }
  },
  modules: {
  }
})
