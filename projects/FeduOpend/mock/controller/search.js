const data = [
  {
    url: 'https://github.com/chuzhixin/vue-admin-beautiful',
    value:
      '中国最好用的框架企业级、中后台、通用型前端框架vue-admin-beautiful-pro',
  },
  {
    url:
      'https://www.baidu.com/s?wd=vue-admin-beautiful%E6%96%87%E6%A1%A3&rsv_spt=1&rsv_iqid=0xb8393f250000e09a&issp=1&f=3&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&rsv_dl=ts_0&oq=vue-admin-beautiful&rsv_t=780fn2RNJdwKpBcnXhafmyPjUPAduXDbHgYYngJ2QKBQluEnKOClb2r3SE4W%2BzhtF6fV&rsv_btype=t&inputT=459&rsv_sug3=5&rsv_sug1=5&rsv_sug7=100&rsv_pq=ed30ea5500032c4b&rsv_sug2=0&prefixsug=vue-admin-beautiful&rsp=0&rsv_sug4=1793',
    value: 'vue-admin-beautiful文档',
  },
  {
    url:
      'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=2&tn=baiduhome_pg&wd=beautiful.panm.cn&oq=beautiful.panm.cn&rsv_pq=bf312c2f00026019&rsv_t=a6b8%2Fo1W16TeYRYzViSwSXsVMosb255PaiEfKTXMKKNx0dwOtxpowxPYRP%2FJ%2BgMgtcAo&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=2&rsv_sug3=61&rsv_sug2=0&rsv_sug4=883&bs=beautiful.panm.cn',
    value: 'vue-admin-beautiful官网',
  },
]
module.exports = [
  {
    url: '/search/getList',
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
