<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>
<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
export default {
  name: 'ThreadShow',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: { PostList, PostEditor },
  data () {
    return {
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    threads() {
      return this.$store.state.threads
    },
    thread () {
      return this.threads.find(thread => thread.id === this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost(eventData) {
      const post = {
        ...eventData,
        threadId: this.id
      }
      this.$store.dispatch('createPost', post)
    }
  }
}
</script>
