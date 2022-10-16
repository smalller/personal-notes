// 阿里矢量图标库配置
let iconfontVersion = ['567566_pwc3oottzol'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;

let baseUrl = '';
let codeUrl = `${baseUrl}/code`
let imgHead = '';

const env = process.env
if (env.NODE_ENV === 'development') {
  baseUrl = `/api`; // 开发环境地址
  imgHead = 'http://192.168.101.204:80/blade-resource/oss/jz/file-link?tenantId=000000&fileName='

} else if (env.NODE_ENV === 'test') {
  baseUrl = ``; //测试环境地址
  imgHead = '';
} else if (env.NODE_ENV === 'production') {
  baseUrl = ``; //生产环境地址
  imgHead = '';
}
export {
  baseUrl,
  imgHead,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
