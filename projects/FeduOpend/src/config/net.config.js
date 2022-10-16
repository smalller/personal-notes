/**
 * @description 导出网络配置
 **/
const network = {
  //默认的接口地址 如果是开发环境和生产环境走vab-mock-server，当然你也可以选择自己配置成需要的接口地址
  baseURL:
    // process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : '',
    process.env.NODE_ENV === 'development'
      ? process.env.VUE_APP_BASE_API
      : process.env.VUE_APP_BASE_API,
  //配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  //最长请求时间
  requestTimeout: 10000000,
  //操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, '200', '0'],
  //数据状态的字段名称
  statusName: 'code',
  //状态信息的字段名称
  messageName: 'msg',
}
module.exports = network
