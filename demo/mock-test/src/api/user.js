import axios from 'axios'

export const getUserInfo = () => {
  return axios({
    url: '/api/getUserInfo',
    method: 'post',
  })
}