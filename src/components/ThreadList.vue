<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link :to="{name: 'ThreadShow', params: {id: thread.id}}">{{ thread.title }}</router-link>
          </p>
          <p class="text-faded text-xsmall">
            <a href="#">{{getUser(thread.userId, 'name')}}</a>, {{ thread.publishedAt }}.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.posts.length}} Replies</p>

          <img
            class="avatar-medium"
            :src="getUser(thread.userId, 'avatar')"
            alt
          />

          <div>
            <p class="text-xsmall">
              <a href="profile.html">{{getUser(thread.userId, 'name')}}e</a>
            </p>
            <p class="text-xsmall text-faded">{{ thread.publishedAt }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sourceData from '@/data.json/'
export default {
  props: {
    threads: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  methods: {
    getPost (postId, rtn) {
      return this.posts.find((p) => p.id === postId)[rtn]
    },
    getUser (userId, rtn) {
      return this.users.find((u) => u.id === userId)[rtn]
    }
  }
}
</script>
<style scoped>
</style>
