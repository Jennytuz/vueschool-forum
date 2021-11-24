import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home'
import Forum from '@/pages/Forum'
import Category from '@/pages/Category'
import ThreadShow from '@/pages/ThreadShow'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'
import sourceData from '@/data.json'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  }, {
    path: '/forum/:id',
    name: 'Forum',
    component: Forum,
    props: true
  }, {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: ThreadShow,
    props: true,
    beforeEnter (to, from, next) {
      const threadExits = sourceData.threads.find(thread => thread.id === to.params.id)
      if (threadExits) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          hash: to.hash,
          query: to.query
        })
      }
    }
  }, {
    path: '/forum/:id/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  }, {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true
  }, {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true }
  }, {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: {
      edit: true
    }
  }, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
