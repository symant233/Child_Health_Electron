import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/',
      redirect: '/inserter'
    },
    {
      path: '/inserter',
      name: 'insert-page',
      component: require('@/components/Inserter').default
    },
    {
      path: '/selector',
      name: 'select-page',
      component: require('@/components/Selector').default
    }
  ]
})
