import Mock from 'mockjs'
import {
  getUserInfo
} from './user.js'

Mock.setup({
  timeout: 1000
})

Mock.mock('/api/getUserInfo', 'post', getUserInfo)