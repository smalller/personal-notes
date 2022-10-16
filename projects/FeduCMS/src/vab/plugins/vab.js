import Vue from 'vue'
import { loadingText, messageDuration } from '@/config'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getAccessToken } from '@/utils/accessToken'

const accessToken = store.getters['user/accessToken']

/* 全局accessToken */
Vue.prototype.$baseAccessToken = () => {
  return accessToken || getAccessToken()
}

/* 全局加载层 */
Vue.prototype.$baseLoading = (index, text) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: 'vab-loading-type' + index,
      background: 'hsla(0,0%,100%,.8)',
    })
  }
  return loading
}

/* 全局多彩加载层 */
Vue.prototype.$baseColorfullLoading = (index, text) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: 'dots-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    switch (index) {
      case 1:
        index = 'dots'
        break
      case 2:
        index = 'gauge'
        break
      case 3:
        index = 'inner-circles'
        break
      case 4:
        index = 'plus'
        break
    }
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: index + '-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  }
  return loading
}

/* 全局Message */
Vue.prototype.$baseMessage = (message, type, dangerouslyUseHTMLString) => {
  Message({
    showClose: true,
    message: message,
    type: type,
    dangerouslyUseHTMLString,
    duration: messageDuration,
  })
}

/* 全局Alert */
Vue.prototype.$baseAlert = (content, title, callback) => {
  MessageBox.alert(content, title || '温馨提示', {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true,
    callback: () => {
      if (callback) {
        callback()
      }
    },
  }).then(() => {})
}

/* 全局Confirm */
Vue.prototype.$baseConfirm = (content, title, callback1, callback2) => {
  MessageBox.confirm(content, title || '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning',
  })
    .then(() => {
      if (callback1) {
        callback1()
      }
    })
    .catch(() => {
      if (callback2) {
        callback2()
      }
    })
}

/* 全局Notification */
Vue.prototype.$baseNotify = (message, title, type, position) => {
  Notification({
    title: title,
    message: message,
    position: position || 'top-right',
    type: type || 'success',
    duration: messageDuration,
  })
}

/* 全局TableHeight */
Vue.prototype.$baseTableHeight = (formType) => {
  let height = window.innerHeight
  let paddingHeight = 313
  const formHeight = 50

  if ('number' == typeof formType) {
    height = height - paddingHeight - formHeight * formType
  } else {
    height = height - paddingHeight
  }
  return height
}

/* 全局事件总线 */
Vue.prototype.$baseEventBus = new Vue()
