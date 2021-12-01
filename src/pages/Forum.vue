<template>
  <div class="col-full" v-if="forum && threads">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link :to="{name: 'ThreadCreate', params: {forumId: forum.id}}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>

    <div class="col-full push-top" v-if="threads && threads[0]">
      <thread-list :threads="threads"/>
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList.vue'
import { mapActions } from 'vuex'

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
  methods: {
    ...mapActions(['fetchUsers', 'fetchThreads', 'fetchForum'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreads({ ids: forum.threads })
    this.fetchUsers({ ids: threads.map(thread => thread.userId) })
  }
}
</script>
