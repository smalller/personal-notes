import Vue from 'vue'
import basicBlock from '../components/basic-block/main';
import basicContainer from '../components/basic-container/main';
import thirdRegister from '../components/third-register/main';
import avueUeditor from 'avue-plugin-ueditor';

// 注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('basicBlock', basicBlock);
Vue.component('thirdRegister', thirdRegister);
Vue.component('avueUeditor', avueUeditor);
