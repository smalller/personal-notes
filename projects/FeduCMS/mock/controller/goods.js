const List = [
  {
    uuid: '@uuid',
    image: 'https://gitee.com/chu1204505056/image/raw/master/goods/uview.gif',
    title: 'uview',
    price: '免费',
    label: ['uniapp', '跨平台', '组件'],
    company: '言信网络',
    url: 'http://uviewui.com/',
  },
  {
    uuid: '@uuid',
    title: 'form-generator',
    icon: 'newspaper-line',
    price: '免费',
    label: ['element-ui', '表单设计器'],
    company: 'form-generator',
    url: 'https://mrhj.gitee.io/form-generator/#/',
  },
  /* {
    uuid: '@uuid',
    icon: 'shopping-bag-3-line',
    title: '敬请期待',
    price: '￥XXX元',
    label: ['商城'],
    company: '千鸟云商',
  }, */
]

module.exports = [
  {
    url: '/goods/getList',
    type: 'get',
    response(config) {
      const { title, pageNo = 1, pageSize = 20 } = config.query
      let mockList = List.filter((item) => {
        return !(title && item.title.indexOf(title) < 0)
      })
      const pageList = mockList.filter(
        (item, index) =>
          index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
      )
      return {
        code: 200,
        msg: 'success',
        totalCount: mockList.length,
        data: pageList,
      }
    },
  },
]
