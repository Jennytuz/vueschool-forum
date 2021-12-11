import { findById, docToResource, makeAppendChildToParentMutation } from '@/helpers'
import firebase from 'firebase'

export default {
  state: {
    items: []
  },
  getters: {
    thread: state => {
      return (id) => {
        const thread = findById(state.items, id)
        if (!thread) return {}
        return {
          ...thread,
          get author () {
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
      return state.items.find(thread => thread.id === newThread.id)
    },
    async updateThread ({ commit, state }, { text, title, threadId }) {
      const thread = findById(state.items, threadId)
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
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: 'Thread:::' }),
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: 'Threads:::' })
  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
}
