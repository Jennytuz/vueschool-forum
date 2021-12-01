<template>
  <div class="col-full" v-if="forum">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link :to="{name: 'ThreadCreate', params: {forumId: forum.id}}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <thread-list :threads="threads"/>
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList.vue'

export default {
  components: { ThreadList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.$store.getters.thread(threadId))
    }
  },
  async created () {
    const forum = await this.$store.dispatch('fetchForum', { id: this.id })
    const threads = await this.$store.dispatch('fetchThreads', { ids: forum.threads })
    this.$store.dispatch('fetchUsers', { ids: threads.map(thread => thread.userId) })
  }
}
</script>
