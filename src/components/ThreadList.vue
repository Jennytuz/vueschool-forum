<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link v-if="thread" :to="{name: 'ThreadShow', params: {id: thread.id}}">{{ thread.title }}</router-link>
          </p>
          <p class="text-faded text-xsmall">
            <a href="#">{{getUser(thread.userId, 'name')}}</a>, <app-date :timestamp="thread.publishedAt"/>.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.repliesCount}} Replies</p>

          <img
            class="avatar-medium"
            :src="getUser(thread.userId, 'avatar')"
            alt
          />

          <div>
            <p class="text-xsmall">
              <a href="profile.html">{{getUser(thread.userId, 'name')}}e</a>
            </p>
            <p class="text-xsmall text-faded">
              <app-date :timestamp="thread.publishedAt"/>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    threads: {
      required: true,
      type: Array
    }
  },
  computed: {
    posts () {
      return this.$store.state.posts.items
    },
    users () {
      return this.$store.state.users.items
    }
  },
  methods: {
    getPost (postId, rtn) {
      return this.posts.find((p) => p.id === postId)[rtn]
    },
    getUser (userId, rtn) {
      return this.users.find((u) => u.id === userId) ? this.users.find((u) => u.id === userId)[rtn] : {}
    }
  }
}
</script>
<style scoped>
</style>
