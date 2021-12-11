import firebase from 'firebase'

export default {
  state: {
    items: []
  },
  getters: {
  },
  actions: {
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
    async fetchAllUsersPosts ({ commit, state }) {
      const posts = await firebase.firestore().collection('posts').where('userId', '==', state.authId).get()
      console.log(posts)
      posts.forEach(item => {
        commit('setItem', { resource: 'posts', item })
      })
    },
    fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: 'Post:::' }),
    fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: 'Posts:::' })
  },
  mutations: {
  }
}
