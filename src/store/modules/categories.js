import { makeAppendChildToParentMutation } from '@/helpers'
import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
  },
  actions: {
    fetchAllCategories ({ commit }) {
      return new Promise((resolve) => {
        firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = { id: doc.id, ...doc.data() }
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          resolve(categories)
        })
      })
    },
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: 'Category:::' }, { root: true }),
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: 'Categories:::' }, { root: true })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
