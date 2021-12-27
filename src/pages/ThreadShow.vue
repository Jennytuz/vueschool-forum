<template>
  <div class="col-large push-top" v-if="asyncDataStatus_ready">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId === authUser?.id"
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
    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to='{ name: "SignIn", query: { redirectTo: $route.path } }'>Sign In</router-link>
      or
      <router-link :to='{ name: "Register", query: { redirectTo: $route.path } }'>Register</router-link>
      to reply!
    </div>
  </div>
</template>
<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate.vue'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import useNotifications from '@/composables/useNotifications'
import difference from 'lodash/difference'

export default {
  name: 'ThreadShow',
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: { PostList, PostEditor, AppDate },
  setup () {
    const { addNotification } = useNotifications()
    // addNotification({ message: 'new one' })
    return { addNotification }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    posts () {
      return this.$store.state.posts.items
    },
    threads () {
      return this.$store.state.threads.items
    },
    thread () {
      return this.$store.getters['threads/thread'](this.id)
    },
    threadPosts () {
      return this.posts.filter((post) => post.threadId === this.id)
    }
  },
  methods: {
    ...mapActions('posts', ['createPost', 'fetchPosts']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUsers']),
    addPost (eventData) {
      const post = {
        ...eventData,
        threadId: this.id
      }
      this.createPost(post)
    },
    async fetchPostsWithUsers (ids) {
      const posts = await this.fetchPosts({ ids: ids })
      const users = posts.map(post => post.userId).concat([this.thread.userId])
      await this.fetchUsers({ ids: users })
    }
  },

  async created () {
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return
        const newPostIds = difference(item.posts, previousItem.posts)
        this.fetchPostsWithUsers(newPostIds)
        this.addNotification({ message: 'update' })
      }
    })
    this.fetchPostsWithUsers(thread.posts)
    this.asyncDataStatus_fetched()
  }
}
</script>
