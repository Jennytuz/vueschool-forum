import firebase from 'firebase'
import { findById, docToResource } from '@/helpers'

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
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    const userRef = firebase.firestore().collection('users').doc(state.authId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1)
    })
    await batch.commit()
    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } })
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async updatePost ({ commit, state }, { id, text }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = firebase.firestore().collection('posts').doc(id)
    await postRef.update(post)
    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: newPost })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const batch = firebase.firestore().batch()
    const threadRef = firebase.firestore().collection('threads').doc()
    const thread = { forumId, publishedAt, title, userId, id: threadRef.id, text }
    const userRef = firebase.firestore().collection('users').doc(userId)
    const forumRef = firebase.firestore().collection('forums').doc(forumId)
    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    await batch.commit()
    const newThread = await threadRef.get()
    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    await dispatch('createPost', { text, threadId: newThread.id })
    commit('appendThreadToForum', { childId: newThread.id, parentId: forumId })
    commit('appendThreadToUser', { childId: newThread.id, parentId: userId })
    return state.threads.find(thread => thread.id === newThread.id)
  },
  async updateThread ({ commit, state }, { text, title, threadId }) {
    const thread = findById(state.threads, threadId)
    const post = state.posts.find(post => post.id === thread.posts[0])
    let newThread = { ...thread, title }
    let newPost = {
      ...post,
      text
    }
    const batch = firebase.firestore().batch()
    const threadRef = firebase.firestore().collection('threads').doc(threadId)
    const postRef = firebase.firestore().collection('posts').doc(post.id)
    batch.update(threadRef, newThread)
    batch.update(postRef, newPost)
    await batch.commit()
    newThread = await threadRef.get()
    newPost = await postRef.get()
    commit('setItem', { resource: 'threads', item: docToResource(newThread) })
    commit('setItem', { resource: 'posts', item: docToResource(newPost) })
    return newThread
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
  async createUser ({ commit }, { id, email, name, username, avatar = null }) {
    const registerAt = firebase.firestore.FieldValue.serverTimestamp().seconds
    const usernameLower = username.toLowerCase()
    email = email.toLowerCase()
    const user = { avatar, email, name, username, usernameLower, registerAt }
    const userRef = await firebase.firestore().collection('users').doc(id)
    userRef.set(user)
    const newUser = await userRef.get()
    commit('setItem', { resource: 'users', item: newUser })
    return docToResource(newUser)
  },
  async signOut ({ commit }) {
    await firebase.auth().signOut()
    commit('setAuthId', null)
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
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
    })
    commit('setAuthId', userId)
  },
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: 'Thread:::' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🙋🏻‍♀️' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: 'Post:::' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: 'Forum:::' }),
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: 'Category:::' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: 'Posts:::' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋🏻‍♀️' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: 'Threads:::' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: 'Forums:::' }),
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: 'Categories:::' }),
  fetchAllCategories ({ commit }) {
    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })
        resolve(categories)
      })
    })
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
