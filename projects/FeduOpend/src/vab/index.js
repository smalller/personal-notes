import Vue from 'vue'

// 加载图标
import '@/icon'
// 加载样式
import './styles/vab.scss'

// 加载布局
const requireLayout = require.context('./layouts', true, /\.vue$/)
requireLayout.keys().forEach((fileName) => {
  const componentConfig = requireLayout(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// 加载组件
const requireComponent = require.context('./components', true, /\.vue$/)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// 加载插件
const requirePlugin = require.context('./plugins', true, /\.js$/)
requirePlugin.keys().forEach((fileName) => {
  requirePlugin(fileName)
})
