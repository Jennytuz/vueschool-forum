import { makeAppendChildToParentMutation } from '@/helpers'

export default {
  state: {
    items: []
  },
  getters: {
  },
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: 'Forum:::' }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: 'Forums:::' })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
