<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>
<script>
import sourceData from '@/data.json/'
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
      threads: sourceData.threads,
      posts: sourceData.posts,
    }
  },
  computed: {
    thread () {
      return this.threads.find(thread => thread.id === this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost(post) {
      this.posts.push({ ...post, threadId: this.id })
      this.thread.posts.push(post.id)
    }
  }
}
</script>
