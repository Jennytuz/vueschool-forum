import firebase from 'firebase'

export default {
  initAuthentication ({ dispatch, commit, state }) {
    if (state.authObserverUnsubscribe) return
    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        console.log('the user has changed')
        dispatch('unsubscribeAuthUserSnapshot')
        if (user) {
          console.log('有AuthUSER')
          await dispatch('fetchAuthUser')
          resolve(user)
        } else {
          resolve(null)
        }
      })
      commit('setAuthObserverUnsubscribe', unsubscribe)
    })
  },
  async registerUserWithEmailAndPassword ({ dispatch }, { name, username, avatar = null, email, password }) {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await dispatch('createUser', { id: result.user.uid, name, username, avatar, email })
  },
  signInWithEmailAndPassword (context, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  async signInWithGoogle ({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    const response = firebase.auth().signInWithPopup(provider)
    const user = response.user
    const userRef = firebase.firestore().collection('users').doc(user.id)
    const userDoc = await userRef.get()
    if (!userDoc.exists) {
      return dispatch('createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoUrl })
    } else {
      return dispatch('fetchAuthUser')
    }
  },
  async signOut ({ commit }) {
    await firebase.auth().signOut()
    commit('setAuthId', null)
  },
  fetchItem ({ commit }, { id, emoji, resource, handleUnsubscribe = null }) {
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id }
            commit('setItem', { resource, id, item })
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
  fetchItems ({ dispatch }, { ids, emoji, resource }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, emoji, resource })))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  async unsubscribeAuthUserSnapshot ({ state, commit }) {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe()
      commit('setAuthUserUnsubscribe', null)
    }
  }
}
