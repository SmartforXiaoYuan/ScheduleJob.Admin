import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './promissionRouter'//这里进行路由后台获取的模拟
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
