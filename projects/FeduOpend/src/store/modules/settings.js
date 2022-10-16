/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import {
  logo,
  title,
  i18n,
  layout,
  themeName,
  fixedHeader,
  showProgressBar,
  showTabsBar,
  showLanguage,
  showRefresh,
  showSearch,
  showTheme,
  showNotice,
  showFullScreen,
} from '@/config'
import { isJson } from '@/utils/validate'

const defaultTheme = {
  layout,
  themeName,
  fixedHeader,
  showProgressBar,
  showTabsBar,
  showLanguage,
  showRefresh,
  showSearch,
  showTheme,
  showNotice,
  showFullScreen,
}

const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  if (isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}
const { collapse } = getLocalStorage('collapse')
const { language } = getLocalStorage('language')

const state = {
  logo,
  title,
  device: 'desktop',
  collapse: collapse || false,
  language: language || i18n,
  theme: getLocalStorage('theme') || defaultTheme,
}
const getters = {
  logo: (state) => state.logo,
  title: (state) => state.title,
  device: (state) => state.device,
  collapse: (state) => state.collapse,
  language: (state) => state.language,
  theme: (state) => state.theme,
}
const mutations = {
  openSideBar(state) {
    state.collapse = false
  },
  foldSideBar(state) {
    state.collapse = true
  },
  toggleDevice(state, device) {
    state.device = device
  },
  toggleCollapse(state) {
    state.collapse = !state.collapse
    localStorage.setItem('collapse', `{"collapse":${state.collapse}}`)
  },
  changeLanguage(state, language) {
    state.language = language
    localStorage.setItem('language', `{"language":"${language}"}`)
  },
  updateTheme(state, theme) {
    state.theme = Object.assign(state.theme, theme)
  },
  saveTheme(state) {
    localStorage.setItem('theme', JSON.stringify(state.theme))
  },
  resetTheme(state) {
    state.theme = { ...defaultTheme }
    localStorage.removeItem('theme')
    localStorage.setItem('theme', JSON.stringify({ ...defaultTheme }))
    document.getElementsByTagName('body')[0].className = `vab-theme-${
      { ...defaultTheme }.themeName
    }`
  },
  setTitle(state, title) {
    state.title = title
  },
}
const actions = {
  openSideBar({ commit }) {
    commit('openSideBar')
  },
  foldSideBar({ commit }) {
    commit('foldSideBar')
  },
  toggleDevice({ commit }, device) {
    commit('toggleDevice', device)
  },
  toggleCollapse({ commit }) {
    commit('toggleCollapse')
  },
  changeLanguage: ({ commit }, language) => {
    commit('changeLanguage', language)
  },
  updateTheme({ commit }, theme) {
    commit('updateTheme', theme)
  },
  saveTheme({ commit }) {
    commit('saveTheme')
  },
  resetTheme({ commit }) {
    commit('resetTheme')
  },
}
export default { state, getters, mutations, actions }
