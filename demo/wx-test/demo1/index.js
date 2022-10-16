const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser');
const app = new Koa()
app.use(bodyParser())
const router = new Router()
app.use(static(__dirname + '/'))



const conf = require('./conf')
const wechat = require('co-wechat')
router.all('/wechat', wechat(conf).middleware(
    // 当收到消息会执行
    async message => {
        console.log('wechart', message)
        return '你好陈小姐';
    }
))





app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(9527);