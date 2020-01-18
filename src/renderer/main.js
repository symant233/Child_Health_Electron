import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from '../datastore/index'
const process = require('process')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

console.log(db.test + ' from src/renderer/main.js')

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
