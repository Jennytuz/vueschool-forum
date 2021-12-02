<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="user-info" v-if="getUser(post.userId, 'name')">
        <a href="#" class="user-name">{{getUser(post.userId, 'name')}}</a>
        <a href="#">
          <img class="avatar-large" :src="getUser(post.userId, 'avatar')" alt />
        </a>
        <p class="desktop-only text-small">{{getUser(post.userId, 'postsCount')}} posts</p>
         <p class="desktop-only text-small">{{getUser(post.userId, 'threadsCount')}} threads</p>
      </div>

      <div class="post-content">
        <div>
          <p>{{post.text}}</p>
        </div>
        <a href="#" style="margin-left: auto;" class="link-unstyled" title="Make a change">
          <i class="fa fa-pencil"></i>
        </a>
      </div>
      <div class="post-date text-faded">
        <app-date :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    getUser (userId, rtn) {
      return this.$store.getters.user(userId) ? this.$store.getters.user(userId)[rtn] : {}
    }
  }
}
</script>
<style scoped>
</style>
