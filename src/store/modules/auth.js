import firebase from 'firebase'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribes: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    async unsubscribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    },
    fetchAuthUser: async ({ dispatch, commit, state }) => {
      const userId = firebase.auth().currentUser?.uid
      if (!userId) return
      await dispatch('fetchItem', {
        resource: 'users',
        id: userId,
        emoji: '🙋🏻‍♀️🙋🏻‍♀️🙋🏻‍♀️',
        handleUnsubscribe: (unsubscribe) => {
          commit('setAuthUserUnsubscribe', unsubscribe)
        }
      }, { root: true })
      commit('setAuthId', userId)
    },
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
      await dispatch('users/createUser', { id: result.user.uid, name, username, avatar, email }, { root: true })
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
        return dispatch('users/createUser', { id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoUrl }, { root: true })
      } else {
        return dispatch('fetchAuthUser')
      }
    },
    async signOut ({ commit }) {
      await firebase.auth().signOut()
      commit('setAuthId', null)
    },
    async fetchAllUsersPosts ({ commit, state }) {
      const posts = await firebase.firestore().collection('posts').where('userId', '==', state.authId).get()
      posts.forEach(item => {
        commit('setItem', { resource: 'posts', item }, { root: true })
      })
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe (state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe (state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
