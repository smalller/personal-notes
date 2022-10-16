// 自动加载svg目录下所有图标
const req = require.context('./svg', false, /\.svg$/)
// 返回数组的名称就是图标文件的名称
req.keys().map(req)