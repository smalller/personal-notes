const baseUrl = 'https://app.cdhqht.com'
// const baseUrl = 'https://apptest.cdhqht.com'
// const baseUrl = 'http://47.108.204.66:8079'
// const baseUrl = 'http://192.168.2.15:8079'
// const baseUrl = 'http://192.168.2.24:8079' //xg
// const baseUrl = 'http://192.168.2.50:8079' //dc
// const fileUrl = baseUrl + '/app/file/upload/down?keyName='
// const fileUrl = baseUrl + '/app/file/upload/downwm?wm=false&keyName='
// const fileUrl = baseUrl + '/app/103/file/upload/down?keyName='
const fileUrl = baseUrl + '/app/103/file/upload/downwm?wm=false&keyName='

const ajax = (url,type,data={},header={}) =>{ 
  let header_str,token='';
  header_str = header?header:{"Content-type":"application/json"}
  token = wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo').token : ''
  header_str['X-App-Token'] = token
  url = url.replace('/app','/app/103')
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method: type,
      data: data,
      header: header_str,
      success (res) {
        if(res.data.code == 700){
          wx.login({
            success: res => {
              wx.setStorageSync('code', res.code)
              wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 1500
              })

              let pages = getCurrentPages();
              let currPage = null;
              if (pages.length > 1) {
                currPage = pages[pages.length - 1];
                wx.setStorage({
                  key:"currPage",
                  data:currPage
                })
              }else{
                wx.removeStorageSync('userinfo')
                wx.removeStorageSync('ktv_info')
                wx.removeStorageSync('payInfo')
                wx.removeStorageSync('useCart')
                wx.removeStorageSync('selectKtvId')
                wx.removeStorageSync('coupons')
                wx.removeStorageSync('pay_timer')
              }
              // setTimeout(()=>{
              //   wx.switchTab({
              //     url: '/pages/my/my',
              //   })
              // },1500)
            }
          })
          // return
        }
        resolve(res.data)
      },
      fail(err){
        reject(err)
      }
    })
  })  
}
module.exports = {
  ajax,
  fileUrl,
  baseUrl,
}
