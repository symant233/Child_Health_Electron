import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/inserter'
    },
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
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
    },
    {
      path: '/tele',
      name: 'tele-page',
      component: require('@/components/Telephone').default
    },
    {
      path: '/detail',
      name: 'entry-detail',
      component: require('@/components/Detail').default
    }
  ]
})
