import { makeAppendChildToParentMutation } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
  },
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: 'Forum:::' }, { root: true }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: 'Forums:::' }, { root: true })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
