/**
 * @description 4个子配置，vue/cli配置|通用配置|主题配置|网络配置导出
 */
const cli = require('./cli.config')
const setting = require('./setting.config')
const theme = require('./theme.config')
const network = require('./net.config')
module.exports = Object.assign({}, cli, setting, theme, network)
