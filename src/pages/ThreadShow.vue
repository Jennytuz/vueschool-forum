<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: thread.id }"
        class="btn-green btn-small"
        tag="button"
      >Edit</router-link>
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled">{{ thread.author?.name}}</a>,
      <app-date :timestamp="thread.publishedAt" />.
      <span
        style="float:right margin-top: 2px"
        class="hide-mobile text-faded text-small"
      >{{thread.repliesCount}} replies by {{thread.contributorCount}} contributors</span>
    </p>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>
<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate.vue'

export default {
  name: 'ThreadShow',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: { PostList, PostEditor, AppDate },
  data () {
    return {}
  },
  computed: {
    posts () {
      return this.$store.state.posts
    },
    threads () {
      return this.$store.state.threads
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter((post) => post.threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData,
        threadId: this.id
      }
      this.$store.dispatch('createPost', post)
    }
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })
    this.$store.dispatch('fetchUser', { id: thread.userId })

    const posts = await this.$store.dispatch('fetchPosts', { ids: thread.posts })
    this.$store.dispatch('fetchUsers', { id: posts.map(post => post.userId) })
  }
}
</script>
