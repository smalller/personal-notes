import postMsg from '@/cms/common/postMsg'
import cookie from 'vue-cookie'
const msg = postMsg('classroom')
window.msg = msg
msg.on('connect', (e) => {
  console.log(e)
  msg.emit('userInfo', {
    token: cookie.get(`token_${firmId}`),
    userId: cookie.get(`${firmId}_user_id`),
    firmId: firmId,
  })
  msg.emit('chapterInfo', JSON.parse(sessionStorage.getItem('chapterInfo')))
})
