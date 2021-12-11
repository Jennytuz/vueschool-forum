import { createStore } from 'vuex'
import actions from '@/store/actions'
import categories from './modules/categories'
import threads from './modules/threads'
import forums from './modules/forums'
import posts from './modules/posts'
import users from './modules/users'
import auth from './modules/auth'

export default createStore({
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth
  },
  state: {
    unsubscribes: []
  },
  actions
})
