import { createStore } from 'vuex'
import firebase from 'firebase'
import { findById, upser } from '@/helpers'

export default createStore({
  state: {
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3',
    categories: [],
    threads: [],
    forums: [],
    posts: [],
    users: []
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          // authUser.posts
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postsCount () {
            return this.posts.length
          },
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          },
          get threadsCount () {
            return this.threads.length
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        return {
          ...thread,
          get author () {
            console.log(state.users, thread.userId)
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorCount () {
            return thread.contributors.length
          }
        }
      }
    }
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'dfafa' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
      commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
    },
    async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
      const id = 'dfafads' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { forumId, publishedAt, title, userId, id, text }
      commit('setThread', { thread })
      dispatch('createPost', { text, threadId: id })
      commit('appendThreadToForum', { childId: id, parentId: forumId })
      commit('appendThreadToUser', { childId: id, parentId: userId })
      return state.threads.find(thread => thread.id === id)
    },
    async updateThread ({ commit, state }, { text, title, threadId }) {
      const thread = findById(state.threads, threadId)
      const post = state.posts.find(post => post.id === thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = {
        ...post,
        text
      }
      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })
      return newThread
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    fetchThread ({ commit }, { id }) {
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection('threads')
          .doc(id)
          .onSnapshot((doc) => {
            const thread = { ...doc.data(), id: doc.id }
            commit('setThread', { thread })
            resolve(thread)
          })
      })
    },
    fetchUser ({ commit }, { id }) {
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection('users')
          .doc(id)
          .onSnapshot((doc) => {
            const user = { ...doc.data(), id: doc.id }
            commit('setUser', { user })
            resolve(user)
          })
      })
    },
    fetchPost ({ commit }, { id }) {
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection('posts')
          .doc(id)
          .onSnapshot((doc) => {
            const post = { ...doc.data(), id: doc.id }
            commit('setPost', { post })
            resolve(post)
          })
      })
    }
  },
  mutations: {
    setPost (state, { post }) {
      upser(state.posts, post)
    },
    setThread (state, { thread }) {
      console.log('=====')
      upser(state.threads, thread)
    },
    setUser (state, { user }) {
      upser(state.users, user)
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
