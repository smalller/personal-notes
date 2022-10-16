const List = [
  {
    id: '@id',
    username: 'admin',
    password: 'admin',
    email: '@email',
    roles: ['admin'],
    datatime: '@datetime',
  },
  {
    id: '@id',
    username: 'editor',
    password: 'editor',
    email: '@email',
    roles: ['editor'],
    datatime: '@datetime',
  },
  {
    id: '@id',
    username: 'test',
    password: 'test',
    email: '@email',
    roles: ['admin', 'editor'],
    datatime: '@datetime',
  },
]
module.exports = [
  {
    url: '/userManagement/getList',
    type: 'get',
    response(config) {
      const { username, pageNo = 1, pageSize = 20 } = config.query
      let mockList = List.filter((item) => {
        return !(username && item.username.indexOf(username) < 0)
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
    url: '/userManagement/doEdit',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/userManagement/doDelete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
]
