const List = [
  {
    id: '@id',
    role: 'admin',
  },
  {
    id: '@id',
    role: 'editor',
  },
]
module.exports = [
  {
    url: '/roleManagement/getList',
    type: 'get',
    response(config) {
      const { role, pageNo = 1, pageSize = 20 } = config.query
      let mockList = List.filter((item) => {
        return !(role && item.title.indexOf(role) < 0)
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
  {
    url: '/roleManagement/doEdit',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/roleManagement/doDelete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
]
