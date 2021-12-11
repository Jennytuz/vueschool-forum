import firebase from 'firebase'

export default {
  state: {
    authId: null,
    authUserUnsubscribes: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    }
  },
  actions: {
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
      })
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
