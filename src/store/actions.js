import firebase from 'firebase'
import { findById } from '@/helpers'

export default {
  fetchItem ({ state, commit }, { id, emoji, resource, handleUnsubscribe = null, once = false, onSnapshot = null }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (once) {
            unsubscribe()
            console.log('unsubscribing for once option')
          }
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id }
            let previousItem = findById(state[resource].items, id)
            previousItem = previousItem ? { ...previousItem } : null
            commit('setItem', { resource, item })
            if (typeof onSnapshot === 'function') {
              const isLocal = doc.metadata.hasPendingWrites
              onSnapshot({ item: { ...item }, previousItem, isLocal })
            }
            resolve(item)
          } else {
            resolve(null)
          }
        })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },
  fetchItems ({ dispatch }, { ids, emoji, resource, onSnapshot = null }) {
    return Promise.all(ids.map(id =>
      dispatch('fetchItem', { id, emoji, resource, onSnapshot })
    ))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  }
}
