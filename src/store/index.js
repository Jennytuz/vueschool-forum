import { createStore } from 'vuex'
import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'

export default createStore({
  state: {
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3',
    categories: [],
    threads: [],
    forums: [],
    posts: [],
    users: []
  },
  getters,
  actions,
  mutations
})
