const data = {
  description:
    ' 作者寄语：静坐常思己过，闲谈不论人非，vue-admin-beautiful-pro目前已支持5种布局、5种主题，共计25种风格无缝切换，支持三级路由以上缓存，提供最细致的权限处理，支持中英文切换，同时兼容电脑、平板、手机。',
}

module.exports = [
  {
    url: '/description/getList',
    type: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data,
      }
    },
  },
]
