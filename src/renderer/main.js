import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import db from '../datastore/index'
import process from 'process'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
}
Vue.db = Vue.prototype.$db = db

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
