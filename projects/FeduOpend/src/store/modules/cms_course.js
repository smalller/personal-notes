export default {
  state: {
    courseInfo: !sessionStorage.getItem('courseDetails')
      ? {}
      : JSON.parse(sessionStorage.getItem('courseDetails')),
    reCourseInfo: !sessionStorage.getItem('reCourseInfo')
      ? {}
      : JSON.parse(sessionStorage.getItem('reCourseInfo')),
    chapterInfo: !sessionStorage.getItem('chapterDetails')
      ? {}
      : JSON.parse(sessionStorage.getItem('chapterDetails')),
  },
  getters: {
    courseDetails: (state) => state.courseInfo,
    reCourseInfo: (state) => state.reCourseInfo,
    chapterInfo: (state) => state.chapterInfo,
  },
  mutations: {
    setCourseInfo(state, info) {
      if (+info.courseType === 300456) {
        state.courseInfo = info
        sessionStorage.setItem('courseDetails', JSON.stringify(info))
      } else {
        state.reCourseInfo = info
        sessionStorage.setItem('reCourse', JSON.stringify(info))
      }
    },
    setChapterInfo(state, info) {
      state.chapterInfo = info
      sessionStorage.setItem('chapterDetails', JSON.stringify(info))
    },
  },
  actions: {
    setCourseInfo({ commit }, info) {
      commit('setCourseInfo', info)
    },
    setChapterInfo({ commit }, info) {
      commit('setChapterInfo', info)
    },
  },
}
