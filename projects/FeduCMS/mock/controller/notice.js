const data = [
  {
    email: '@email',
    image: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
    notice: '官方QQ群1：972435319、官方QQ群2：1139183756',
  },
  {
    email: '@email',
    image: 'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif',
    notice:
      "github开源地址：<a target='_blank' href='https://github.com/chuzhixin/vue-admin-beautiful'>https://github.com/chuzhixin/vue-admin-beautiful</a>",
  },
  {
    email: '@email',
    image: 'https://i.gtimg.cn/club/item/face/img/0/15640_100.gif',
    notice:
      "开源中国地址：<a target='_blank' href='https://www.oschina.net/p/vue-admin-beautiful'>https://www.oschina.net/p/vue-admin-beautiful</a>",
  },
  {
    email: '@email',
    image: 'https://i.gtimg.cn/club/item/face/img/9/15919_100.gif',
    notice:
      "gitee开源地址：<a target='_blank' href='https://gitee.com/chu1204505056/vue-admin-beautiful'>https://gitee.com/chu1204505056/vue-admin-beautiful</a>",
  },
  {
    email: '@email',
    image: 'https://i.gtimg.cn/club/item/face/img/8/15918_100.gif',
    notice:
      "vue3.0 体验地址：<a target='_blank' href='https://chu1204505056.gitee.io/vue-admin-beautiful-antdv'>'https://chu1204505056.gitee.io/vue-admin-beautiful-antdv</a>",
  },
]
module.exports = [
  {
    url: '/notice/getList',
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
