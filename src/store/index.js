import { createStore } from 'vuex'
import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'

export default createStore({
  state: {
    authId: null,
    categories: [],
    threads: [],
    forums: [],
    posts: [],
    users: [],
    unsubscribes: [],
    authUserUnsubscribes: null,
    authObserverUnsubscribe: null
  },
  getters,
  actions,
  mutations
})
