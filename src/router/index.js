import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home'
import Forum from '@/pages/Forum'
import Category from '@/pages/Category'
import ThreadShow from '@/pages/ThreadShow'
import Register from '@/pages/Register'
import SignIn from '@/pages/SignIn'
import ThreadCreate from '@/pages/ThreadCreate'
import ThreadEdit from '@/pages/ThreadEdit'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'
import store from '@/store'
import { findById } from '@/helpers'
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
    async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once: true })
      const threadExists = findById(store.state.threads.items, to.params.id)
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  }, {
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    meta: { requireAuth: true },
    props: true
  }, {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    meta: { requireAuth: true },
    props: true
  }, {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true, requireAuth: true }
  }, {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    meta: { requireAuth: true },
    props: {
      edit: true
    }
  }, {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  }, {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresGuest: true }
  }, {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter () {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  }, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeAllSnapshots')
  if (to.meta.requireAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})

export default router
